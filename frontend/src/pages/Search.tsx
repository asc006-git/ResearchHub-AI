import { useState } from "react"

export default function Search() {
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    console.log("Searching for:", query)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Search Papers</h1>

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

      <div className="mt-8 text-gray-500">
        Results will appear here.
      </div>
    </div>
  )
}