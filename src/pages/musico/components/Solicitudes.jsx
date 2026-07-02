import { useState } from 'react'
import axios from '../../../utils/axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'
const CARD = '#1A2332'
const BORDE = '#2A2A2A'

export default function Solicitudes({ solicitudes, onVolver, onRespondida }) {
  const [modalLocal, setModalLocal] = useState(null)

  const verPerfilLocal = async (localId) => {
    try {
      const { data } = await axios.get(`${API}/local/${localId}`)
      setModalLocal(data)
    } catch (e) {
      alert('Error al cargar el perfil del local')
    }
  }

  const responder = async (id, respuesta) => {
    try {
      await axios.put(`${API}/solicitudes/${id}/responder`, { respuesta })
      onRespondida()
    } catch (e) {
      alert('Error al responder la solicitud')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={s.titulo}>Solicitudes</h2>
        <button style={s.btnVolver} onClick={onVolver}>← Volver a tus shows</button>
      </div>

      {solicitudes.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>No tienes solicitudes pendientes</p>
      ) : (
        <div style={s.grid}>
          {solicitudes.map(sol => {
            const anticipo = +(parseFloat(sol.montoTotal) * 0.35).toFixed(2)
            return (
              <div key={sol.id} style={s.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {sol.local.foto
                      ? <img src={sol.local.foto} alt="local" style={s.fotoLocal}/>
                      : <div style={s.fotoLocalVacia}>🏠</div>
                    }
                    <div>
                      <p style={s.nombreLocal}>{sol.local.nombreNegocio}</p>
                      <p style={s.ubicacionLocal}>📍 {sol.local.ubicacion}</p>
                    </div>
                  </div>
                  <button style={s.badgeNueva} onClick={() => verPerfilLocal(sol.localId)}>
                    Nueva solicitud
                  </button>
                </div>

                <div style={{ marginTop: 14 }}>
                  <p style={s.label}>📅 Fecha</p>
                  <p style={s.valor}>{new Date(sol.fecha).toLocaleDateString('es-MX')} - {sol.horaInicio}</p>
                </div>
                <div style={{ marginTop: 10 }}>
                  <p style={s.label}>🎵 Tipo de evento</p>
                  <p style={s.valor}>{sol.tipoEvento || 'Show en vivo'}</p>
                </div>
                {sol.notas && (
                  <div style={{ marginTop: 10 }}>
                    <p style={s.label}>📄 Nota del local</p>
                    <p style={s.notaTexto}>{sol.notas}</p>
                  </div>
                )}

                <div style={s.totalBox}>
                  <div>
                    <p style={s.totalLabel}>Pago total acordado</p>
                    <p style={s.totalValor}>${parseFloat(sol.montoTotal).toLocaleString()} MXN</p>
                  </div>
                  <div>
                    <p style={s.totalLabel}>Anticipo escrow</p>
                    <p style={{ ...s.totalValor, color: '#F59E0B' }}>${anticipo.toLocaleString()}</p>
                  </div>
                </div>

                <p style={s.comisionTexto}>
                  💼 El 10% del pago total (${parseFloat(sol.comisionApp).toLocaleString()} MXN) corresponde a la comisión de Palomazo
                </p>

                <p style={s.protegido}>🛡️ Protegido contra cancelaciones de último momento</p>

                <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                  <button style={s.btnDeclinar} onClick={() => responder(sol.id, 'rechazada')}>✕ Declinar</button>
                  <button style={s.btnAceptar} onClick={() => responder(sol.id, 'aceptada')}>✓ Aceptar</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modalLocal && (
        <div style={s.modalOverlay} onClick={() => setModalLocal(null)}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <button style={s.modalCerrar} onClick={() => setModalLocal(null)}>✕</button>
            {modalLocal.foto
              ? <img src={modalLocal.foto} alt="local" style={s.modalFoto}/>
              : <div style={s.modalFotoVacia}>🏠</div>
            }
            <h3 style={s.modalNombre}>{modalLocal.nombreNegocio}</h3>
            <p style={s.modalUbicacion}>📍 {modalLocal.ubicacion}</p>
            <p style={s.modalDescripcion}>{modalLocal.descripcion || 'Sin descripción'}</p>
            {modalLocal.galeria?.length > 0 && (
              <div style={s.modalGaleria}>
                {modalLocal.galeria.map((url, i) => (
                  <img key={i} src={url} alt={`galeria-${i}`} style={s.modalGaleriaImg}/>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const s = {
  titulo: { color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 },
  btnVolver: { backgroundColor: 'transparent', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '8px 16px', color: '#ccc', fontSize: 13, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 14, padding: 18 },
  fotoLocal: { width: 44, height: 44, borderRadius: 10, objectFit: 'cover' },
  fotoLocalVacia: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  nombreLocal: { color: '#fff', fontWeight: 700, fontSize: 14, margin: 0 },
  ubicacionLocal: { color: '#9CA3AF', fontSize: 12, margin: '2px 0 0' },
  badgeNueva: { backgroundColor: MORADO, border: 'none', borderRadius: 14, padding: '5px 12px', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' },
  label: { color: '#9CA3AF', fontSize: 11, margin: 0 },
  valor: { color: '#fff', fontSize: 13, fontWeight: 600, margin: '2px 0 0' },
  notaTexto: { color: '#FCD34D', fontSize: 12, margin: '2px 0 0' },
  totalBox: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#0F1117', borderRadius: 10, padding: 14, marginTop: 14 },
  totalLabel: { color: '#9CA3AF', fontSize: 11, margin: 0 },
  totalValor: { color: '#fff', fontSize: 16, fontWeight: 700, margin: '4px 0 0' },
  comisionTexto: { color: '#9CA3AF', fontSize: 11, textAlign: 'center', marginTop: 10, lineHeight: 1.4 },
  protegido: { color: '#F59E0B', fontSize: 11, textAlign: 'center', marginTop: 8 },
  btnDeclinar: { flex: 1, backgroundColor: '#7F1D1D', border: 'none', borderRadius: 8, padding: '10px 0', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  btnAceptar: { flex: 1, backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '10px 0', color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  modalOverlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modalCard: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 16, padding: 24, maxWidth: 420, width: '90%', position: 'relative' },
  modalCerrar: { position: 'absolute', top: 16, right: 16, backgroundColor: 'transparent', border: 'none', color: '#999', fontSize: 18, cursor: 'pointer' },
  modalFoto: { width: 80, height: 80, borderRadius: 12, objectFit: 'cover', marginBottom: 12 },
  modalFotoVacia: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#2A2A2A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12 },
  modalNombre: { color: '#fff', fontSize: 18, fontWeight: 700, margin: 0 },
  modalUbicacion: { color: '#9CA3AF', fontSize: 13, margin: '4px 0 12px' },
  modalDescripcion: { color: '#ccc', fontSize: 13, lineHeight: 1.5 },
  modalGaleria: { display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  modalGaleriaImg: { width: 90, height: 90, borderRadius: 8, objectFit: 'cover' },
}