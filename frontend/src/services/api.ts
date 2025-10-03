import axios from 'axios'
const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1'
export const api = axios.create({ baseURL })

// refresh queue
let isRefreshing = false
let queue: Array<(t: string) => void> = []
const processQueue = (t: string) => { queue.forEach(cb => cb(t)); queue = [] }

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return Promise.reject(error)

      if (isRefreshing) {
        // wait for current refresh
        return new Promise(resolve => {
          queue.push((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`
            resolve(api(original))
          })
        })
      }

      // do refresh
      isRefreshing = true
      try {
        const resp = await axios.post(`${baseURL}/auth/refresh`, { refreshToken })
        const newToken = resp.data.accessToken
        localStorage.setItem('accessToken', newToken)
        processQueue(newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(error)
  }
)
