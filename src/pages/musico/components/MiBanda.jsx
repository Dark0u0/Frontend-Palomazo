import { useState, useEffect } from 'react'
import axios from '../../../utils/axios'
import { s, MORADO } from '../styles'

export default function MiBanda({ perfil, generos, navigate }) {
  const [verResenas, setVerResenas] = useState(false)
  const [resenas, setResenas] = useState([])

  useEffect(() => {
    if (!perfil.id) return
    axios.get(`/resenas/musico/${perfil.id}`)
      .then(res => setResenas(res.data))
      .catch(console.error)
  }, [perfil.id])

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
      <h2 style={s.secTitulo}>Mi banda / Yo</h2>
      <div style={s.card}>
        <div style={{ display: 'flex', gap: 24 }}>
          {perfil.foto
            ? <img src={perfil.foto} alt="perfil" style={s.perfilFoto}/>
            : <div style={s.perfilFotoVacia}><span style={{ fontSize: 32 }}>🎵</span></div>
          }
          <div style={{ flex: 1 }}>
            <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
              {perfil.nombreArtistico || 'Sin nombre artístico'}
            </p>
            <p style={{ color: '#999', fontSize: 14, marginBottom: 4 }}>📍 {perfil.localidad || 'Sin localidad'}</p>
            <p style={{ color: MORADO, fontWeight: 700, fontSize: 15, marginBottom: 8 }}>
              💰 ${perfil.precioPorHora ? parseFloat(perfil.precioPorHora).toLocaleString() : '0'} MXN/hr
            </p>
            <div style={s.generoRow}>
              {generos.map((g, i) => (
                <span key={i} style={s.generoBadge}>{g}</span>
              ))}
            </div>
          </div>
        </div>
        <p style={{ color: '#ccc', fontSize: 14, marginTop: 16 }}>
          {perfil.biografia || 'Sin biografía'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button style={s.btnEditar} onClick={() => navigate('/editar/musico')}>✏️ Editar perfil</button>
        <button
          style={{ ...s.btnEditar, color: '#F59E0B', borderColor: '#F59E0B' }}
          onClick={() => setVerResenas(!verResenas)}
        >
          ⭐ Ver reseñas {promedio ? `(${promedio})` : ''}
        </button>
      </div>

      {verResenas && (
        <div>
          <h2 style={s.secTitulo}>Mis reseñas</h2>
          {resenas.length === 0 ? (
            <p style={{ color: '#666' }}>Aún no tienes reseñas</p>
          ) : (
            resenas.map(r => (
              <div key={r.id} style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 12, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {r.local?.foto
                      ? <img src={r.local.foto} alt="local" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}/>
                      : <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🏠</div>
                    }
                    <div>
                      <p style={{ color: '#fff', fontWeight: 600, fontSize: 14, margin: 0 }}>{r.local?.nombreNegocio || 'Local'}</p>
                      <p style={{ color: '#666', fontSize: 11, margin: '2px 0 0' }}>{tiempoRelativo(r.creadoEn)}</p>
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
  )
}