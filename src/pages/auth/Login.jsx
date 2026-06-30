import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'http://localhost:3000'
const MORADO = '#7C3AED'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password })
      localStorage.setItem('token', data.token)
      localStorage.setItem('usuario', JSON.stringify(data))
      if (data.rol === 'musico') {
        navigate('/dashboard/musico')
      } else {
        navigate('/dashboard/local')
      }
    } catch (e) {
      setError(e.response?.data?.error || 'Error al iniciar sesión')
    }
  }

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <h1 style={s.logo}>🎵 Palomazo</h1>
        <h2 style={s.titulo}>Iniciar sesión</h2>

        {error && <div style={s.error}>{error}</div>}

        <form onSubmit={login} style={s.form}>
          <input
            style={s.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            style={s.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={s.btn}>Entrar</button>
        </form>

        <p style={s.link}>
          ¿No tienes cuenta?{' '}
          <Link to="/registro" style={{ color: MORADO }}>Regístrate</Link>
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
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  input: { backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 16, width: '100%' },
  btn: { backgroundColor: MORADO, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 16px', fontSize: 16, fontWeight: 600, marginTop: 8 },
  link: { textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 }
}