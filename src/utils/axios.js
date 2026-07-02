import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const axiosInstance = axios.create({
  baseURL: API
})

// Agrega el token automáticamente a cada petición
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Detecta sesión desplazada en cualquier respuesta
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.data?.codigo === 'SESION_DESPLAZADA') {
      localStorage.clear()
      alert('Tu sesión fue cerrada porque iniciaste sesión en otro dispositivo.')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
export { API }