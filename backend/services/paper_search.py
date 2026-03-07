import httpx
import time
from typing import List, Dict, Tuple

OPENALEX_SEARCH_URL = "https://api.openalex.org/works"

# In-memory cache
_cache: Dict[str, Tuple[float, List[Dict]]] = {}

CACHE_TTL_SECONDS = 300  # 5 minutes


async def search_papers(query: str, limit: int = 10) -> List[Dict]:
    """
    Search for academic papers using OpenAlex API.
    Results are cached for 5 minutes to reduce API requests.
    """

    cache_key = f"{query.strip().lower()}|{limit}"
    now = time.time()

    # Return cached results if available
    if cache_key in _cache:
        cached_at, cached_results = _cache[cache_key]
        if now - cached_at < CACHE_TTL_SECONDS:
            print(f"[paper_search] Cache hit for query: '{query}'")
            return cached_results

    params = {
        "search": query,
        "per_page": limit
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                OPENALEX_SEARCH_URL,
                params=params,
                timeout=15.0
            )

            response.raise_for_status()

            data = response.json()

            papers = []

            for item in data.get("results", []):

                # Extract authors
                authors_list = []
                for author in item.get("authorships", [])[:5]:
                    if "author" in author and author["author"]:
                        authors_list.append(author["author"].get("display_name"))

                authors_str = ", ".join(authors_list)
                if len(item.get("authorships", [])) > 5:
                    authors_str += " et al."

                # Extract abstract if available
                abstract = "No abstract available."
                if item.get("abstract_inverted_index"):
                    words = []
                    for word, positions in item["abstract_inverted_index"].items():
                        for pos in positions:
                            words.append((pos, word))
                    words_sorted = [w for _, w in sorted(words)]
                    abstract = " ".join(words_sorted)

                papers.append(
                    {
                        "title": item.get("display_name"),
                        "authors": authors_str or "Unknown Authors",
                        "abstract": abstract,
                        "year": item.get("publication_year"),
                        "url": item.get("id"),
                    }
                )

            # Store results in cache
            _cache[cache_key] = (now, papers)

            print(f"[paper_search] Found {len(papers)} papers for query: '{query}'")

            return papers

        except httpx.TimeoutException:
            print(f"[paper_search] Request timed out for query: '{query}'")
            return _cache.get(cache_key, (0, []))[1]

        except Exception as e:
            print(f"[paper_search] Error fetching papers from OpenAlex: {e}")
            return []