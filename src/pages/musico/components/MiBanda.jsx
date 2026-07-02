import { useState, useEffect } from 'react'
import axios from '../../../utils/axios'
import { s, MORADO } from '../styles'

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
            {promedio ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#F59E0B', fontSize: 16 }}>{estrellas(parseFloat(promedio))}</span>
                <span style={{ color: '#999', fontSize: 13 }}>{promedio} ({totalResenas} reseña{totalResenas !== 1 ? 's' : ''})</span>
              </div>
            ) : (
              <p style={{ color: '#666', fontSize: 13 }}>Sin reseñas todavía</p>
            )}
            <div style={{ ...s.generoRow, marginTop: 8 }}>
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
      <button style={s.btnEditar} onClick={() => navigate('/editar/musico')}>✏️ Editar perfil</button>
    </div>
  )
}