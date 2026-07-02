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

export default function App() {
  return (
    <Routes>
      <Route path="/editar/local" element={<EditarLocal />} />
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/dashboard/local" element={<DashboardLocal />} />
      <Route path="/dashboard/musico" element={<DashboardMusico />} />
      <Route path="/editar/perfil" element={<EditarPerfil />} />
      <Route path="/editar/musico" element={<EditarMusico />} />
      <Route path="/musico/:id" element={<PerfilMusico />} />
      <Route path="/solicitud/:id" element={<SolicitudMusico />} />
      <Route path="/olvide-password" element={<OlvidePassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}