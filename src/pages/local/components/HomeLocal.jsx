import { useState } from 'react'
import axios from '../../../utils/axios'
import { s } from '../styles'

const MORADO = '#7C3AED'
const BORDE = '#2A2A2A'

export default function HomeLocal({ usuario, pagos, pagosPendientes, colorEstado, liberarPago, cancelarPago }) {
  const [modalResena, setModalResena] = useState(null) // { pagoId, musicoNombre, musicoFoto, musicoId, localId }
  const [calificacion, setCalificacion] = useState(5)
  const [comentario, setComentario] = useState('')
  const [resenadoIds, setResenadoIds] = useState([])
  const [enviando, setEnviando] = useState(false)

  const enviarResena = async () => {
    if (!modalResena) return
    setEnviando(true)
    try {
      await axios.post('/resenas', {
        localId: modalResena.localId,
        musicoId: modalResena.musicoId,
        calificacion,
        comentario,
        pagoId: modalResena.pagoId
      })
      setResenadoIds(prev => [...prev, modalResena.pagoId])
      setModalResena(null)
      setCalificacion(5)
      setComentario('')
    } catch (e) {
      alert('Error al enviar la reseña')
    }
    setEnviando(false)
  }

  const saltarResena = async (pagoId) => {
    try {
      await axios.put(`/pagos/${pagoId}/skip-resena`)
      setResenadoIds(prev => [...prev, pagoId])
    } catch (e) {
      // igual ocultamos los botones
      setResenadoIds(prev => [...prev, pagoId])
    }
  }

  const yaResenado = (pago) => pago.resenado || resenadoIds.includes(pago.id)

  return (
    <div>
      <h1 style={s.bienvenida}>Buenos días, {usuario.nombre}</h1>
      <p style={s.fecha}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

      <div style={s.statCard}>
        <p style={s.statLabel}>Pagos pendientes</p>
        <p style={s.statNum}>{pagosPendientes.length}</p>
      </div>

      <h2 style={s.secTitulo}>Pagos pendientes</h2>
      <div style={s.tabla}>
        <div style={s.tablaHeader}>
          <span style={{ ...s.th, flex: 2 }}>ARTISTA</span>
          <span style={{ ...s.th, flex: 1.5 }}>FECHA</span>
          <span style={{ ...s.th, flex: 1 }}>HORA</span>
          <span style={{ ...s.th, flex: 1 }}>MONTO</span>
          <span style={{ ...s.th, flex: 1.5 }}>ESTADO</span>
          <span style={{ ...s.th, flex: 2 }}>ACCIONES</span>
        </div>
        {pagos.map(p => (
          <div key={p.id} style={s.tablaFila}>
            <span style={{ ...s.td, flex: 2 }}>{p.artista}</span>
            <span style={{ ...s.td, flex: 1.5 }}>{p.fecha}</span>
            <span style={{ ...s.td, flex: 1 }}>{p.hora}</span>
            <span style={{ ...s.td, flex: 1 }}>${p.monto.toLocaleString()}</span>
            <span style={{ ...s.td, flex: 1.5, color: colorEstado(p.estado) }}>● {p.estado}</span>
            <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(p.estado === 'retenido' || p.estado === 'parcial') && (
                <>
                  <button style={s.btnMorado} onClick={() => liberarPago(p.id)}>Liberar pago</button>
                  <button style={s.btnRojo} onClick={() => cancelarPago(p.id)}>Cancelar</button>
                </>
              )}
              {(p.estado === 'liberado' || p.estado === 'cancelado') && !yaResenado(p) && (
                <>
                  <button style={s.btnVerde} onClick={() => setModalResena({
                    pagoId: p.id,
                    musicoNombre: p.artista,
                    musicoFoto: p.musicoFoto || null,
                    musicoId: p.musicoId,
                    localId: p.localId
                  })}>⭐ Reseñar</button>
                  <button style={{ ...s.btnRojo, fontSize: 10 }} onClick={() => saltarResena(p.id)}>Omitir</button>
                </>
              )}
              {(p.estado === 'liberado' || p.estado === 'cancelado') && yaResenado(p) && (
                <span style={{ color: '#666', fontSize: 12 }}>✓ Reseña enviada</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2 style={s.secTitulo}>Estado de escrow</h2>
      <div style={s.card}>
        {pagos.map(p => (
          <div key={p.id} style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#fff', fontSize: 14 }}>{p.artista}</span>
              <span style={{ color: colorEstado(p.estado), fontSize: 12, fontWeight: 600 }}>
               {p.estado === 'liberado' ? '100% liberado' : p.estado === 'parcial' ? '65% retenido' : p.estado === 'cancelado' ? '65% reembolsado' : '100% retenido'}
              </span>
            </div>
            <div style={s.barraFondo}>
              <div style={{ ...s.barraRelleno, width: p.estado === 'liberado' ? '100%' : p.estado === 'parcial' ? '65%' : p.estado === 'cancelado' ? '0%' : '100%', backgroundColor: colorEstado(p.estado) }}/>
            </div>
            {p.estado === 'cancelado' && (
              <p style={{ color: '#666', fontSize: 11, marginTop: 4 }}>
                El 35% de anticipo pagado al músico no es reembolsable.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Modal de reseña */}
      {modalResena && (
        <div style={ms.overlay} onClick={() => setModalResena(null)}>
          <div style={ms.modal} onClick={e => e.stopPropagation()}>
            <button style={ms.cerrar} onClick={() => setModalResena(null)}>✕</button>
            <div style={ms.musicoInfo}>
              {modalResena.musicoFoto
                ? <img src={modalResena.musicoFoto} alt="musico" style={ms.foto}/>
                : <div style={ms.fotoVacia}>🎵</div>
              }
              <p style={ms.nombre}>{modalResena.musicoNombre}</p>
            </div>
            <p style={ms.label}>Calificación</p>
            <div style={ms.estrellasFila}>
              {[1, 2, 3, 4, 5].map(n => (
                <button key={n} style={ms.estrella} onClick={() => setCalificacion(n)}>
                  <span style={{ color: n <= calificacion ? '#F59E0B' : '#555', fontSize: 28 }}>★</span>
                </button>
              ))}
            </div>
            <p style={ms.label}>Comentario <span style={{ color: '#666' }}>({comentario.length}/500)</span></p>
            <textarea
              style={ms.textarea}
              placeholder="Cuéntanos sobre tu experiencia..."
              value={comentario}
              maxLength={500}
              rows={4}
              onChange={e => setComentario(e.target.value)}
            />
            <button style={ms.btnEnviar} onClick={enviarResena} disabled={enviando}>
              {enviando ? 'Enviando...' : 'Enviar reseña'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const ms = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#1A2332', border: '1px solid #2A2A2A', borderRadius: 16, padding: 28, maxWidth: 400, width: '90%', position: 'relative' },
  cerrar: { position: 'absolute', top: 16, right: 16, backgroundColor: 'transparent', border: 'none', color: '#999', fontSize: 20, cursor: 'pointer' },
  musicoInfo: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 },
  foto: { width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' },
  fotoVacia: { width: 56, height: 56, borderRadius: '50%', backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 },
  nombre: { color: '#fff', fontWeight: 700, fontSize: 17, margin: 0 },
  label: { color: '#9CA3AF', fontSize: 13, marginBottom: 8 },
  estrellasFila: { display: 'flex', gap: 4, marginBottom: 16 },
  estrella: { background: 'none', border: 'none', cursor: 'pointer', padding: 2 },
  textarea: { width: '100%', backgroundColor: '#0F1117', border: '1px solid #2A2A2A', borderRadius: 8, padding: '12px', color: '#fff', fontSize: 14, resize: 'vertical', marginBottom: 16 },
  btnEnviar: { width: '100%', backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '14px', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
}