import { useState, useEffect } from 'react'
import axios from '../../../utils/axios'

export default function MisResenas({ musicoId }) {
  const [resenas, setResenas] = useState([])

  useEffect(() => {
    if (!musicoId) return
    axios.get(`/resenas/musico/${musicoId}`)
      .then(res => setResenas(res.data))
      .catch(console.error)
  }, [musicoId])

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

  const promedio = resenas.length
    ? (resenas.reduce((acc, r) => acc + r.calificacion, 0) / resenas.length).toFixed(1)
    : null

  return (
    <div>
      <h2 style={s.titulo}>Mis reseñas</h2>

      {promedio && (
        <div style={s.resumenCard}>
          <p style={s.promedioNum}>{promedio}</p>
          <p style={s.promedioStars}>{estrellas(Math.round(parseFloat(promedio)))}</p>
          <p style={s.promedioSub}>{resenas.length} reseña{resenas.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {resenas.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Aún no tienes reseñas</p>
      ) : (
        resenas.map(r => (
          <div key={r.id} style={s.card}>
            <div style={s.cardHeader}>
              <div style={s.localInfo}>
                {r.local.foto
                  ? <img src={r.local.foto} alt="local" style={s.avatar}/>
                  : <div style={s.avatarVacio}>🏠</div>
                }
                <div>
                  <p style={s.localNombre}>{r.local.nombreNegocio}</p>
                  <p style={s.tiempo}>{tiempoRelativo(r.creadoEn)}</p>
                </div>
              </div>
              <span style={s.estrellas}>{estrellas(r.calificacion)}</span>
            </div>
            {r.comentario && <p style={s.comentario}>{r.comentario}</p>}
          </div>
        ))
      )}
    </div>
  )
}

const s = {
  titulo: { color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 16 },
  resumenCard: { backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 20, textAlign: 'center', marginBottom: 20 },
  promedioNum: { color: '#fff', fontSize: 48, fontWeight: 700, margin: 0 },
  promedioStars: { color: '#F59E0B', fontSize: 24, margin: '4px 0' },
  promedioSub: { color: '#999', fontSize: 14, margin: 0 },
  card: { backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  localInfo: { display: 'flex', gap: 10, alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' },
  avatarVacio: { width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
  localNombre: { color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 },
  tiempo: { color: '#666', fontSize: 11, margin: '2px 0 0' },
  estrellas: { color: '#F59E0B', fontSize: 16 },
  comentario: { color: '#ccc', fontSize: 13, lineHeight: 1.5, margin: 0 },
}