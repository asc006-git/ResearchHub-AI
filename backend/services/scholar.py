import httpx
from typing import List, Optional, Dict

SEMANTIC_SCHOLAR_SEARCH_URL = "https://api.semanticscholar.org/graph/v1/paper/search"

async def search_academic_papers(query: str, limit: int = 10) -> List[Dict]:
    """
    Search for academic papers using Semantic Scholar API.
    """
    params = {
        "query": query,
        "limit": limit,
        "fields": "title,authors,abstract,year,url,venue,citationCount"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(SEMANTIC_SCHOLAR_SEARCH_URL, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            papers = []
            for item in data.get("data", []):
                # Format authors for consistency
                authors_list = [a.get("name") for a in item.get("authors", [])]
                authors_str = ", ".join(authors_list[:5])
                if len(authors_list) > 5:
                    authors_str += " et al."
                
                papers.append({
                    "title": item.get("title"),
                    "authors": authors_str or "Unknown Authors",
                    "abstract": item.get("abstract") or "No abstract available.",
                    "year": item.get("year"),
                    "url": item.get("url"),
                    "venue": item.get("venue"),
                    "citations": item.get("citationCount", 0)
                })
            return papers
        except Exception as e:
            print(f"Error fetching papers from Semantic Scholar: {e}")
            return []
