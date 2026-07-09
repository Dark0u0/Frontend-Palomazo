import { Navigate } from 'react-router-dom'

export default function RutaProtegida({ children, rolRequerido }) {
  const token = localStorage.getItem('token')
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  // Si no hay token, manda al login
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // Si se requiere un rol específico y no coincide, manda al dashboard correcto
  if (rolRequerido && usuario.rol !== rolRequerido) {
    return <Navigate to={usuario.rol === 'musico' ? '/dashboard/musico' : '/dashboard/local'} replace />
  }

  return children
}