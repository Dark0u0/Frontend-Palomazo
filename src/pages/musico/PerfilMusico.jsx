import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'

const MORADO = '#7C3AED'
const CARD = '#0D1421'
const CARD_HEADER = '#1A2332'
const BADGE_BG = '#3D2D6B'
const BORDE = '#1F2937'

export default function PerfilMusico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [musico, setMusico] = useState(null)
  const [resenas, setResenas] = useState([])
  const [verResenas, setVerResenas] = useState(false)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    axios.get(`/musicos/${id}`)
      .then(res => { setMusico(res.data); setCargando(false) })
      .catch(() => setCargando(false))
    axios.get(`/resenas/musico/${id}`)
      .then(res => setResenas(res.data))
      .catch(console.error)
  }, [id])

  if (cargando) return <div style={{ color: '#fff', padding: 40 }}>Cargando...</div>
  if (!musico) return <div style={{ color: '#fff', padding: 40 }}>Músico no encontrado</div>

  const promedio = resenas.length
    ? (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length).toFixed(1)
    : null

  const estrellas = (n) => '★'.repeat(n) + '☆'.repeat(5 - n)

  const tiempoRelativo = (fecha) => {
    const diff = Date.now() - new Date(fecha).getTime()
    const mins = Math.floor(diff / 60000)
    const hrs = Math.floor(diff / 3600000)
    const dias = Math.floor(diff / 86400000)
    if (mins < 60) return `hace ${mins} minuto${mins !== 1 ? 's' : ''}`
    if (hrs < 24) return `hace ${hrs} hora${hrs !== 1 ? 's' : ''}`
    return `hace ${dias} día${dias !== 1 ? 's' : ''}`
  }

  return (
    <div style={st.wrapper}>
      <div style={st.contenido}>
        <button onClick={() => navigate(-1)} style={st.btnVolver}>← Volver</button>

        {/* Header */}
        <div style={st.header}>
          <div style={st.headerTop}>
            {musico.foto
              ? <img src={musico.foto} alt="foto" style={st.fotoCircular}/>
              : <div style={st.fotoVacia}><span style={{ fontSize: 32 }}>🎵</span></div>
            }
            <div style={{ flex: 1 }}>
              <h1 style={st.nombre}>{musico.nombreArtistico}</h1>
              <p style={st.localidad}>{musico.localidad}</p>
            </div>
            <button style={st.btnSolicitud} onClick={() => navigate(`/solicitud/${musico.id}`)}>
              Enviar solicitud
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={st.statsRow}>
          <div style={st.statCard}>
            <p style={st.statValor}>${parseFloat(musico.precioPorHora).toLocaleString()} MXN</p>
            <p style={st.statLabel}>Precio por hora</p>
          </div>
          <div style={{ ...st.statCard, cursor: 'pointer' }} onClick={() => setVerResenas(!verResenas)}>
            <p style={st.statValor}>{promedio ? `${promedio}/5` : 'Sin calificar'}</p>
            <p style={st.statLabel}>
              Calificación {resenas.length > 0 ? `(${resenas.length})` : ''} — <span style={{ color: MORADO }}>Ver reseñas</span>
            </p>
          </div>
        </div>

        {/* Géneros */}
        <div style={st.generosRow}>
          {(musico.generos || []).map((g, i) => (
            <span key={i} style={st.generoBadge}>{g}</span>
          ))}
        </div>

        {/* Biografía */}
        {musico.biografia && (
          <>
            <h2 style={st.secTitulo}>Acerca de mí</h2>
            <p style={st.bio}>{musico.biografia}</p>
          </>
        )}

        {/* Galería */}
        <h2 style={st.secTitulo}>Galería</h2>
        <div style={st.galeriaGrid}>
          {[0, 1, 2].map(i => (
            musico.galeria?.[i]
              ? <img key={i} src={musico.galeria[i]} alt={`galeria-${i}`} style={st.galeriaImg}/>
              : <div key={i} style={st.galeriaVacia}/>
          ))}
        </div>

        {/* Reseñas */}
        {verResenas && (
          <div>
            <h2 style={st.secTitulo}>Reseñas</h2>
            {resenas.length === 0 ? (
              <p style={{ color: '#666' }}>Sin reseñas todavía</p>
            ) : (
              resenas.map(r => (
                <div key={r.id} style={st.resenaCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {r.local?.foto
                        ? <img src={r.local.foto} alt="local" style={st.resenaAvatar}/>
                        : <div style={st.resenaAvatarVacio}>🏠</div>
                      }
                      <div>
                        <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>
                          {r.local?.nombreNegocio || 'Local'}
                        </p>
                        <p style={{ color: '#666', fontSize: 11, margin: '2px 0 0' }}>
                          {tiempoRelativo(r.creadoEn)}
                        </p>
                      </div>
                    </div>
                    <span style={{ color: '#F59E0B', fontSize: 15 }}>{estrellas(r.calificacion)}</span>
                  </div>
                  {r.comentario && <p style={{ color: '#ccc', fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>{r.comentario}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const st = {
  wrapper: { minHeight: '100vh', backgroundColor: '#000', padding: '24px 16px' },
  contenido: { maxWidth: 820, margin: '0 auto' },
  btnVolver: { backgroundColor: 'transparent', border: 'none', color: '#999', cursor: 'pointer', fontSize: 14, marginBottom: 16 },
  header: { backgroundColor: CARD_HEADER, borderRadius: 16, padding: 24, marginBottom: 16, border: `1px solid ${BORDE}` },
  headerTop: { display: 'flex', alignItems: 'center', gap: 20 },
  fotoCircular: { width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  fotoVacia: { width: 90, height: 90, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nombre: { color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 },
  localidad: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  btnSolicitud: { backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '12px 20px', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  statsRow: { display: 'flex', gap: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: CARD, borderRadius: 12, padding: 18, border: `1px solid ${BORDE}` },
  statValor: { color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 },
  statLabel: { color: '#9CA3AF', fontSize: 12, marginTop: 4 },
  generosRow: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  generoBadge: { backgroundColor: BADGE_BG, color: '#D8B4FE', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 },
  secTitulo: { color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 },
  bio: { color: '#9CA3AF', fontSize: 14, lineHeight: 1.6, marginBottom: 24 },
  galeriaGrid: { display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 },
  galeriaImg: { width: 180, height: 180, borderRadius: 12, objectFit: 'cover' },
  galeriaVacia: { width: 180, height: 180, borderRadius: 12, backgroundColor: CARD, border: `1px solid ${BORDE}` },
  resenaCard: { backgroundColor: CARD, borderRadius: 12, padding: 16, marginBottom: 12, border: `1px solid ${BORDE}` },
  resenaAvatar: { width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' },
  resenaAvatarVacio: { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
}