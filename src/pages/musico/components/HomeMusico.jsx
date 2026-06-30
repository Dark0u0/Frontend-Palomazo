import { s } from '../styles'

export default function HomeMusico({ usuario, perfil, showsConPago, gananciasMes, colorEstado }) {
  const showsPendientes = showsConPago.filter(sol => sol.pago.estado !== 'liberado')

  return (
    <div>
      <h1 style={s.bienvenida}>Hola, {perfil.nombreArtistico || usuario.nombre}</h1>
      <p style={s.fecha}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</p>

      <div style={s.statsRow}>
        <div style={s.statCard}>
          <p style={s.statLabel}>Ganancias del mes</p>
          <p style={s.statNum}>${gananciasMes.toLocaleString()} MXN</p>
        </div>
        <div style={s.statCard}>
          <p style={s.statLabel}>Shows pendientes</p>
          <p style={s.statNum}>{showsPendientes.length}</p>
        </div>
      </div>

      <h2 style={s.secTitulo}>Shows pendientes</h2>
      <div style={s.tabla}>
        <div style={s.tablaHeader}>
          <span style={{ ...s.th, flex: 2 }}>LOCAL</span>
          <span style={{ ...s.th, flex: 2 }}>UBICACIÓN</span>
          <span style={{ ...s.th, flex: 1.5 }}>FECHA</span>
          <span style={{ ...s.th, flex: 1 }}>HORA</span>
          <span style={{ ...s.th, flex: 1 }}>MONTO</span>
          <span style={{ ...s.th, flex: 1.5 }}>ESTADO</span>
        </div>
        {showsConPago.map(sol => (
          <div key={sol.id} style={s.tablaFila}>
            <span style={{ ...s.td, flex: 2 }}>{sol.local.nombreNegocio}</span>
            <span style={{ ...s.td, flex: 2 }}>📍 {sol.local.ubicacion}</span>
            <span style={{ ...s.td, flex: 1.5 }}>{new Date(sol.fecha).toLocaleDateString('es-MX')}</span>
            <span style={{ ...s.td, flex: 1 }}>{sol.horaInicio}</span>
            <span style={{ ...s.td, flex: 1 }}>${parseFloat(sol.montoMusico).toLocaleString()}</span>
            <span style={{ ...s.td, flex: 1.5, color: colorEstado(sol.pago.estado) }}>● {sol.pago.estado}</span>
          </div>
        ))}
        {showsConPago.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center', padding: 16 }}>Sin shows todavía</p>
        )}
      </div>

      <h2 style={s.secTitulo}>Estado de escrow</h2>
      <div style={s.card}>
        {showsConPago.map(sol => {
          const pct = sol.pago.estado === 'liberado'
            ? 0
            : Math.round((parseFloat(sol.pago.montoRetenido) / parseFloat(sol.pago.monto)) * 100)
          return (
            <div key={sol.id} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontSize: 14 }}>{sol.local.nombreNegocio}</span>
                <span style={{ color: colorEstado(sol.pago.estado), fontSize: 12, fontWeight: 600 }}>
                  {sol.pago.estado === 'liberado' ? '100% liberado' : `${pct}% retenido`}
                </span>
              </div>
              <div style={s.barraFondo}>
                <div style={{ ...s.barraRelleno, width: `${sol.pago.estado === 'liberado' ? 100 : pct}%`, backgroundColor: colorEstado(sol.pago.estado) }}/>
              </div>
            </div>
          )
        })}
        {showsConPago.length === 0 && (
          <p style={{ color: '#666', textAlign: 'center' }}>Sin pagos activos</p>
        )}
      </div>
    </div>
  )
}