// import { useState } from "react"
// import { useNavigate } from "react-router-dom"
// import { registerUser } from "../api/auth"

// export default function Register() {
//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const navigate = useNavigate()

//   const handleSubmit = async (e: any) => {
//     e.preventDefault()

//     try {
//       await registerUser({
//         email,
//         password,
//         is_admin: false,
//       })

//       alert("Registration successful. Please login.")
//       navigate("/")
//     } catch (err) {
//       alert("Registration failed")
//     }
//   }

//   return (
//     <div className="h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-8 shadow-lg rounded w-96"
//       >
//         <h2 className="text-2xl font-bold mb-6">Register</h2>

//         <input
//           className="w-full p-2 border mb-4"
//           placeholder="Email"
//           onChange={(e) => setEmail(e.target.value)}
//         />

//         <input
//           type="password"
//           className="w-full p-2 border mb-4"
//           placeholder="Password"
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button className="w-full bg-green-600 text-white p-2 rounded">
//           Register
//         </button>
//       </form>
//     </div>
//   )
// }


import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerUser } from "../api/auth"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      await registerUser({
        email,
        password,
        is_admin: false,
      })

      alert("Registration successful! Please login.")
      navigate("/")
    } catch (err) {
      alert("Registration failed")
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-lg rounded w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        <input
          className="w-full p-2 border mb-4 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border mb-4 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded transition">
          Register
        </button>

        {/* Login Link */}
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  )
}