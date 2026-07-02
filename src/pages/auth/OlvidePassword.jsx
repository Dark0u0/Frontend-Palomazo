import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../utils/axios'

const MORADO = '#7C3AED'

export default function OlvidePassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await axios.post('/auth/recuperar', { email })
      setEnviado(true)
    } catch (e) {
      setError('Error al enviar el correo, intenta de nuevo')
    }
    setCargando(false)
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.logo}>🎵 Palomazo</h1>
        <h2 style={s.titulo}>Recuperar contraseña</h2>

        {enviado ? (
          <div style={s.exito}>
            <p style={{ margin: 0, fontSize: 15 }}>✅ Si el email está registrado, recibirás un correo en breve.</p>
            <p style={{ margin: '12px 0 0', fontSize: 13, color: '#999' }}>Revisa tu bandeja de entrada y spam.</p>
          </div>
        ) : (
          <>
            <p style={s.desc}>Ingresa tu email y te enviaremos un link para restablecer tu contraseña.</p>
            {error && <div style={s.error}>{error}</div>}
            <form onSubmit={enviar} style={s.form}>
              <input
                style={s.input}
                type="email"
                placeholder="Tu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" style={s.btn} disabled={cargando}>
                {cargando ? 'Enviando...' : 'Enviar link de recuperación'}
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
  titulo: { fontSize: 20, fontWeight: 500, textAlign: 'center', marginBottom: 16, color: '#999' },
  desc: { color: '#999', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  exito: { backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac', padding: '16px', borderRadius: 8, marginBottom: 16 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: { backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 16, width: '100%' },
  btn: { backgroundColor: MORADO, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 16px', fontSize: 16, fontWeight: 600, cursor: 'pointer' },
  link: { textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 },
}