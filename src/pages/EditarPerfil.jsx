import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'
const CARD = '#1A1A1A'
const BORDE = '#2A2A2A'

export default function EditarPerfil() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  const [nombre, setNombre] = useState(usuario.nombre || '')
  const [email, setEmail] = useState(usuario.email || '')
  const [telefono, setTelefono] = useState(usuario.telefono || '')
  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [eliminando, setEliminando] = useState(false)

  const guardar = async (e) => {
    e.preventDefault()
    setError('')
    setExito('')
    if (password && password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      const body = { nombre, email, telefono }
      if (password) body.password = password
      await axios.put(`${API}/usuario/${usuario.id}`, body)
      const actualizado = { ...usuario, nombre, email, telefono }
      localStorage.setItem('usuario', JSON.stringify(actualizado))
      setExito('Datos actualizados correctamente')
    } catch (e) {
      setError(e.response?.data?.error || 'Error al actualizar')
    }
  }

  const eliminarCuenta = async () => {
    try {
      await axios.delete(`${API}/usuario/${usuario.id}`)
      localStorage.clear()
      navigate('/login')
    } catch (e) {
      setError('Error al eliminar la cuenta')
    }
  }

  const volverDashboard = () => {
    navigate(usuario.rol === 'musico' ? '/dashboard/musico' : '/dashboard/local')
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
          <button onClick={volverDashboard} style={s.btnVolver}>← Volver</button>
          <h1 style={s.titulo}>Mi cuenta</h1>
        </div>

        {error && <div style={s.error}>{error}</div>}
        {exito && <div style={s.exito}>{exito}</div>}

        <form onSubmit={guardar} style={s.form}>
          <label style={s.label}>Nombre</label>
          <input style={s.input} type="text" value={nombre} onChange={e => setNombre(e.target.value)} required/>

          <label style={s.label}>Email</label>
          <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required/>

          <label style={s.label}>Teléfono</label>
          <input style={s.input} type="tel" value={telefono} onChange={e => setTelefono(e.target.value)} required/>

          <div style={s.divider}/>
          <p style={s.seccion}>Cambiar contraseña</p>
          <p style={s.hint}>Deja en blanco si no quieres cambiarla</p>

          <label style={s.label}>Nueva contraseña</label>
          <input style={s.input} type="password" placeholder="Nueva contraseña" value={password} onChange={e => setPassword(e.target.value)}/>

          <label style={s.label}>Confirmar contraseña</label>
          <input style={s.input} type="password" placeholder="Confirmar contraseña" value={confirmar} onChange={e => setConfirmar(e.target.value)}/>

          <button type="submit" style={s.btnGuardar}>Guardar cambios</button>
        </form>

        <div style={s.divider}/>

        {!eliminando ? (
          <div style={s.zonaEliminar}>
            <p style={s.zonaEliminarTitulo}>Zona de peligro</p>
            <p style={s.zonaEliminarDesc}>Al eliminar tu cuenta no podrás volver a iniciar sesión.</p>
            <button style={s.btnEliminar} onClick={() => setEliminando(true)}>
              Eliminar cuenta
            </button>
          </div>
        ) : (
          <div style={s.zonaEliminar}>
            <p style={s.zonaEliminarTitulo}>¿Estás seguro?</p>
            <p style={s.zonaEliminarDesc}>Esta acción no se puede deshacer.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={s.btnEliminar} onClick={eliminarCuenta}>Sí, eliminar</button>
              <button style={s.btnCancelar} onClick={() => setEliminando(false)}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const s = {
  wrapper: { minHeight: '100vh', backgroundColor: '#0F0F0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { width: '100%', maxWidth: 520, backgroundColor: CARD, borderRadius: 16, border: `1px solid ${BORDE}`, padding: '32px' },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  btnVolver: { backgroundColor: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: 14 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: 700 },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  exito: { backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  label: { color: '#999', fontSize: 13 },
  input: { backgroundColor: '#0F0F0F', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 15, width: '100%' },
  divider: { height: 1, backgroundColor: BORDE, margin: '24px 0' },
  seccion: { color: '#fff', fontWeight: 600, fontSize: 16 },
  hint: { color: '#666', fontSize: 13, marginTop: -8 },
  btnGuardar: { backgroundColor: MORADO, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
  zonaEliminar: { backgroundColor: '#1A0A0A', border: '1px solid #7F1D1D', borderRadius: 12, padding: 20 },
  zonaEliminarTitulo: { color: '#FCA5A5', fontWeight: 600, fontSize: 16, marginBottom: 4 },
  zonaEliminarDesc: { color: '#999', fontSize: 13, marginBottom: 16 },
  btnEliminar: { backgroundColor: '#7F1D1D', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  btnCancelar: { backgroundColor: 'transparent', color: '#999', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '10px 20px', fontSize: 14, cursor: 'pointer' },
}