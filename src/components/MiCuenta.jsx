import axios from '../utils/axios'

const MORADO = '#7C3AED'
const CARD = '#1A1A1A'
const BORDE = '#2A2A2A'

export default function MiCuenta({ usuario, navigate }) {
  const cerrarSesion = async () => {
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
      await axios.post('/auth/logout', { id: usuarioGuardado.id })
    } catch (e) {
      // si falla, igual cerramos sesión localmente
    }
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div>
      <h2 style={s.secTitulo}>Mi cuenta</h2>
      <div style={s.card}>
        <div style={s.fila}>
          <span style={s.label}>Nombre</span>
          <span style={s.valor}>{usuario.nombre || 'Sin nombre'}</span>
        </div>
        <div style={s.divider}/>
        <div style={s.fila}>
          <span style={s.label}>Email</span>
          <span style={s.valor}>{usuario.email || 'Sin email'}</span>
        </div>
        <div style={s.divider}/>
        <div style={s.fila}>
          <span style={s.label}>Teléfono</span>
          <span style={s.valor}>{usuario.telefono || 'Sin teléfono'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button style={s.btnEditar} onClick={() => navigate('/editar/perfil')}>✏️ Editar cuenta</button>
        <button style={s.btnCerrarSesion} onClick={cerrarSesion}>🚪 Cerrar sesión</button>
      </div>
    </div>
  )
}

const s = {
  secTitulo: { color: '#fff', fontSize: 18, fontWeight: 600, marginBottom: 16 },
  card: { backgroundColor: CARD, borderRadius: 12, padding: 20, marginBottom: 24, border: `1px solid ${BORDE}` },
  fila: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' },
  label: { color: '#999', fontSize: 13 },
  valor: { color: '#fff', fontSize: 14, fontWeight: 500 },
  divider: { height: 1, backgroundColor: BORDE },
  btnEditar: { backgroundColor: 'transparent', border: `1px solid ${MORADO}`, borderRadius: 8, padding: '12px 24px', color: MORADO, fontWeight: 600, cursor: 'pointer' },
  btnCerrarSesion: { backgroundColor: 'transparent', border: '1px solid #7F1D1D', borderRadius: 8, padding: '12px 24px', color: '#FCA5A5', fontWeight: 600, cursor: 'pointer' },
}
