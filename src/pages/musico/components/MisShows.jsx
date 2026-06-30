import { s, MORADO } from '../styles'

export default function MisShows({ historial, colorEstado, pendientesCount, onVerSolicitudes }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ ...s.secTitulo, marginBottom: 0 }}>Mis shows</h2>
        <button style={hs.btnSolicitudes} onClick={onVerSolicitudes}>
          📥 Solicitudes
          {pendientesCount > 0 && <span style={hs.badge}>{pendientesCount}</span>}
        </button>
      </div>

      {historial.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>Aún no tienes shows en tu historial</p>
      ) : (
        historial.map(sol => (
          <div key={sol.id} style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: '#fff', fontWeight: 600, fontSize: 15 }}>{sol.local.nombreNegocio}</span>
              <span style={{ color: colorEstado(sol.pago.estado), fontSize: 13 }}>● {sol.pago.estado}</span>
            </div>
            <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>📍 {sol.local.ubicacion}</p>
            <p style={{ color: '#999', fontSize: 13, marginBottom: 4 }}>📅 {new Date(sol.fecha).toLocaleDateString('es-MX')} · 🕐 {sol.horaInicio}</p>
            <p style={{ color: MORADO, fontWeight: 700, fontSize: 16 }}>${parseFloat(sol.montoMusico).toLocaleString()} MXN</p>
          </div>
        ))
      )}
    </div>
  )
}

const hs = {
  btnSolicitudes: { position: 'relative', backgroundColor: '#1A2332', border: '1px solid #2A2A2A', borderRadius: 8, padding: '10px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  badge: { position: 'absolute', top: -6, right: -6, backgroundColor: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' },
}