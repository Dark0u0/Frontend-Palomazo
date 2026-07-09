import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import axios from '../../../utils/axios'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const MORADO = '#7C3AED'
const BORDE = '#2A2A2A'

function FormPago({ solicitudId, monto, musicoNombre, onExito, onCancelar }) {
  const stripe = useStripe()
  const elements = useElements()
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState('')

  const anticipo = +(monto * 0.35).toFixed(2)

  const handlePago = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcesando(true)
    setError('')

    try {
      // 1. Pedir el clientSecret al backend
      const { data } = await axios.post('/stripe/crear-pago', { solicitudId })

      // 2. Confirmar el pago con la tarjeta
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        }
      )

      if (stripeError) {
        setError(stripeError.message)
        setProcesando(false)
        return
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Avisar al backend que el pago fue exitoso
        await axios.post('/stripe/confirmar-pago', {
          solicitudId,
          paymentIntentId: paymentIntent.id
        })
        onExito()
      }
    } catch (e) {
      setError('Error al procesar el pago. Intenta de nuevo.')
    }

    setProcesando(false)
  }

  return (
    <form onSubmit={handlePago} style={s.form}>
      <div style={s.resumen}>
        <p style={s.resumenTitulo}>Resumen del pago</p>
        <div style={s.resumenFila}>
          <span style={s.resumenLabel}>Músico</span>
          <span style={s.resumenValor}>{musicoNombre}</span>
        </div>
        <div style={s.resumenFila}>
          <span style={s.resumenLabel}>Monto total</span>
          <span style={s.resumenValor}>${monto.toLocaleString()} MXN</span>
        </div>
        <div style={{ height: 1, backgroundColor: BORDE, margin: '12px 0' }}/>
        <div style={s.resumenFila}>
          <span style={s.resumenLabel}>Anticipo ahora (35%)</span>
          <span style={{ ...s.resumenValor, color: '#F59E0B' }}>${anticipo.toLocaleString()} MXN</span>
        </div>
        <div style={s.resumenFila}>
          <span style={s.resumenLabel}>Al liberar (65%)</span>
          <span style={s.resumenValor}>${(monto - anticipo).toLocaleString()} MXN</span>
        </div>
      </div>

      <p style={s.label}>Datos de tarjeta</p>
      <div style={s.cardContainer}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#fff',
              '::placeholder': { color: '#666' }
            }
          }
        }}/>
      </div>

      {error && <div style={s.error}>{error}</div>}

      <p style={s.hint}>
        🔒 Pago seguro procesado por Stripe. Tus datos de tarjeta nunca tocan nuestros servidores.
      </p>

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="button" style={s.btnCancelar} onClick={onCancelar} disabled={procesando}>
          Cancelar
        </button>
        <button type="submit" style={s.btnPagar} disabled={procesando || !stripe}>
          {procesando ? 'Procesando...' : `Pagar $${anticipo.toLocaleString()} MXN`}
        </button>
      </div>
    </form>
  )
}

export default function FormularioPago({ solicitudId, monto, musicoNombre, onExito, onCancelar }) {
  return (
    <div style={s.overlay} onClick={onCancelar}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <h3 style={s.titulo}>💳 Realizar pago</h3>
        <Elements stripe={stripePromise}>
          <FormPago
            solicitudId={solicitudId}
            monto={monto}
            musicoNombre={musicoNombre}
            onExito={onExito}
            onCancelar={onCancelar}
          />
        </Elements>
      </div>
    </div>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#1A2332', border: '1px solid #2A2A2A', borderRadius: 16, padding: 28, maxWidth: 460, width: '90%' },
  titulo: { color: '#fff', fontSize: 18, fontWeight: 700, marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  resumen: { backgroundColor: '#0F1117', borderRadius: 10, padding: 16 },
  resumenTitulo: { color: '#9CA3AF', fontSize: 12, fontWeight: 600, marginBottom: 12, letterSpacing: 0.5 },
  resumenFila: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  resumenLabel: { color: '#9CA3AF', fontSize: 13 },
  resumenValor: { color: '#fff', fontSize: 13, fontWeight: 600 },
  label: { color: '#9CA3AF', fontSize: 13 },
  cardContainer: { backgroundColor: '#0F1117', border: '1px solid #2A2A2A', borderRadius: 8, padding: '14px 16px' },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, fontSize: 13 },
  hint: { color: '#666', fontSize: 11, textAlign: 'center' },
  btnCancelar: { flex: 1, backgroundColor: 'transparent', border: '1px solid #2A2A2A', borderRadius: 8, padding: '12px 0', color: '#999', fontSize: 14, cursor: 'pointer' },
  btnPagar: { flex: 2, backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '12px 0', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
}