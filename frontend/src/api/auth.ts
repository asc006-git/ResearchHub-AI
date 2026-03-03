import api from "./axios"

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