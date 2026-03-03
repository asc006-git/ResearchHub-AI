// import { useParams } from "react-router-dom"

// export default function Workspace() {
//   const { id } = useParams()

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold">Workspace {id}</h1>

//       <div className="mt-6">
//         <h2 className="text-lg font-semibold mb-4">Chat with Research Papers</h2>

//         <div className="border p-4 h-64 overflow-y-auto mb-4">
//           Chat messages will appear here.
//         </div>

//         <input
//           className="border p-2 w-full"
//           placeholder="Ask a research question..."
//         />
//       </div>
//     </div>
//   )
// }


import { useParams } from "react-router-dom"
import { useState } from "react"
import { sendMessage } from "../api/chat"

export default function Workspace() {
  const { id } = useParams()
  const workspaceId = Number(id)

  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([])

  const handleSend = async () => {
    if (!message.trim()) return

    const userMessage = { role: "user", content: message }

    setChatHistory((prev) => [...prev, userMessage])
    setMessage("")

    try {
      const res = await sendMessage(workspaceId, message)

      const aiMessage = {
        role: "assistant",
        content: res.data.response,
      }

      setChatHistory((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Chat error:", err)
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Workspace {workspaceId}
      </h1>

      {/* Chat Display */}
      <div className="border p-4 h-96 overflow-y-auto mb-4 rounded bg-white shadow">
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 ${
              msg.role === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="Ask a research question..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}