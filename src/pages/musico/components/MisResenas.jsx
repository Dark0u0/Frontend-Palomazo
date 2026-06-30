import { s } from '../styles'

export default function MisResenas({ resenas, estrellas, promedio }) {
  return (
    <div>
      <h2 style={s.secTitulo}>Mis reseñas</h2>
      <div style={s.card}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#fff', fontSize: 48, fontWeight: 700, margin: 0 }}>{promedio}</p>
          <p style={{ color: '#F59E0B', fontSize: 24, margin: '4px 0' }}>{estrellas(Math.round(parseFloat(promedio)))}</p>
          <p style={{ color: '#999', fontSize: 14 }}>{resenas.length} reseñas</p>
        </div>
      </div>
      {resenas.map(r => (
        <div key={r.id} style={{ ...s.card, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontWeight: 600 }}>{r.local}</span>
            <span style={{ color: '#F59E0B' }}>{estrellas(r.calificacion)}</span>
          </div>
          <p style={{ color: '#ccc', fontSize: 13 }}>{r.comentario}</p>
        </div>
      ))}
    </div>
  )
}
