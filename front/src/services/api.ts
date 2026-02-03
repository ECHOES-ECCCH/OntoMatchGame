import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/php',
  withCredentials: true,
})

export default api
