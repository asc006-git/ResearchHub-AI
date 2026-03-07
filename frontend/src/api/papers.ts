import api from "./axios"

export const searchPapers = (query: string) => {
  return api.get("/papers/search", {
    params: { query }
  })
}

export const importPaper = (paper: any) => {
  return api.post("/papers/import", paper)
}