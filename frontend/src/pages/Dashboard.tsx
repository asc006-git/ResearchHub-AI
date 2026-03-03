import { useEffect, useState } from "react"
import { getCurrentUser } from "../api/auth"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser()
        setUser(res.data)
      } catch (err) {
        console.error("Unauthorized")
      }
    }

    fetchUser()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {user ? (
        <div className="mt-4">
          <p className="text-gray-700">Email: {user.email}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Loading user info...</p>
      )}
    </div>
  )
}