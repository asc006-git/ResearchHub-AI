import api from "./axios"

// Create workspace
export const createWorkspace = (name: string) => {
  return api.post("/chat/workspace", { name })
}

// Send chat message
export const sendMessage = (workspaceId: number, content: string) => {
  return api.post(`/chat/${workspaceId}`, {
    content,
  })
}

export const getWorkspaces = () => {
  return api.get("/chat/workspace")
}

export const getPapers = () => {
  return api.get("/chat/papers")
}