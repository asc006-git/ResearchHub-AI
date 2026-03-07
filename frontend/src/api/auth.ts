import api from "./axios"

// Register (JSON body)
export const registerUser = (data: {
  email: string
  password: string
  is_admin: boolean
}) => {
  return api.post("/auth/register", data)
}

// Login (form-urlencoded because backend uses OAuth2PasswordRequestForm)
export const loginUser = async (email: string, password: string) => {
  const formData = new URLSearchParams()
  formData.append("username", email)
  formData.append("password", password)

  return api.post("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
}

// Get current logged-in user
export const getCurrentUser = () => {
  return api.get("/auth/me")
}