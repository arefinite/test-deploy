import axios from 'axios'

const baseURL = 'https://test-deploy-he88.onrender.com'

const api = axios.create({
  baseURL
})

export const createBook = async (data: FormData) =>
  api.post(`${baseURL}/api/v1/ebook`, data)
