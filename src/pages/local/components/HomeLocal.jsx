import { s } from '../styles'

export default function HomeLocal({ usuario, pagos, pagosPendientes, colorEstado, liberarPago, cancelarPago }) {
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
              {(p.estado === 'liberado' || p.estado === 'cancelado') && (
                <span style={{ color: '#666', fontSize: 12 }}>Sin acciones</span>
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
                {p.estado === 'liberado' ? '100% liberado' : p.estado === 'parcial' ? '50% retenido' : p.estado === 'cancelado' ? 'Cancelado' : '100% retenido'}
              </span>
            </div>
            <div style={s.barraFondo}>
              <div style={{ ...s.barraRelleno, width: p.estado === 'liberado' ? '100%' : p.estado === 'parcial' ? '50%' : p.estado === 'cancelado' ? '0%' : '100%', backgroundColor: colorEstado(p.estado) }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}