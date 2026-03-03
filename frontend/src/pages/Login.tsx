// export default function Login() {
//   return <div>Login Page</div>
// }

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../api/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      // const res = await loginUser({ email, password })
      const res = await loginUser(email, password)
      localStorage.setItem("token", res.data.access_token)
      navigate("/dashboard")
    } catch (err) {
      alert("Invalid credentials")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded w-96"
      >
        <h2 className="text-2xl font-bold mb-6">Login</h2>

        <input
          className="w-full p-2 border mb-4"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border mb-4"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  )
}