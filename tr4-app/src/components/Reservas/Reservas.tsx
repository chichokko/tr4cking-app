import { useState, useEffect } from 'react'

interface Parada {
  id_parada: number
  nombre: string
}
interface Empresa {
  id_empresa: number
  nombre: string
  direccion: string
  telefono: string
}

interface Bus {
  id_bus: number
  placa: string
  marca: string
  modelo: string
  capacidad: number
  estado: string
  empresa: Empresa
  empresa_nombre: string
}

interface DetalleRuta {
  id_detalle: number
  ruta: number
  parada: Parada
  hora_salida: string
  orden: number
}

interface Ruta {
  id_ruta: number
  nombre: string
  detalles: DetalleRuta[]
}

interface Viaje {
  id_viaje: number
  ruta: Ruta
  ruta_details?: Ruta
  bus: Bus
  bus_details?: Bus
  fecha: string
  activo: boolean
  observaciones?: string
}

function Reservas() {
  const [origen, setOrigen] = useState<number | ''>('');
  const [destino, setDestino] = useState<number | ''>('');
  const [fecha, setFecha] = useState<string>('');
  const [paradas, setParadas] = useState<Parada[]>([])
  const [viajes, setViajes] = useState<Viaje[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [resultados, setResultados] = useState<Viaje[]>([])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('http://localhost:8000/api/paradas/'),
      fetch('http://localhost:8000/api/viajes/')
    ])
      .then(([paradasRes, viajesRes]) => 
        Promise.all([paradasRes.json(), viajesRes.json()])
      )
      .then(([paradasData, viajesData]) => {
        setParadas(paradasData)
        setViajes(viajesData)
        setError(null)
      })
      .catch(error => {
        setError('Error al cargar los datos')
      })
      .finally(() => setLoading(false))
  }, [])

  const buscarViajes = (e: React.FormEvent) => {
    e.preventDefault();

    const encontrados = viajes.filter(viaje => {
      const detalles = viaje?.ruta_details?.detalles;
      if (!detalles || !Array.isArray(detalles)) return false;

      const detallesOrdenados = [...detalles].sort((a, b) => a.orden - b.orden);
      const origenIndex = detallesOrdenados.findIndex(d => d.parada.id_parada === origen);
      const destinoIndex = detallesOrdenados.findIndex(d => d.parada.id_parada === destino);

      const fechaCoincide = fecha ? viaje.fecha === fecha : true;

      return (
        origenIndex !== -1 &&
        destinoIndex !== -1 &&
        origenIndex < destinoIndex &&
        viaje.activo &&
        fechaCoincide
      );
    });

    setResultados(encontrados);
  }

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={buscarViajes} className="form-control w-full max-w-lg mx-auto space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Origen</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={origen}
            onChange={(e) => setOrigen(Number(e.target.value))}
            required
          >
            <option value="">Seleccione origen</option>
            {paradas.map(parada => (
              <option key={parada.id_parada} value={parada.id_parada}>
                {parada.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Destino</span>
          </label>
          <select
            className="select select-bordered w-full"
            value={destino}
            onChange={(e) => setDestino(Number(e.target.value))}
            required
          >
            <option value="">Seleccione destino</option>
            {paradas.map(parada => (
              <option key={parada.id_parada} value={parada.id_parada}>
                {parada.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">
            <span className="label-text">Fecha</span>
          </label>
          <input
            type="date"
            className="input input-bordered w-full"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          Buscar Viajes
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Resultados</h2>
        {resultados.length === 0 && <div>No se encontraron viajes.</div>}
        <ul>
          {resultados.map(viaje => (
            <li key={viaje.id_viaje} className="mb-2 border p-2 rounded">
              <div><b>Ruta:</b> {viaje.ruta_details?.nombre}</div>
              <div><b>Empresa:</b> {viaje.bus_details?.empresa_nombre}</div>
              <div><b>Fecha:</b> {viaje.fecha}</div>
              <div><b>Observaciones:</b> {viaje.observaciones || 'N/A'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Reservas