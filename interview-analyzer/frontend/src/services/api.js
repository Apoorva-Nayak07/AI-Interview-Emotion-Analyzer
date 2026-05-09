import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth services
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password })
}

// Session services
export const sessionService = {
  getAllSessions: () => api.get('/sessions'),
  getSessionById: (id) => api.get(`/sessions/${id}`),
  createSession: (sessionData) => api.post('/sessions', sessionData),
  updateSession: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  deleteSession: (id) => api.delete(`/sessions/${id}`)
}

// Analysis services
export const analysisService = {
  analyzeEmotion: (emotionData) => api.post('/analysis/emotion', emotionData),
  analyzeSpeech: (speechData) => api.post('/analysis/speech', speechData),
  generateFeedback: (sessionData) => api.post('/analysis/feedback', sessionData)
}

export default api
