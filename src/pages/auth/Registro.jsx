import { useState, useEffect } from 'react'
import axios from '../../utils/axios'
import { useNavigate, Link } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [telefono, setTelefono] = useState('')
  const [rol, setRol] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Campos músico
  const [nombreArtistico, setNombreArtistico] = useState('')
  const [biografia, setBiografia] = useState('')
  const [precioPorHora, setPrecioPorHora] = useState('')
  const [localidad, setLocalidad] = useState('')
  const [generosDisponibles, setGenerosDisponibles] = useState([])
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])

  // Campos local
  const [nombreNegocio, setNombreNegocio] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [descripcion, setDescripcion] = useState('')

  useEffect(() => {
    axios.get(`${API}/generos`)
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
      await axios.post(`${API}/auth/registro`, {
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
      <div style={s.card}>
        <h1 style={s.logo}>🎵 Palomazo</h1>
        <h2 style={s.titulo}>Crear cuenta</h2>

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

          <button type="submit" style={s.btn}>Registrarse</button>
        </form>

        <p style={s.linkText}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: MORADO }}>Inicia sesión</Link>
        </p>
      </div>
    </div>
  )
}

const MORADO_BG = '#2D1B69'
const s = {
  wrapper: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F0F', padding: '40px 16px' },
  card: { width: '100%', maxWidth: 520, padding: '48px 32px', backgroundColor: '#1A1A1A', borderRadius: 16, border: '1px solid #2A2A2A' },
  logo: { fontSize: 28, fontWeight: 700, textAlign: 'center', marginBottom: 8, color: '#fff' },
  titulo: { fontSize: 20, fontWeight: 500, textAlign: 'center', marginBottom: 32, color: '#999' },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  input: { backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 15, width: '100%' },
  textarea: { backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 15, width: '100%', resize: 'vertical' },
  label: { color: '#ccc', fontSize: 15, fontWeight: 500 },
  seccion: { color: MORADO, fontSize: 15, fontWeight: 600 },
  roles: { display: 'flex', gap: 12 },
  rolBtn: { flex: 1, backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 8, padding: '14px 16px', color: '#666', fontSize: 15, cursor: 'pointer' },
  rolActivo: { flex: 1, backgroundColor: MORADO_BG, border: `1px solid ${MORADO}`, borderRadius: 8, padding: '14px 16px', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer' },
  extra: { display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid #2A2A2A', paddingTop: 16 },
  generosGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  generoBadge: { backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: 20, padding: '7px 14px', color: '#666', fontSize: 13, cursor: 'pointer' },
  generoActivo: { backgroundColor: MORADO_BG, border: `1px solid ${MORADO}`, borderRadius: 20, padding: '7px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btn: { backgroundColor: MORADO, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 16px', fontSize: 16, fontWeight: 600, marginTop: 8 },
  linkText: { textAlign: 'center', marginTop: 24, color: '#666', fontSize: 14 }
}