import axios from 'axios'

const API_BASE_URL = 'http://127.0.0.1:8000'

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// اضافه کردن توکن به هر درخواست (اگه موجود باشه)
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitclub-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// مدیریت خطاها
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // توکن منقضی شده
      localStorage.removeItem('fitclub-token')
      localStorage.removeItem('fitclub-user')
    }
    return Promise.reject(error)
  }
)

export default client