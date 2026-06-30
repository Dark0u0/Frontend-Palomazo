import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'
const MORADO_BG = '#2D1B69'
const CARD = '#1A1A1A'
const BORDE = '#2A2A2A'

export default function EditarMusico() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const perfil = usuario.perfil || {}

  const [nombreArtistico, setNombreArtistico] = useState(perfil.nombreArtistico || '')
  const [biografia, setBiografia] = useState(perfil.biografia || '')
  const [precioPorHora, setPrecioPorHora] = useState(perfil.precioPorHora || '')
  const [localidad, setLocalidad] = useState(perfil.localidad || '')
  const [generosDisponibles, setGenerosDisponibles] = useState([])
  const [generosSeleccionados, setGenerosSeleccionados] = useState([])
  const [foto, setFoto] = useState(perfil.foto || null)
  const [fotoPreview, setFotoPreview] = useState(perfil.foto || null)
  const [galeria, setGaleria] = useState(perfil.galeria || [])
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')

  useEffect(() => {
    axios.get(`${API}/generos`).then(res => {
      setGenerosDisponibles(res.data)
      // Pre-seleccionar géneros actuales
      const actuales = res.data
        .filter(g => (perfil.generos || []).includes(g.nombre))
        .map(g => g.id)
      setGenerosSeleccionados(actuales)
    })
  }, [])

  const toggleGenero = (id) => {
    setGenerosSeleccionados(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const subirFoto = async (archivo) => {
    setSubiendo(true)
    try {
      const formData = new FormData()
      formData.append('foto', archivo)
      const { data } = await axios.post(`${API}/upload/foto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setFoto(data.url)
      setFotoPreview(data.url)
    } catch (e) {
      setError('Error al subir la foto')
    }
    setSubiendo(false)
  }

  const subirFotoGaleria = async (archivo, index) => {
  setSubiendo(true)
  try {
    const formData = new FormData()
    formData.append('foto', archivo)
    const { data } = await axios.post(`${API}/upload/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    setGaleria(prev => {
      const nueva = [...prev]
      nueva[index] = data.url
      return nueva
    })
  } catch (e) {
    setError('Error al subir la foto de galería')
  }
  setSubiendo(false)
}

const quitarFotoGaleria = (index) => {
  setGaleria(prev => prev.filter((_, i) => i !== index))
}

const guardar = async (e) => {
  e.preventDefault()
  setError('')
  setExito('')
  if (generosSeleccionados.length === 0) {
    setError('Selecciona al menos un género')
    return
  }
  try {
    await axios.put(`${API}/musico/${perfil.id}`, {
      nombreArtistico, biografia, precioPorHora,
      localidad, generosIds: generosSeleccionados, foto, galeria
    })
    const perfilActualizado = {
      ...perfil, nombreArtistico, biografia,
      precioPorHora, localidad, foto, galeria,
      generos: generosDisponibles.filter(g => generosSeleccionados.includes(g.id)).map(g => g.nombre)
    }
    localStorage.setItem('usuario', JSON.stringify({ ...usuario, perfil: perfilActualizado }))
    setExito('Perfil actualizado correctamente')
  } catch (e) {
    setError(e.response?.data?.error || 'Error al actualizar')
  }
}

  return (
    <div style={s.wrapper}>
      <div style={s.card}>
        <div style={s.header}>
          <button onClick={() => navigate('/dashboard/musico')} style={s.btnVolver}>← Volver</button>
          <h1 style={s.titulo}>Mi banda / Yo</h1>
        </div>

        {error && <div style={s.error}>{error}</div>}
        {exito && <div style={s.exito}>{exito}</div>}

        <form onSubmit={guardar} style={s.form}>

          {/* Foto */}
          <div style={s.fotoContainer}>
            <div style={s.fotoWrapper}>
              {fotoPreview
                ? <img src={fotoPreview} alt="foto" style={s.foto}/>
                : <div style={s.fotoVacia}><span style={{ fontSize: 32 }}>🎵</span></div>
              }
            </div>
            <div>
              <p style={s.label}>Foto de perfil</p>
              <p style={{ color: '#666', fontSize: 12, marginBottom: 8 }}>JPG, PNG o WEBP. Máx 5MB</p>
              <label style={s.btnFoto}>
                {subiendo ? 'Subiendo...' : '📷 Subir foto'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && subirFoto(e.target.files[0])}
                />
              </label>
            </div>
          </div>

          <div style={s.divider}/>
          <label style={s.label}>Galería (máx. 3 fotos)</label>
<div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
  {[0, 1, 2].map(i => (
    <div key={i} style={{ position: 'relative' }}>
      {galeria[i] ? (
        <>
          <img src={galeria[i]} alt={`galeria-${i}`} style={{ width: 100, height: 100, borderRadius: 8, objectFit: 'cover' }}/>
          <button
            type="button"
            onClick={() => quitarFotoGaleria(i)}
            style={{ position: 'absolute', top: -8, right: -8, backgroundColor: '#7F1D1D', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 12 }}
          >✕</button>
        </>
      ) : (
        <label style={{ width: 100, height: 100, borderRadius: 8, backgroundColor: '#0F0F0F', border: '1px dashed #2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 24 }}>
          +
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && subirFotoGaleria(e.target.files[0], i)}
          />
        </label>
      )}
    </div>
  ))}
</div>

<div style={s.divider}/>

          <label style={s.label}>Nombre artístico</label>
          <input style={s.input} type="text" value={nombreArtistico} onChange={e => setNombreArtistico(e.target.value)} required/>

          <label style={s.label}>Precio por hora (MXN)</label>
          <input style={s.input} type="number" value={precioPorHora} onChange={e => setPrecioPorHora(e.target.value)} required/>

          <label style={s.label}>Localidad / Ciudad</label>
          <input style={s.input} type="text" value={localidad} onChange={e => setLocalidad(e.target.value)} required/>

          <label style={s.label}>Biografía</label>
          <textarea style={s.textarea} value={biografia} onChange={e => setBiografia(e.target.value)} rows={4}/>

          <label style={s.label}>Géneros musicales</label>
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

          <button type="submit" style={s.btnGuardar}>Guardar cambios</button>
        </form>
      </div>
    </div>
  )
}

const s = {
  wrapper: { minHeight: '100vh', backgroundColor: '#0F0F0F', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' },
  card: { width: '100%', maxWidth: 560, backgroundColor: CARD, borderRadius: 16, border: `1px solid ${BORDE}`, padding: 32 },
  header: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 },
  btnVolver: { backgroundColor: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: 14 },
  titulo: { color: '#fff', fontSize: 22, fontWeight: 700 },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  exito: { backgroundColor: '#052e16', border: '1px solid #166534', color: '#86efac', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  fotoContainer: { display: 'flex', gap: 20, alignItems: 'center' },
  fotoWrapper: { flexShrink: 0 },
  foto: { width: 100, height: 100, borderRadius: 12, objectFit: 'cover' },
  fotoVacia: { width: 100, height: 100, borderRadius: 12, backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnFoto: { backgroundColor: '#2A2A2A', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '8px 16px', color: '#ccc', fontSize: 13, cursor: 'pointer', display: 'inline-block' },
  divider: { height: 1, backgroundColor: BORDE, margin: '8px 0' },
  label: { color: '#999', fontSize: 13 },
  input: { backgroundColor: '#0F0F0F', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 15, width: '100%' },
  textarea: { backgroundColor: '#0F0F0F', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '12px 16px', color: '#fff', fontSize: 15, width: '100%', resize: 'vertical' },
  generosGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  generoBadge: { backgroundColor: '#0F0F0F', border: `1px solid ${BORDE}`, borderRadius: 20, padding: '7px 14px', color: '#666', fontSize: 13, cursor: 'pointer' },
  generoActivo: { backgroundColor: MORADO_BG, border: `1px solid ${MORADO}`, borderRadius: 20, padding: '7px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnGuardar: { backgroundColor: MORADO, color: '#fff', border: 'none', borderRadius: 8, padding: '14px 16px', fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
}