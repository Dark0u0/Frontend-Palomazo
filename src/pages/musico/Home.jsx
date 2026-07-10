import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import { s } from './styles'
import Sidebar from './components/Sidebar'
import HomeMusico from './components/HomeMusico'
import MisShows from './components/MisShows'
import MisResenas from './components/MisResenas'
import MiBanda from './components/MiBanda'
import MiCuenta from '../../components/MiCuenta'
import Solicitudes from './components/Solicitudes'

export default function Home() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const perfil = usuario.perfil || {}
  const [tab, setTab] = useState('dashboard')
  const [solicitudes, setSolicitudes] = useState([])

  const cargarSolicitudes = () => {
    if (!perfil.id) return
    axios.get(`/solicitudes/musico/${perfil.id}`)
      .then(res => setSolicitudes(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    cargarSolicitudes()
    const intervalo = setInterval(cargarSolicitudes, 8000)
    return () => clearInterval(intervalo)
  }, [perfil.id])

  const resenas = []

  const colorEstado = (estado) => {
    if (estado === 'liberado') return '#22C55E'
    if (estado === 'parcial') return '#F59E0B'
    if (estado === 'cancelado') return '#EF4444'
    return '#A855F7'
  }

  const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

  const cerrarSesion = async () => {
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
      await axios.post('/auth/logout', { id: usuarioGuardado.id })
    } catch (e) {
      // si falla, igual cerramos sesión localmente
    }
    localStorage.clear()
    navigate('/login')
  }

  const generos = Array.isArray(perfil.generos) ? perfil.generos : []

  const showsConPago = solicitudes.filter(s => s.pago && (s.pago.estado === 'parcial' || s.pago.estado === 'liberado'))
  const historial = solicitudes.filter(s => s.pago?.estado === 'liberado')
  const pendientes = solicitudes.filter(s => s.estado === 'pendiente')

  const ahora = new Date()
  const gananciasMes = solicitudes
    .filter(s => s.pago?.estado === 'liberado' && new Date(s.pago.fechaPago).getMonth() === ahora.getMonth())
    .reduce((acc, s) => acc + parseFloat(s.monto), 0)

  return (
    <div style={s.container}>
      <Sidebar tab={tab} setTab={setTab} usuario={usuario} perfil={perfil} navigate={navigate} cerrarSesion={cerrarSesion}/>
      <div style={s.contenido}>
        {tab === 'dashboard' && (
          <HomeMusico
            usuario={usuario}
            perfil={perfil}
            showsConPago={showsConPago}
            gananciasMes={gananciasMes}
            colorEstado={colorEstado}
          />
        )}
        {tab === 'shows' && (
          <MisShows
            historial={historial}
            colorEstado={colorEstado}
            pendientesCount={pendientes.length}
            onVerSolicitudes={() => setTab('solicitudes')}
          />
        )}
        {tab === 'solicitudes' && (
          <Solicitudes
            solicitudes={pendientes}
            onVolver={() => setTab('shows')}
            onRespondida={cargarSolicitudes}
          />
        )}
        {tab === 'resenas' && (
          <MisResenas musicoId={perfil.id}/>
        )}
        {tab === 'cuenta' && (
          <MiCuenta usuario={usuario} navigate={navigate}/>
        )}
        {tab === 'banda' && (
          <MiBanda perfil={perfil} generos={generos} navigate={navigate}/>
        )}
      </div>
    </div>
  )
}