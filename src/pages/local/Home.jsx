import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'
import { s } from './styles'
import Sidebar from './components/Sidebar'
import HomeLocal from './components/HomeLocal'
import BuscarMusicos from './components/BuscarMusicos'
import MiLocal from './components/MiLocal'
import MiCuenta from '../../components/MiCuenta'
import ConfirmacionPagos from './components/ConfirmacionPagos'

export default function Home() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const perfil = usuario.perfil || {}
  const [tab, setTab] = useState('dashboard')
  const [musicos, setMusicos] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [pagos, setPagos] = useState([])

  useEffect(() => {
    if (tab === 'musicos') {
      axios.get('/musicos')
        .then(res => setMusicos(res.data))
        .catch(console.error)
    }
if (tab === 'dashboard') {
  axios.get(`/pagos/local/${perfil.id}`)
    .then(res => setPagos(res.data.map(p => ({
      id: p.id,
      artista: p.solicitud.musico.nombreArtistico,
      musicoFoto: p.solicitud.musico.foto || null,
      musicoId: p.solicitud.musicoId,
      localId: p.solicitud.localId,
      fecha: new Date(p.solicitud.fecha).toLocaleDateString('es-MX'),
      hora: p.solicitud.horaInicio,
      monto: parseFloat(p.monto),
      estado: p.estado,
      resenado: p.resenado
    }))))
    .catch(console.error)
}
  }, [tab])

  const colorEstado = (estado) => {
    if (estado === 'liberado') return '#22C55E'
    if (estado === 'parcial') return '#F59E0B'
    if (estado === 'cancelado') return '#EF4444'
    return '#A855F7'
  }

const liberarPago = async (id) => {
  try {
    const { data } = await axios.put(`/pagos/${id}/liberar`)
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado: data.estado } : p))
  } catch (e) {
    console.error(e)
    alert('No se pudo liberar el pago. Intenta de nuevo.')
  }
}

const cancelarPago = async (id) => {
  try {
    const { data } = await axios.put(`/pagos/${id}/cancelar`)
    setPagos(prev => prev.map(p => p.id === id ? { ...p, estado: data.estado } : p))
  } catch (e) {
    console.error(e)
    alert('No se pudo cancelar el pago. Intenta de nuevo.')
  }
}

  const pagosPendientes = pagos.filter(p => p.estado !== 'liberado' && p.estado !== 'cancelado')

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

  const estrellas = (n) => {
    if (!n) return '☆☆☆☆☆'
    return '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))
  }

  return (
    <div style={s.container}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        usuario={usuario}
        perfil={perfil}
        navigate={navigate}
        cerrarSesion={cerrarSesion}
      />
      <div style={s.contenido}>
        {tab === 'dashboard' && (
          <HomeLocal
            usuario={usuario}
            pagos={pagos}
            pagosPendientes={pagosPendientes}
            colorEstado={colorEstado}
            liberarPago={liberarPago}
            cancelarPago={cancelarPago}
          />
        )}
        {tab === 'musicos' && (
          <BuscarMusicos
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            musicos={musicos}
            estrellas={estrellas}
            navigate={navigate}
          />
        )}
        {tab === 'milocal' && (
          <MiLocal perfil={perfil} navigate={navigate}/>
        )}
        {tab === 'cuenta' && (
          <MiCuenta usuario={usuario} navigate={navigate}/>
        )}
        {tab === 'pagos' && (
          <ConfirmacionPagos localId={perfil.id}/>
        )}
      </div>
    </div>
  )
}