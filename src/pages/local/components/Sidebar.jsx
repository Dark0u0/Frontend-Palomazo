import { s } from '../styles'

export default function Sidebar({ tab, setTab, usuario, perfil, navigate }) {
  return (
    <div style={s.sidebar}>
      <div>
        <p style={s.logo}>🎵 Palomazo</p>
        <p style={s.seccionLabel}>PRINCIPAL</p>
        {[
          { key: 'dashboard', label: '⊞ Dashboard' },
          { key: 'musicos', label: '🔍 Buscar músicos' },
          { key: 'milocal', label: '🏠 Mi local' },
          { key: 'pagos', label: '💳 Confirmación y pagos' },
        ].map(item => (
          <button key={item.key} style={tab === item.key ? s.navActivo : s.navItem} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
        <div style={s.dividerNav}/>
        <p style={s.seccionLabel}>MI PERFIL</p>
        <button style={tab === 'cuenta' ? s.navActivo : s.navItem} onClick={() => setTab('cuenta')}>👤 Mi cuenta</button>
      </div>
    </div>
  )
}