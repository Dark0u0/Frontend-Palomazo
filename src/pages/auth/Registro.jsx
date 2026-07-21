import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import { useNavigate, Link } from 'react-router-dom'

const MORADO = '#7C3AED'
const MORADO_OSCURO = '#5B21B6'
const MORADO_BG = '#2D1B69'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [rol, setRol] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const [nombreArtistico, setNombreArtistico] = useState('')
  const [biografia, setBiografia] = useState('')
  const [precioPorHora, setPrecioPorHora] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [generosDisponibles, setGenerosDisponibles] = useState([])
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])

  const [nombreNegocio, setNombreNegocio] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    axios.get('/generos')
      .then(res => setGenerosDisponibles(res.data))
      .catch(() => setError('No se pudieron cargar los géneros'))
  }, [])

  const toggleGenero = (id) => {
    setGenerosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const registro = async (e) => {
    e.preventDefault()
    setError('')
    if (!rol) { setError('Selecciona un rol'); return }
    if (rol === 'musico' && generosSeleccionados.length === 0) {
      setError('Selecciona al menos un género'); return
    }
    try {
      await axios.post('/auth/registro', {
        nombre, email, password, telefono, rol,
        nombreArtistico, biografia, precioPorHora, localidad,
        generosIds: generosSeleccionados,
        nombreNegocio, ubicacion, descripcion
      })
      navigate('/login')
    } catch (e) {
      setError(e.response?.data?.error || 'Error al registrarse')
    }
  }

  return (
    <div style={s.wrapper}>

      {/* Panel izquierdo */}
      <div style={s.panelIzquierdo}>
        <div style={s.panelContenido}>
          <div style={s.logoIcono}>🎵</div>
          <h1 style={s.panelTitulo}>Únete a Palomazo</h1>
          <p style={s.panelDesc}>
            La plataforma que conecta músicos y locales de la Riviera Maya.
            Contrataciones seguras con pagos garantizados.
          </p>
        </div>
        <p style={s.panelFooter}>© 2026 Palomazo. Todos los derechos reservados.</p>
      </div>

      {/* Panel derecho */}
      <div style={s.panelDerecho}>
        <div style={s.formContenido}>
          <h2 style={s.titulo}>Crear cuenta</h2>
          <p style={s.subtitulo}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" style={s.linkLogin}>Inicia sesión</Link>
          </p>

          {error && <div style={s.error}>{error}</div>}

          <form onSubmit={registro} style={s.form}>

            {/* Campos base */}
            <input style={s.input} type="text" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} required/>
            <input style={s.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <input style={s.input} type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required/>
            <input style={s.input} type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required/>

            {/* Selector de rol */}
            <p style={s.label}>Selecciona tu rol</p>
            <div style={s.roles}>
              <button type="button" style={rol === 'musico' ? s.rolActivo : s.rolBtn} onClick={() => setRol('musico')}>
                🎵 Músico
              </button>
              <button type="button" style={rol === 'local' ? s.rolActivo : s.rolBtn} onClick={() => setRol('local')}>
                🏠 Local
              </button>
            </div>

            {/* Campos músico */}
            {rol === 'musico' && (
              <div style={s.extra}>
                <p style={s.seccion}>Perfil de músico</p>
                <input style={s.input} type="text" placeholder="Nombre artístico" value={nombreArtistico} onChange={e => setNombreArtistico(e.target.value)} required/>
                <input style={s.input} type="number" placeholder="Precio por hora (MXN)" value={precioPorHora} onChange={e => setPrecioPorHora(e.target.value)} required/>
                <input style={s.input} type="text" placeholder="Localidad / Ciudad" value={localidad} onChange={e => setLocalidad(e.target.value)} required/>
                <textarea style={s.textarea} placeholder="Biografía (opcional)" value={biografia} onChange={e => setBiografia(e.target.value)} rows={3}/>
                <p style={s.label}>Géneros musicales</p>
                <div style={s.generosGrid}>
                  {generosDisponibles.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      style={generosSeleccionados.includes(g.id) ? s.generoActivo : s.generoBadge}
                      onClick={() => toggleGenero(g.id)}
                    >
                      {g.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Campos local */}
            {rol === 'local' && (
              <div style={s.extra}>
                <p style={s.seccion}>Perfil del local</p>
                <input style={s.input} type="text" placeholder="Nombre del negocio" value={nombreNegocio} onChange={e => setNombreNegocio(e.target.value)} required/>
                <input style={s.input} type="text" placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} required/>
                <textarea style={s.textarea} placeholder="Descripción (opcional)" value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={3}/>
              </div>
            )}

            <button
              type="submit"
              style={s.btn}
              onMouseEnter={e => e.target.style.backgroundColor = MORADO_OSCURO}
              onMouseLeave={e => e.target.style.backgroundColor = MORADO}
            >
              Registrarse
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
    width: '380px',
    minWidth: '380px',
    background: `linear-gradient(135deg, ${MORADO} 0%, #4C1D95 100%)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '48px',
    position: 'sticky',
    top: 0,
    height: '100vh',
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
    fontSize: 32,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    margin: 0,
  },
  panelDesc: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 1.7,
    margin: 0,
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
    justifyContent: 'center',
    padding: '48px 32px',
    overflowY: 'auto',
  },
  formContenido: {
    width: '100%',
    maxWidth: 480,
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
  linkLogin: {
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
    gap: 14,
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
  },
  textarea: {
    backgroundColor: '#1A1A2E',
    border: '1px solid #2A2A2A',
    borderRadius: 8,
    padding: '12px 14px',
    color: '#fff',
    fontSize: 15,
    width: '100%',
    resize: 'vertical',
    boxSizing: 'border-box',
    outline: 'none',
  },
  label: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: 500,
    marginBottom: -4,
  },
  seccion: {
    color: MORADO,
    fontSize: 14,
    fontWeight: 600,
  },
  roles: {
    display: 'flex',
    gap: 12,
  },
  rolBtn: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    border: '2px solid #2A2A2A',
    borderRadius: 8,
    padding: '14px 16px',
    color: '#666',
    fontSize: 15,
    cursor: 'pointer',
  },
  rolActivo: {
    flex: 1,
    backgroundColor: '#EDE9FE',
    border: `2px solid ${MORADO}`,
    borderRadius: 8,
    padding: '14px 16px',
    color: MORADO,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
  },
  extra: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    borderTop: '1px solid #2A2A2A',
    paddingTop: 16,
  },
  generosGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  generoBadge: {
    backgroundColor: '#1A1A2E',
    border: '1px solid #2A2A2A',
    borderRadius: 20,
    padding: '7px 14px',
    color: '#666',
    fontSize: 13,
    cursor: 'pointer',
  },
  generoActivo: {
    backgroundColor: '#EDE9FE',
    border: `1px solid ${MORADO}`,
    borderRadius: 20,
    padding: '7px 14px',
    color: MORADO,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
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