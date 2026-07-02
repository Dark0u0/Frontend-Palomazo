import { useState, useEffect } from 'react'
import axios from '../../../utils/axios'
import { s } from '../styles'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const MORADO = '#7C3AED'
const MORADO_BG = '#2D1B69'
const CARD = '#1A1A1A'
const BORDE = '#2A2A2A'

export default function BuscarMusicos({ busqueda, setBusqueda, musicos, estrellas, navigate }) {
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const [generosDisponibles, setGenerosDisponibles] = useState([])
  const [generosFiltro, setGenerosFiltro] = useState([])
  const [precioMin, setPrecioMin] = useState('')
  const [precioMax, setPrecioMax] = useState('')

  useEffect(() => {
    axios.get(`${API}/generos`)
      .then(res => setGenerosDisponibles(res.data.map(g => g.nombre)))
      .catch(console.error)
  }, [])

  const toggleGenero = (genero) => {
    setGenerosFiltro(prev =>
      prev.includes(genero) ? prev.filter(g => g !== genero) : [...prev, genero]
    )
  }

  const limpiarFiltros = () => {
    setGenerosFiltro([])
    setPrecioMin('')
    setPrecioMax('')
  }

  const filtrosActivos = generosFiltro.length > 0 || precioMin !== '' || precioMax !== ''
  const contadorFiltros =
    generosFiltro.length + (precioMin !== '' ? 1 : 0) + (precioMax !== '' ? 1 : 0)

  const musicosFiltrados = musicos.filter(m => {
    const q = busqueda.toLowerCase()
    const precio = parseFloat(m.precioPorHora)

    const coincideTexto =
      m.nombreArtistico?.toLowerCase().includes(q) ||
      m.localidad?.toLowerCase().includes(q) ||
      m.generos?.some(g => g.toLowerCase().includes(q))

    const coincideGenero =
      generosFiltro.length === 0 ||
      generosFiltro.some(g => m.generos?.includes(g))

    const coincidePrecioMin = precioMin === '' || precio >= parseFloat(precioMin)
    const coincidePrecioMax = precioMax === '' || precio <= parseFloat(precioMax)

    return coincideTexto && coincideGenero && coincidePrecioMin && coincidePrecioMax
  })

  return (
    <div>
      <h2 style={s.secTitulo}>Músicos disponibles</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: filtrosAbiertos ? 0 : 20 }}>
        <input
          style={{ ...s.buscador, marginBottom: 0, flex: 1 }}
          placeholder="Buscar por nombre, ciudad o género..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
        <button
          style={filtrosActivos ? fs.btnFiltroActivo : fs.btnFiltro}
          onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
        >
          ⚙️ Filtros {filtrosActivos ? `(${contadorFiltros})` : ''}
        </button>
      </div>

      {filtrosAbiertos && (
        <div style={fs.panel}>
          <div style={fs.panelHeader}>
            <p style={fs.panelTitulo}>Filtrar resultados</p>
            {filtrosActivos && (
              <button style={fs.btnLimpiar} onClick={limpiarFiltros}>Limpiar filtros</button>
            )}
          </div>

          <p style={fs.label}>Género musical</p>
          <div style={fs.generosGrid}>
            {generosDisponibles.map(g => (
              <button
                key={g}
                style={generosFiltro.includes(g) ? fs.generoActivo : fs.generoBadge}
                onClick={() => toggleGenero(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <p style={fs.label}>Precio por hora (MXN)</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              style={fs.inputPrecio}
              type="number"
              placeholder="Mínimo"
              value={precioMin}
              onChange={e => setPrecioMin(e.target.value)}
            />
            <span style={{ color: '#666' }}>—</span>
            <input
              style={fs.inputPrecio}
              type="number"
              placeholder="Máximo"
              value={precioMax}
              onChange={e => setPrecioMax(e.target.value)}
            />
          </div>
        </div>
      )}

      {musicosFiltrados.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', marginTop: 40 }}>No se encontraron músicos</p>
      ) : (
        <div style={s.musicosGrid}>
          {musicosFiltrados.map(m => (
            <div key={m.id} style={s.musicoCard}>
              {m.foto
                ? <img src={m.foto} alt={m.nombreArtistico} style={s.musicoFoto}/>
                : <div style={s.musicoFotoVacia}/>
              }
              <p style={s.musicoNombre}>{m.nombreArtistico}</p>
              <p style={s.musicoLocalidad}>📍 {m.localidad}</p>
              <div style={s.musicoStars}>
                <span style={{ color: '#F59E0B', fontSize: 13 }}>{estrellas(m.calificacion)}</span>
                <span style={{ color: '#999', fontSize: 12, marginLeft: 4 }}>
                  {m.calificacion ? `${m.calificacion} (${m.totalResenas})` : 'Sin reseñas'}
                </span>
              </div>
              <p style={s.musicoPrecio}>💰 ${parseFloat(m.precioPorHora).toLocaleString()}/hr</p>
              <div style={s.generoRow}>
                {m.generos?.slice(0, 3).map((g, i) => (
                  <span key={i} style={s.generoBadge}>{g}</span>
                ))}
              </div>
              <button style={s.btnVerPerfil} onClick={() => navigate(`/musico/${m.id}`)}>
                Ver perfil
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const fs = {
  btnFiltro: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 8, padding: '0 18px', color: '#ccc', fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' },
  btnFiltroActivo: { backgroundColor: MORADO_BG, border: `1px solid ${MORADO}`, borderRadius: 8, padding: '0 18px', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap' },
  panel: { backgroundColor: CARD, border: `1px solid ${BORDE}`, borderRadius: 12, padding: 20, marginBottom: 20 },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  panelTitulo: { color: '#fff', fontWeight: 600, fontSize: 15, margin: 0 },
  btnLimpiar: { backgroundColor: 'transparent', border: 'none', color: MORADO, fontSize: 13, cursor: 'pointer' },
  label: { color: '#999', fontSize: 13, marginBottom: 8 },
  generosGrid: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  generoBadge: { backgroundColor: '#0F0F0F', border: `1px solid ${BORDE}`, borderRadius: 20, padding: '7px 14px', color: '#666', fontSize: 13, cursor: 'pointer' },
  generoActivo: { backgroundColor: MORADO_BG, border: `1px solid ${MORADO}`, borderRadius: 20, padding: '7px 14px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  inputPrecio: { backgroundColor: '#0F0F0F', border: `1px solid ${BORDE}`, borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 14, width: 120 },
}