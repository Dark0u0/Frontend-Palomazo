import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:3000'
const MORADO = '#7C3AED'
const CARD = '#1A1A1A'
const BORDE = '#2A2A2A'

export default function ConfirmacionPagos({ localId }) {
  const [solicitudes, setSolicitudes] = useState([])

  const cargar = () => {
    axios.get(`${API}/solicitudes/local/${localId}`)
      .then(res => setSolicitudes(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(cargar, 8000)
    return () => clearInterval(intervalo)
  }, [localId])

  const pagar = async (id) => {
    try {
      await axios.post(`${API}/solicitudes/${id}/pagar`)
      cargar()
    } catch (e) {
      alert('Error al procesar el pago')
    }
  }

  const colorEstado = (estado) => {
    if (estado === 'aceptada') return '#22C55E'
    if (estado === 'rechazada') return '#EF4444'
    if (estado === 'pagada') return '#A855F7'
    return '#F59E0B'
  }

  const textoEstado = (estado) => ({
    pendiente: 'Esperando respuesta del músico',
    aceptada: 'Aceptada — lista para pagar',
    rechazada: 'Rechazada',
    pagada: 'Pagada',
  }[estado] || estado)

  const colorPago = (estado) => {
    if (estado === 'liberado') return '#22C55E'
    if (estado === 'cancelado') return '#EF4444'
    return '#F59E0B' // parcial
  }

  const textoPago = (pago) => {
    if (pago.estado === 'liberado') return '✓ Pagado completo (100% liberado)'
    if (pago.estado === 'cancelado') return 'Cancelado'
    // parcial: muestra el split real
    const anticipo = parseFloat(pago.montoLiberado)
    const restante = parseFloat(pago.montoRetenido)
    return `Anticipo pagado: $${anticipo.toLocaleString()} (35%) · Pendiente: $${restante.toLocaleString()} (65%)`
  }

  return (
    <div>
      <h2 style={s.secTitulo}>Confirmación y pagos</h2>
      {solicitudes.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>No tienes solicitudes todavía</p>
      ) : (
        solicitudes.map(sol => (
          <div key={sol.id} style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>{sol.musico.nombreArtistico}</p>
                <p style={{ color: '#999', fontSize: 13, margin: '4px 0' }}>
                  📅 {new Date(sol.fecha).toLocaleDateString('es-MX')} · {sol.horaInicio} - {sol.horaFin}
                </p>
                <p style={{ color: colorEstado(sol.estado), fontSize: 13, fontWeight: 600 }}>
                  ● {textoEstado(sol.estado)}
                </p>
                {sol.notas && (
                  <p style={{ color: '#FCD34D', fontSize: 11, marginTop: 4 }}>⏰ {sol.notas}</p>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>
                  ${parseFloat(sol.montoTotal).toLocaleString()} MXN
                </p>
                <p style={{ color: '#666', fontSize: 11 }}>incl. comisión ${parseFloat(sol.comisionApp).toLocaleString()}</p>
                {sol.estado === 'aceptada' && (
                  <button style={s.btnPagar} onClick={() => pagar(sol.id)}>Pagar</button>
                )}
                {sol.pago && (
                  <p style={{ color: colorPago(sol.pago.estado), fontSize: 11, fontWeight: 600, marginTop: 6, maxWidth: 220 }}>
                    {textoPago(sol.pago)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

const s = {
  secTitulo: { color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 16 },
  card: { backgroundColor: CARD, borderRadius: 12, padding: 18, marginBottom: 12, border: `1px solid ${BORDE}` },
  btnPagar: { backgroundColor: MORADO, border: 'none', borderRadius: 6, padding: '8px 18px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 },
}