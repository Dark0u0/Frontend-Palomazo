const MORADO = '#7C3AED'
const CARD = '#0D1421'
const CARD_HEADER = '#1A2332'
const BORDE = '#1F2937'

export default function MiLocal({ perfil, navigate }) {
  return (
    <div>
      {/* Header con foto, nombre y botón editar */}
      <div style={s.header}>
        <div style={s.headerTop}>
          {perfil.foto
            ? <img src={perfil.foto} alt="local" style={s.fotoCircular}/>
            : <div style={s.fotoVacia}><span style={{ fontSize: 32 }}>🏠</span></div>
          }
          <div style={{ flex: 1 }}>
            <h1 style={s.nombre}>{perfil.nombreNegocio || 'Sin nombre'}</h1>
            <p style={s.ubicacion}>{perfil.ubicacion || 'Sin ubicación'}</p>
          </div>
          <button style={s.btnEditar} onClick={() => navigate('/editar/local')}>Edit profile</button>
        </div>
      </div>

      {/* Descripción */}
      <h2 style={s.secTitulo}>Acerca de nosotros</h2>
      <p style={s.descripcion}>{perfil.descripcion || 'Sin descripción'}</p>

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
  header: { backgroundColor: CARD_HEADER, borderRadius: 16, padding: 24, marginBottom: 24, border: `1px solid ${BORDE}` },
  headerTop: { display: 'flex', alignItems: 'center', gap: 20 },
  fotoCircular: { width: 90, height: 90, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 },
  fotoVacia: { width: 90, height: 90, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  nombre: { color: '#fff', fontSize: 28, fontWeight: 800, margin: 0 },
  ubicacion: { color: '#9CA3AF', fontSize: 14, marginTop: 4 },
  btnEditar: { backgroundColor: 'transparent', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '10px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  secTitulo: { color: '#fff', fontSize: 16, fontWeight: 700, marginBottom: 8 },
  descripcion: { color: '#9CA3AF', fontSize: 14, lineHeight: 1.6, marginBottom: 24 },
  galeriaGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  galeriaImg: { width: 180, height: 180, borderRadius: 12, objectFit: 'cover' },
  galeriaVacia: { width: 180, height: 180, borderRadius: 12, backgroundColor: CARD, border: `1px solid ${BORDE}` },
}
