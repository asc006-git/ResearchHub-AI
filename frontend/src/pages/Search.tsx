import { useState } from "react"
import { searchPapers, importPaper } from "../api/papers"

export default function Search() {

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {

    if (!query.trim()) return

    try {

      const res = await searchPapers(query)

      setResults(res.data.papers)

    } catch (err) {

      console.error("Search failed", err)

    }
  }

  const handleImport = async (paper: any) => {

  const payload = {
    title: paper.title,
    authors: paper.authors,
    abstract: paper.abstract,
    published_date: paper.published_date
  }

  try {
    await importPaper(payload)

    alert("Paper imported successfully")

  } catch (err) {
    console.error("Import failed", err)
  }
}

  return (

    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">
        Search Research Papers
      </h1>

      <div className="flex gap-4">

        <input
          className="border p-2 flex-1"
          placeholder="Search research papers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>

      </div>

      <div className="mt-8">

        {results.length === 0 && (
          <p className="text-gray-500">
            Results will appear here.
          </p>
        )}

        {results.map((paper, index) => (

          <div key={index} className="border p-4 mb-4 rounded">

            <h2 className="font-semibold">
              {paper.title}
            </h2>

            <p className="text-sm text-gray-600 mt-2">
              {paper.authors}
            </p>

            <p className="text-sm mt-3">
              {paper.abstract}
            </p>

            <button
              onClick={() => handleImport(paper)}
              className="bg-green-600 text-white px-3 py-1 mt-3 rounded"
            >
              Import Paper
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}