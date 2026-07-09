import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Registro from './pages/auth/Registro'
import DashboardLocal from './pages/local/Home'
import DashboardMusico from './pages/musico/Home'
import EditarPerfil from './pages/EditarPerfil'
import EditarMusico from './pages/musico/EditarMusico'
import PerfilMusico from './pages/musico/PerfilMusico'
import EditarLocal from './pages/local/EditarLocal'
import SolicitudMusico from './pages/local/SolicitudMusico'
import OlvidePassword from './pages/auth/OlvidePassword'
import ResetPassword from './pages/auth/ResetPassword'
import RutaProtegida from './components/RutaProtegida'

export default function App() {
  return (
    <Routes>
      {/* Ruta raíz → redirige al login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/olvide-password" element={<OlvidePassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Rutas privadas — solo músicos */}
      <Route path="/dashboard/musico" element={
        <RutaProtegida rolRequerido="musico">
          <DashboardMusico />
        </RutaProtegida>
      } />
      <Route path="/editar/musico" element={
        <RutaProtegida rolRequerido="musico">
          <EditarMusico />
        </RutaProtegida>
      } />

      {/* Rutas privadas — solo locales */}
      <Route path="/dashboard/local" element={
        <RutaProtegida rolRequerido="local">
          <DashboardLocal />
        </RutaProtegida>
      } />
      <Route path="/editar/local" element={
        <RutaProtegida rolRequerido="local">
          <EditarLocal />
        </RutaProtegida>
      } />
      <Route path="/solicitud/:id" element={
        <RutaProtegida rolRequerido="local">
          <SolicitudMusico />
        </RutaProtegida>
      } />

      {/* Rutas privadas — cualquier rol */}
      <Route path="/editar/perfil" element={
        <RutaProtegida>
          <EditarPerfil />
        </RutaProtegida>
      } />
      <Route path="/musico/:id" element={
        <RutaProtegida>
          <PerfilMusico />
        </RutaProtegida>
      } />

      {/* Cualquier ruta no encontrada → login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}