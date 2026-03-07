from utils.groq_client import client, GROQ_MODEL_CONFIG


class ResearchAssistant:
    """Intelligent research assistant powered by Groq LLM."""

    def create_research_context(self, papers: list, query: str) -> str:
        """
        Combine papers into a structured academic context string.
        
        Args:
            papers: List of paper dicts or ORM objects with title, authors, abstract, year
            query: The user's research question
            
        Returns:
            Structured context string suitable for LLM prompting
        """
        if not papers:
            return "No papers available. Provide a general scholarly response."

        context_parts = []
        for i, paper in enumerate(papers, 1):
            # Handle ORM row-like objects and plain dicts
            title = getattr(paper, "title", None) or paper.get("title", "Untitled")
            authors = getattr(paper, "authors", None) or paper.get("authors", "Unknown Authors")
            abstract = getattr(paper, "abstract", None) or paper.get("abstract", "No abstract available.")
            year = getattr(paper, "year", None) or paper.get("year", "")

            context_parts.append(
                f"[{i}] Title: {title}\n"
                f"    Authors: {authors}" + (f" ({year})" if year else "") + "\n"
                f"    Abstract: {abstract}\n"
            )

        return "RESEARCH CORPUS:\n\n" + "\n".join(context_parts)

    def generate_research_response(self, context: str, query: str) -> str:
        """
        Send a research question to Groq along with the paper context.
        
        Args:
            context: Structured context from create_research_context()
            query: The user's research question
            
        Returns:
            AI-generated scholarly response
        """
        system_prompt = (
            "You are an expert academic research assistant with deep expertise in "
            "synthesizing scientific literature. Your task is to provide rigorous, "
            "evidence-based responses grounded in the provided research corpus. "
            "Cite specific papers when relevant, identify patterns, conflicts, and key "
            "contributions. Maintain formal academic tone."
        )

        user_prompt = f"Context:\n{context}\n\nQuestion: {query}"

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            **GROQ_MODEL_CONFIG,
        )

        return response.choices[0].message.content

    def generate_response_with_history(
        self, context: str, query: str, history: list
    ) -> str:
        """
        Generate a response with multi-turn conversation history.
        
        Args:
            context: Structured context from create_research_context()
            query: The current user question
            history: List of {'role': 'user'|'assistant', 'content': str} dicts
            
        Returns:
            AI-generated scholarly response
        """
        system_prompt = (
            "You are an expert academic research assistant. Use the research corpus below "
            "together with the conversation history to provide accurate, evidence-based answers. "
            "Maintain continuity with prior exchanges and cite papers when relevant.\n\n"
            f"Research Corpus:\n{context}"
        )

        messages = [{"role": "system", "content": system_prompt}]

        # Append prior conversation turns (last 5 interactions = 10 messages)
        messages.extend(history)

        # Append the current user question
        messages.append({"role": "user", "content": query})

        response = client.chat.completions.create(
            messages=messages,
            **GROQ_MODEL_CONFIG,
        )

        return response.choices[0].message.content

    def generate_paper_summary(self, paper: dict) -> str:
        """Generate a concise AI summary of a specific paper."""
        system_prompt = (
            "You are an expert scientific communicator. Summarize the following "
            "academic paper focusing on: 1. Core objective 2. Methodology "
            "3. Key findings 4. Significance. Keep it under 250 words."
        )
        
        user_prompt = (
            f"Title: {paper.get('title', 'Unknown')}\n"
            f"Authors: {paper.get('authors', 'Unknown')}\n"
            f"Abstract: {paper.get('abstract', 'No abstract available.')}"
        )

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            **GROQ_MODEL_CONFIG,
        )
        return response.choices[0].message.content

    def generate_research_timeline(self, papers: list) -> list:
        """Synthesize a structured research timeline from a list of papers."""
        if not papers:
            return []

        system_prompt = (
            "You are an academic historian. Given a list of research papers, "
            "create a chronological timeline of key milestones and evolutions "
            "represented by these specific works. Return a series of event "
            "descriptions. Be concise."
        )
        
        corpus = ""
        for p in papers:
            year = getattr(p, "year", None) or p.get("year", "Unknown")
            title = getattr(p, "title", None) or p.get("title", "Untitled")
            abstract = getattr(p, "abstract", None) or p.get("abstract", "")
            corpus += f"- [{year}] {title}: {abstract[:100]}...\n"

        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Create timeline for:\n{corpus}"},
            ],
            **GROQ_MODEL_CONFIG,
        )
        
        # We'll parse the response into a list of structured events in the router
        # or just return the text for now if the frontend handles it. 
        # But for logic simplicity, we return the text and let the router format it.
        return response.choices[0].message.content
