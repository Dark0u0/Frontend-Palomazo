import { useState } from 'react'
import axios from '../../utils/axios'
import { useNavigate, Link } from 'react-router-dom'

const MORADO = '#7C3AED'
const MORADO_OSCURO = '#5B21B6'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const login = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await axios.post('/auth/login', { email, password })
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

      {/* Panel izquierdo */}
      <div style={s.panelIzquierdo}>
        <div style={s.panelContenido}>
          <div style={s.logoIcono}>🎵</div>
          <h1 style={s.panelTitulo}>¡Bienvenido a Palomazo!</h1>
          <p style={s.panelDesc}>
            Conectamos músicos talentosos con los mejores locales de la Riviera Maya.
            Contrataciones seguras, pagos garantizados.
          </p>
        </div>
        <p style={s.panelFooter}>© 2026 Palomazo. Todos los derechos reservados.</p>
      </div>

      {/* Panel derecho */}
      <div style={s.panelDerecho}>
        <div style={s.formContenido}>
          <h2 style={s.titulo}>¡Hola de nuevo!</h2>
          <p style={s.subtitulo}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={s.linkRegistro}>Regístrate aquí</Link>
          </p>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={login} style={s.form}>
            <div style={s.inputGroup}>
              <input
                style={s.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={s.inputGroup}>
              <input
                style={s.input}
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              style={s.btn}
              onMouseEnter={e => e.target.style.backgroundColor = MORADO_OSCURO}
              onMouseLeave={e => e.target.style.backgroundColor = MORADO}
            >
              Entrar
            </button>
          </form>
        </div>
      </div>

    </div>
  )
}

const s = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'row',
  },
  panelIzquierdo: {
    flex: 1,
    background: `linear-gradient(135deg, ${MORADO} 0%, #4C1D95 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px',
    position: 'relative',
    overflow: 'hidden',
  },
  panelContenido: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    marginTop: 40,
  },
  logoIcono: {
    fontSize: 48,
    marginBottom: 8,
  },
  panelTitulo: {
    fontSize: 36,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    margin: 0,
  },
  panelDesc: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.7,
    margin: 0,
    maxWidth: 380,
  },
  panelFooter: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    margin: 0,
  },
  panelDerecho: {
    flex: 1,
    backgroundColor: '#0D0D1A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 32px',
  },
  formContenido: {
    width: '100%',
    maxWidth: 420,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 700,
    color: '#fff',
    margin: '0 0 8px',
  },
  subtitulo: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  linkRegistro: {
    color: MORADO,
    fontWeight: 600,
    textDecoration: 'underline',
  },
  error: {
    backgroundColor: '#3B0000',
    border: '1px solid #7F1D1D',
    color: '#FCA5A5',
    padding: '10px 14px',
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 14,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid #2A2A2A',
    borderRadius: 0,
    padding: '14px 4px',
    color: '#fff',
    fontSize: 15,
    width: '100%',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  btn: {
    backgroundColor: MORADO,
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '16px',
    fontSize: 16,
    fontWeight: 700,
    marginTop: 8,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    letterSpacing: 0.3,
  },
}