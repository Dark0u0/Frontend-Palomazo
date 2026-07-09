import { useState, useEffect } from 'react'
import axios from '../utils/axios'

const MORADO = '#7C3AED'
const CARD = '#1A1A1A'
const BORDE = '#2A2A2A'

export default function MiCuenta({ usuario, navigate }) {
  const [stripeConectado, setStripeConectado] = useState(false)
  const [cargandoStripe, setCargandoStripe] = useState(false)
  const perfil = usuario.perfil || {}

  useEffect(() => {
    // Solo músicos necesitan cuenta de Stripe
    if (usuario.rol !== 'musico' || !perfil.id) return

    // Verificar si ya tiene cuenta conectada
    axios.get(`/stripe/estado-cuenta/${perfil.id}`)
      .then(res => setStripeConectado(res.data.conectado))
      .catch(console.error)

    // Si viene de completar el onboarding de Stripe
    const params = new URLSearchParams(window.location.search)
    if (params.get('stripe') === 'ok') {
      setStripeConectado(true)
    }
  }, [perfil.id])

  const conectarStripe = async () => {
    setCargandoStripe(true)
    try {
      // Si no tiene cuenta, crearla primero
      if (!stripeConectado) {
        await axios.post('/stripe/crear-cuenta-connect', {
          musicoId: perfil.id,
          email: usuario.email
        })
      }
      // Generar link de onboarding y redirigir
      const { data } = await axios.post('/stripe/link-onboarding', {
        musicoId: perfil.id
      })
      window.location.href = data.url
    } catch (e) {
      alert('Error al conectar con Stripe')
    }
    setCargandoStripe(false)
  }

  const cerrarSesion = async () => {
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
      await axios.post('/auth/logout', { id: usuarioGuardado.id })
    } catch (e) {}
    localStorage.clear()
    navigate('/login')
  }

  return (
    <div>
      <h2 style={s.secTitulo}>Mi cuenta</h2>

      {/* Datos personales */}
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

      {/* Cuenta bancaria — solo para músicos */}
      {usuario.rol === 'musico' && (
        <>
          <h2 style={s.secTitulo}>Cuenta bancaria</h2>
          <div style={s.card}>
            {stripeConectado ? (
              <div style={s.fila}>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>Cuenta conectada</p>
                  <p style={{ color: '#999', fontSize: 13, margin: '4px 0 0' }}>
                    Recibirás transferencias automáticamente cuando liberen tus pagos
                  </p>
                </div>
                <span style={s.badgeOk}>✓ Activa</span>
              </div>
            ) : (
              <div>
                <p style={{ color: '#fff', fontWeight: 600, margin: '0 0 8px' }}>Sin cuenta bancaria</p>
                <p style={{ color: '#999', fontSize: 13, margin: '0 0 16px' }}>
                  Conecta tu cuenta bancaria para recibir tus pagos directamente cuando los locales liberen el escrow.
                </p>
                <button style={s.btnStripe} onClick={conectarStripe} disabled={cargandoStripe}>
                  {cargandoStripe ? 'Conectando...' : '🏦 Conectar cuenta bancaria'}
                </button>
              </div>
            )}
          </div>
          {stripeConectado && (
            <button
              style={{ ...s.btnStripe, backgroundColor: 'transparent', border: `1px solid ${BORDE}`, color: '#999', marginBottom: 16 }}
              onClick={conectarStripe}
            >
              ✏️ Actualizar datos bancarios
            </button>
          )}
        </>
      )}

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
  badgeOk: { backgroundColor: '#052e16', color: '#86efac', border: '1px solid #166534', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 },
  btnStripe: { backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '12px 20px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
  btnEditar: { backgroundColor: 'transparent', border: `1px solid ${MORADO}`, borderRadius: 8, padding: '12px 24px', color: MORADO, fontWeight: 600, cursor: 'pointer' },
  btnCerrarSesion: { backgroundColor: 'transparent', border: '1px solid #7F1D1D', borderRadius: 8, padding: '12px 24px', color: '#FCA5A5', fontWeight: 600, cursor: 'pointer' },
}
