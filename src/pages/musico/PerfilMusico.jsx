import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'
const CARD = '#0D1421'
const CARD_HEADER = '#1A2332'
const BADGE_BG = '#3D2D6B'
const BORDE = '#1F2937'

export default function PerfilMusico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [musico, setMusico] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    axios.get(`${API}/musicos/${id}`)
      .then(res => { setMusico(res.data); setCargando(false) })
      .catch(() => setCargando(false))
  }, [id])

  if (cargando) return <div style={{ color: '#fff', textAlign: 'center', padding: 40 }}>Cargando...</div>
  if (!musico) return <div style={{ color: '#fff', textAlign: 'center', padding: 40 }}>Músico no encontrado</div>

  return (
    <div style={s.wrapper}>
      <div style={s.contenido}>
        <button onClick={() => navigate(-1)} style={s.btnVolver}>← Volver</button>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerTop}>
            {musico.foto
              ? <img src={musico.foto} alt="foto" style={s.fotoCircular}/>
              : <div style={s.fotoVacia}><span style={{ fontSize: 32 }}>🎵</span></div>
            }
            <div style={{ flex: 1 }}>
              <h1 style={s.nombre}>{musico.nombreArtistico}</h1>
              <p style={s.localidad}>{musico.localidad}</p>
            </div>
            <button style={s.btnSolicitud} onClick={() => navigate(`/solicitud/${musico.id}`)}>
              Enviar solicitud
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          <div style={s.statCard}>
            <p style={s.statValor}>${parseFloat(musico.precioPorHora).toLocaleString()} MXN</p>
            <p style={s.statLabel}>Precio por hora</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statValor}>{musico.calificacion ? `${musico.calificacion}/5` : 'Sin calificar'}</p>
            <p style={s.statLabel}>
              Calificación {musico.resenas?.length > 0 ? `(${musico.resenas.length} reseñas)` : ''}
            </p>
          </div>
        </div>

        {/* Géneros */}
        <div style={s.generosRow}>
          {(musico.generos || []).map((g, i) => (
            <span key={i} style={s.generoBadge}>{g}</span>
          ))}
        </div>

        {/* Biografía */}
        {musico.biografia && (
          <>
            <h2 style={s.secTitulo}>Acerca de mí</h2>
            <p style={s.bio}>{musico.biografia}</p>
          </>
        )}

        {/* Galería */}
        <h2 style={s.secTitulo}>Galería</h2>
        <div style={s.galeriaGrid}>
          {[0, 1, 2].map(i => (
            musico.galeria?.[i]
              ? <img key={i} src={musico.galeria[i]} alt={`galeria-${i}`} style={s.galeriaImg}/>
              : <div key={i} style={s.galeriaVacia}/>
          ))}
        </div>

        {/* Reseñas */}
        {musico.resenas?.length > 0 && (
          <>
            <h2 style={s.secTitulo}>Reseñas</h2>
            {musico.resenas.map(r => (
              <div key={r.id} style={s.resenaCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>
                    {r.local?.usuario?.nombre || 'Local'}
                  </span>
                  <span style={{ color: '#F59E0B' }}>
                    {'★'.repeat(r.calificacion) + '☆'.repeat(5 - r.calificacion)}
                  </span>
                </div>
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>{r.comentario}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

const s = {
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
}