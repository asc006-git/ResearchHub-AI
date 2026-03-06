import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../api/auth"
import { createWorkspace, getWorkspaces } from "../api/chat"

export default function Dashboard() {

  const [user, setUser] = useState<any>(null)
  const [workspaceName, setWorkspaceName] = useState("")
  const [workspaces, setWorkspaces] = useState<any[]>([])

  const navigate = useNavigate()

  useEffect(() => {

    const fetchData = async () => {

      try {

        const userRes = await getCurrentUser()
        setUser(userRes.data)

        const wsRes = await getWorkspaces()
        setWorkspaces(wsRes.data)

      } catch (err) {

        console.error("Unauthorized", err)

      }

    }

    fetchData()

  }, [])

  const handleCreateWorkspace = async () => {

    if (!workspaceName.trim()) return

    try {

      const res = await createWorkspace(workspaceName)

      const workspaceId = res.data.id

      navigate(`/workspace/${workspaceId}`)

    } catch (err) {

      console.error(err)
      alert("Failed to create workspace")

    }

  }

  return (

    <div className="p-8 max-w-xl mx-auto">

      <h1 className="text-2xl font-bold">Dashboard</h1>

      {user ? (
        <div className="mt-4">
          <p className="text-gray-700">Email: {user.email}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Loading user info...</p>
      )}

      {/* Create Workspace Section */}
      <div className="mt-8 bg-white p-6 shadow rounded">

        <h2 className="text-xl font-semibold mb-4">
          Create Workspace
        </h2>

        <input
          className="border p-2 w-full mb-4 rounded"
          placeholder="Workspace name"
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
        />

        <button
          onClick={handleCreateWorkspace}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Workspace
        </button>

      </div>

      {/* Existing Workspaces */}

      <div className="mt-8">

        <h2 className="text-xl font-semibold mb-4">
          Your Workspaces
        </h2>

        {workspaces.length === 0 && (
          <p className="text-gray-500">
            No workspaces yet.
          </p>
        )}

        {workspaces.map((ws) => (

          <div
            key={ws.id}
            className="border p-3 mb-3 rounded cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/workspace/${ws.id}`)}
          >

            {ws.name}

          </div>

        ))}

      </div>

      {/* Search Papers Button */}

      <div className="mt-6">

        <button
          onClick={() => navigate("/search")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Search Papers
        </button>

      </div>

    </div>

  )

}