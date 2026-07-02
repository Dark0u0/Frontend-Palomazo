import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import axios from '../../utils/axios'

const MORADO = '#7C3AED'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmar, setConfirmar] = useState('')
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)
  const [cargando, setCargando] = useState(false)

  const restablecer = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmar) {
      setError('Las contraseñas no coinciden')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    setCargando(true)
    try {
      await axios.post('/auth/reset-password', { token, password })
      setExito(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (e) {
      setError(e.response?.data?.error || 'El link es inválido o ya expiró')
    }
    setCargando(false)
  }

  if (!token) {
    return (
      <div style={s.wrapper}>
        <div style={s.card}>
          <h1 style={s.logo}>🎵 Palomazo</h1>
          <div style={s.error}>
            Link inválido. <Link to="/olvide-password" style={{ color: '#FCA5A5' }}>Solicita uno nuevo</Link>.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.logo}>🎵 Palomazo</h1>
        <h2 style={s.titulo}>Nueva contraseña</h2>

        {exito ? (
          <div style={s.exito}>
            ✅ Contraseña actualizada. Redirigiendo al login...
          </div>
        ) : (
          <>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={restablecer} style={s.form}>
              <input
                style={s.input}
                type="password"
                placeholder="Nueva contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <input
                style={s.input}
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmar}
                onChange={e => setConfirmar(e.target.value)}
                required
              />
              <button type="submit" style={s.btn} disabled={cargando}>
                {cargando ? 'Guardando...' : 'Guardar nueva contraseña'}
              </button>
            </form>
          </>
        )}

        <p style={s.link}>
          <Link to="/login" style={{ color: MORADO }}>← Volver al login</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F0F' },
  card: { width: '100%', maxWidth: 420, padding: '48px 32px', backgroundColor: '#1A1A1A', borderRadius: 16, border: '1px solid #2A2A2A' },
  logo: { fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#fff' },
  titulo: { fontSize: 20, fontWeight: 500, textAlign: 'center', marginBottom: 32, color: '#999' },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  exito: { backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac', padding: '16px', borderRadius: 8 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: { backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 16, width: '100%' },
  btn: { backgroundColor: MORADO, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 16px', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  link: { textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 },
}