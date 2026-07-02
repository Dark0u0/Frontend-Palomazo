import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../../utils/axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'
const CARD = '#0D1421'
const BORDE = '#1F2937'

export default function SolicitudMusico() {
  const { id } = useParams()
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  const [musico, setMusico] = useState(null)
  const [paso, setPaso] = useState(2)
  const [fecha, setFecha] = useState('')
  const [duracionHoras, setDuracionHoras] = useState(3)
  const [horaInicio, setHoraInicio] = useState('21:00')
  const [horaFin, setHoraFin] = useState('00:00')
  const [solicitudCreada, setSolicitudCreada] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    axios.get(`${API}/musicos/${id}`)
      .then(res => setMusico(res.data))
      .catch(console.error)
  }, [id])

  if (!musico) return <div style={{ color: '#fff', padding: 40 }}>Cargando...</div>

  const montoMusico = parseFloat(musico.precioPorHora) * duracionHoras
  const comisionApp = +(montoMusico * 0.10).toFixed(2)
  const total = +(montoMusico + comisionApp).toFixed(2)

  const enviarSolicitud = async () => {
    setError('')
    if (!fecha) { setError('Selecciona una fecha'); return }
    try {
      const { data } = await axios.post(`${API}/solicitudes`, {
        localId: usuario.perfil.id,
        musicoId: musico.id,
        fecha,
        duracionHoras,
        horaInicio,
        horaFin,
        precioPorHora: musico.precioPorHora
      })
      setSolicitudCreada(data)
      setPaso(3)
    } catch (e) {
      setError('Error al enviar la solicitud')
    }
  }

  const Stepper = () => (
    <div style={st.stepper}>
      <span style={paso >= 1 ? st.stepDone : st.stepPending}>{paso >= 1 ? '✓' : '1'} Seleccionar banda</span>
      <span style={st.stepLine}/>
      <span style={paso === 2 ? st.stepActivo : paso > 2 ? st.stepDone : st.stepPending}>
        {paso > 2 ? '✓' : '2'} Fecha y pago
      </span>
      <span style={st.stepLine}/>
      <span style={paso === 3 ? st.stepActivo : st.stepPending}>3 Confirmación</span>
    </div>
  )

  if (paso === 3 && solicitudCreada) {
    return (
      <div style={st.wrapper}>
        <div style={st.contenido}>
          <Stepper/>
          <div style={st.confirmCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={st.iconBox}>🎵</div>
                <div>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0 }}>{musico.nombreArtistico}</p>
                  <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>📍 {musico.localidad}</p>
                </div>
              </div>
              <span style={st.badgeNueva}>Nueva solicitud</span>
            </div>

            <div style={{ marginTop: 20 }}>
              <p style={st.label2}>📅 Fecha</p>
              <p style={st.valor}>{fecha} - {horaInicio}</p>
            </div>

            <div style={st.totalBox}>
              <div>
                <p style={st.totalLabel}>Pago total acordado</p>
                <p style={st.totalValor}>${total.toLocaleString()} MXN</p>
              </div>
              <div>
                <p style={st.totalLabel}>Comisión Palomazo (10%)</p>
                <p style={{ ...st.totalValor, color: '#F59E0B' }}>${comisionApp.toLocaleString()}</p>
              </div>
            </div>

            <div style={st.notaBox}>
                ⏰ El músico debe llegar 2 horas antes de la hora de inicio para la prueba de sonido.
            </div>

            <p style={{ color: '#F59E0B', fontSize: 13, textAlign: 'center', marginTop: 16 }}>
                🛡️ Tu solicitud quedará registrada en el historial de Confirmación y pagos
            </p>

            <button style={st.btnNotificar} onClick={() => navigate('/dashboard/local')}>
              Notificarme
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={st.wrapper}>
      <div style={st.contenidoDosColumnas}>
        <div style={{ flex: 1 }}>
          <Stepper/>
          <div style={st.musicoCard}>
            {musico.foto
              ? <img src={musico.foto} alt="foto" style={st.fotoMusico}/>
              : <div style={st.fotoMusicoVacia}/>
            }
            <div>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>{musico.nombreArtistico}</p>
              <p style={{ color: '#9CA3AF', fontSize: 13, margin: 0 }}>{musico.generos?.[0]}</p>
            </div>
            <p style={{ marginLeft: 'auto', color: '#fff', fontWeight: 700 }}>${musico.precioPorHora}/hr</p>
          </div>

          {error && <div style={st.error}>{error}</div>}

          <div style={st.formRow}>
            <div style={{ flex: 1 }}>
              <p style={st.label}>Fecha</p>
              <input style={st.input} type="date" value={fecha} onChange={e => setFecha(e.target.value)}/>
            </div>
            <div style={{ flex: 1 }}>
              <p style={st.label}>Duración</p>
              <select style={st.input} value={duracionHoras} onChange={e => setDuracionHoras(parseInt(e.target.value))}>
                {[1, 2, 3, 4, 5, 6].map(h => <option key={h} value={h}>{h} hora{h > 1 ? 's' : ''}</option>)}
              </select>
            </div>
          </div>

          <div style={st.formRow}>
            <div style={{ flex: 1 }}>
              <p style={st.label}>Hora de inicio</p>
              <input style={st.input} type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)}/>
            </div>
            <div style={{ flex: 1 }}>
              <p style={st.label}>Hora de fin</p>
              <input style={st.input} type="time" value={horaFin} onChange={e => setHoraFin(e.target.value)}/>
            </div>
          </div>
        </div>

        <div style={st.resumen}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Resumen de pago</p>
          <div style={st.resumenFila}>
            <span style={{ color: '#9CA3AF', fontSize: 14 }}>${musico.precioPorHora} × {duracionHoras} horas</span>
            <span style={{ color: '#fff', fontSize: 14 }}>${montoMusico.toLocaleString()}</span>
          </div>
          <div style={st.resumenFila}>
            <span style={{ color: '#9CA3AF', fontSize: 14 }}>Tarifa de servicio</span>
            <span style={{ color: '#fff', fontSize: 14 }}>${comisionApp.toLocaleString()}</span>
          </div>
          <div style={{ height: 1, backgroundColor: BORDE, margin: '16px 0' }}/>
          <div style={st.resumenFila}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Total</span>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>${total.toLocaleString()}</span>
          </div>
          <button style={st.btnConfirmar} onClick={enviarSolicitud}>
            🔒 Confirmar y enviar solicitud
          </button>
        </div>
      </div>
    </div>
  )
}

const st = {
  notaBox: { backgroundColor: '#1F1A0A', border: '1px solid #92400E', borderRadius: 8, padding: '10px 14px', color: '#FCD34D', fontSize: 12, marginTop: 16, textAlign: 'center' },
  wrapper: { minHeight: '100vh', backgroundColor: '#000', padding: '24px 16px' },
  contenido: { maxWidth: 480, margin: '0 auto' },
  contenidoDosColumnas: { maxWidth: 900, margin: '0 auto', display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' },
  stepper: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, flexWrap: 'wrap' },
  stepDone: { color: '#22C55E' },
  stepActivo: { color: MORADO, fontWeight: 700 },
  stepPending: { color: '#555' },
  stepLine: { width: 24, height: 1, backgroundColor: BORDE },
  musicoCard: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
  fotoMusico: { width: 50, height: 50, borderRadius: 10, objectFit: 'cover' },
  fotoMusicoVacia: { width: 50, height: 50, borderRadius: 10, backgroundColor: '#2A2A2A' },
  formRow: { display: 'flex', gap: 12, marginBottom: 12 },
  label: { color: '#9CA3AF', fontSize: 12, marginBottom: 6 },
  input: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 8, padding: '10px 12px', color: '#fff', fontSize: 14, width: '100%' },
  error: { backgroundColor: '#3B0000', border: '1px solid #7F1D1D', color: '#FCA5A5', padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: 13 },
  resumen: { width: 280, backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 12, padding: 20, flexShrink: 0 },
  resumenFila: { display: 'flex', justifyContent: 'space-between', marginBottom: 10 },
  btnConfirmar: { width: '100%', backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '14px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 16 },
  confirmCard: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 16, padding: 24 },
  iconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: MORADO, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 },
  badgeNueva: { backgroundColor: '#3D2D6B', color: '#D8B4FE', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 12, height: 'fit-content' },
  label2: { color: '#9CA3AF', fontSize: 12 },
  valor: { color: '#fff', fontSize: 15, fontWeight: 600, margin: '4px 0 0' },
  totalBox: { display: 'flex', justifyContent: 'space-between', backgroundColor: '#0F1117', borderRadius: 10, padding: 16, marginTop: 16 },
  totalLabel: { color: '#9CA3AF', fontSize: 12, margin: 0 },
  totalValor: { color: '#fff', fontSize: 18, fontWeight: 700, margin: '4px 0 0' },
  btnNotificar: { width: '100%', backgroundColor: MORADO, border: 'none', borderRadius: 8, padding: '14px 0', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', marginTop: 20 },
}