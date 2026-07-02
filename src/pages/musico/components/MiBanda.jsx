import { useState, useEffect } from 'react'
import axios from '../../../utils/axios'

const MORADO = '#7C3AED'
const CARD = '#0D1421'
const CARD_HEADER = '#1A2332'
const BADGE_BG = '#3D2D6B'
const BORDE = '#1F2937'

export default function MiBanda({ perfil, generos, navigate }) {
  const [promedio, setPromedio] = useState(null)
  const [totalResenas, setTotalResenas] = useState(0)

  useEffect(() => {
    if (!perfil.id) return
    axios.get(`/resenas/musico/${perfil.id}`)
      .then(res => {
        const data = res.data
        if (data.length > 0) {
          const avg = (data.reduce((acc, r) => acc + r.calificacion, 0) / data.length).toFixed(1)
          setPromedio(avg)
          setTotalResenas(data.length)
        }
      })
      .catch(console.error)
  }, [perfil.id])

  const estrellas = (n) => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n))

  return (
    <div>
      {/* Header */}
      <div style={s.header}>
        <div style={s.headerTop}>
          {perfil.foto
            ? <img src={perfil.foto} alt="perfil" style={s.fotoCircular}/>
            : <div style={s.fotoVacia}><span style={{ fontSize: 32 }}>🎵</span></div>
          }
          <div style={{ flex: 1 }}>
            <h1 style={s.nombre}>{perfil.nombreArtistico || 'Sin nombre artístico'}</h1>
            <p style={s.localidad}>{perfil.localidad || 'Sin localidad'}</p>
          </div>
          <button style={s.btnEditar} onClick={() => navigate('/editar/musico')}>Edit profile</button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={s.statValor}>
            ${perfil.precioPorHora ? parseFloat(perfil.precioPorHora).toLocaleString() : '0'} MXN
          </p>
          <p style={s.statLabel}>Precio por hora</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statValor}>
            {promedio ? `${promedio}/5` : 'Sin calificar'}
          </p>
          <p style={s.statLabel}>
            Calificación {totalResenas > 0 && (
              <span style={{ color: '#F59E0B' }}>
                {estrellas(parseFloat(promedio))} ({totalResenas})
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Géneros */}
      <div style={s.generosRow}>
        {generos.map((g, i) => (
          <span key={i} style={s.generoBadge}>{g}</span>
        ))}
      </div>

      {/* Biografía */}
      <h2 style={s.secTitulo}>Acerca de mí</h2>
      <p style={s.bio}>{perfil.biografia || 'Sin biografía'}</p>

      {/* Galería */}
      <h2 style={s.secTitulo}>Galería</h2>
      <div style={s.galeriaGrid}>
        {[0, 1, 2].map(i => (
          perfil.galeria?.[i]
            ? <img key={i} src={perfil.galeria[i]} alt={`galeria-${i}`} style={s.galeriaImg}/>
            : <div key={i} style={s.galeriaVacia}/>
        ))}
      </div>
    </div>
  )
}

const s = {
  header: { backgroundColor: CARD_HEADER, borderRadius: 16, padding: 24, marginBottom: 16, border: `1px solid ${BORDE}` },
  headerTop: { display: 'flex', alignItems: 'center', gap: 20 },
  fotoCircular: { width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  fotoVacia: { width: 90, height: 90, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nombre: { color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 },
  localidad: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  btnEditar: { backgroundColor: 'transparent', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '10px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
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
}