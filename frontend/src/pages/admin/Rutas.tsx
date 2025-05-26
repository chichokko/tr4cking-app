import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, MapPin, ArrowUp, ArrowDown, X } from "lucide-react";

interface Localidad {
  id_localidad: number;
  nombre: string;
}

interface DetalleRuta {
  id: number;
  parada: number;
  nombre_parada: string;
  orden: number;
}

interface Ruta {
  id_ruta: number;
  duracion_total: number;
  distancia_km: number;
  precio_base: number;
  activo: boolean;
  fecha_actualizacion?: string;
  detalles: DetalleRuta[];
}

const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";
const LOCALIDADES_API_URL = "http://127.0.0.1:8000/api/localidades/";
const DETALLES_API_URL = "http://127.0.0.1:8000/api/detalle-rutas/";

const Rutas = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [formData, setFormData] = useState({
    duracion_total: 0,
    distancia_km: 0,
    precio_base: 0,
    activo: true,
  });
  const [origen, setOrigen] = useState<number | null>(null);
  const [destino, setDestino] = useState<number | null>(null);
  const [rutaEditando, setRutaEditando] = useState<number | null>(null);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<number | null>(null);
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [detalles, setDetalles] = useState<DetalleRuta[]>([]);
  const [detallesTemp, setDetallesTemp] = useState<DetalleRuta[]>([]);
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  useEffect(() => {
    fetchRutas();
    fetchLocalidades();
  }, []);

  const fetchRutas = async () => {
    try {
      const response = await axios.get<Ruta[]>(RUTAS_API_URL);
      setRutas(response.data);
    } catch (error) {
      console.error("Error al obtener rutas:", error);
    }
  };

  const fetchLocalidades = async () => {
    try {
      const response = await axios.get<Localidad[]>(LOCALIDADES_API_URL);
      setLocalidades(response.data);
    } catch (error) {
      console.error("Error al obtener localidades:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let rutaId;
      if (rutaEditando) {
        await axios.put(`${RUTAS_API_URL}${rutaEditando}/`, formData);
        rutaId = rutaEditando;
      } else {
        const response = await axios.post(RUTAS_API_URL, formData);
        rutaId = (response.data as { id_ruta: number }).id_ruta;
      }

      // Agregar origen y destino como detalles
      if (origen && destino) {
        // Si estamos editando, primero eliminamos los detalles existentes
        if (rutaEditando) {
          const rutaActual = rutas.find(r => r.id_ruta === rutaEditando);
          if (rutaActual?.detalles) {
            await Promise.all(rutaActual.detalles.map(detalle => 
              axios.delete(`${DETALLES_API_URL}${detalle.id}/`)
            ));
          }
        }

        // Agregar origen
        await axios.post(DETALLES_API_URL, {
          ruta: rutaId,
          parada: origen,
          orden: 1
        });

        // Agregar destino
        await axios.post(DETALLES_API_URL, {
          ruta: rutaId,
          parada: destino,
          orden: 2
        });
      }

      fetchRutas();
      resetForm();
    } catch (error) {
      console.error("Error al guardar ruta:", error);
    }
  };

  const handleEdit = (ruta: Ruta) => {
    setFormData({
      duracion_total: ruta.duracion_total,
      distancia_km: ruta.distancia_km,
      precio_base: ruta.precio_base,
      activo: ruta.activo,
    });
    if (ruta.detalles && ruta.detalles.length >= 2) {
      setOrigen(ruta.detalles[0].parada);
      setDestino(ruta.detalles[1].parada);
    }
    setRutaEditando(ruta.id_ruta);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de eliminar esta ruta?')) return;
    try {
      await axios.delete(`${RUTAS_API_URL}${id}/`);
      fetchRutas();
    } catch (error) {
      console.error("Error al eliminar ruta:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      duracion_total: 0,
      distancia_km: 0,
      precio_base: 0,
      activo: true,
    });
    setOrigen(null);
    setDestino(null);
    setRutaEditando(null);
  };

  const handleGestionarDetalles = (ruta: Ruta) => {
    setRutaSeleccionada(ruta.id_ruta);
    setDetalles(ruta.detalles || []);
    setDetallesTemp(ruta.detalles || []);
    setModalDetallesVisible(true);
    setCambiosPendientes(false);
  };

  const agregarParada = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paradaId = Number(e.target.value);
    if (!paradaId || !rutaSeleccionada) return;

    try {
      const response = await axios.post<DetalleRuta>(DETALLES_API_URL, {
        ruta: rutaSeleccionada,
        parada: paradaId,
        orden: detallesTemp.length + 1
      });

      setDetallesTemp([...detallesTemp, response.data]);
      setCambiosPendientes(true);
    } catch (error) {
      console.error("Error al agregar parada:", error);
    }
  };

  // Helper function to get origin-destination display
  const getOrigenDestino = (detalles: DetalleRuta[]) => {
    if (!detalles || detalles.length < 2) return "No definido";
    return `${detalles[0].nombre_parada} - ${detalles[1].nombre_parada}`;
  };

  const moverParada = (index: number, direccion: 'arriba' | 'abajo') => {
    if (
      (direccion === 'arriba' && index === 0) ||
      (direccion === 'abajo' && index === detallesTemp.length - 1)
    ) return;

    const newDetalles = [...detallesTemp];
    const newIndex = direccion === 'arriba' ? index - 1 : index + 1;
    
    // Intercambiar elementos
    [newDetalles[index], newDetalles[newIndex]] = [newDetalles[newIndex], newDetalles[index]];
    
    setDetallesTemp(newDetalles);
    setCambiosPendientes(true);
  };

  const eliminarParada = async (id: number) => {
    try {
      await axios.delete(`${DETALLES_API_URL}${id}/`);
      setDetalles(detalles.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error al eliminar parada:", error);
    }
  };

  const guardarCambiosDetalles = async () => {
    try {
      // Actualizar todos los órdenes en una sola operación
      await Promise.all(
        detallesTemp.map((detalle, index) =>
          axios.patch(`${DETALLES_API_URL}${detalle.id}/`, {
            orden: index + 1
          })
        )
      );
      
      setDetalles(detallesTemp);
      setCambiosPendientes(false);
      fetchRutas(); // Actualizar la lista de rutas
    } catch (error) {
      console.error("Error al actualizar el orden de las paradas:", error);
    }
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Rutas
      </h2>

      {/* Formulario de Ruta */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Origen
              <select
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 mt-1"
                value={origen || ""}
                onChange={(e) => setOrigen(Number(e.target.value))}
                required
              >
                <option value="">Seleccionar origen</option>
                {localidades.map((localidad) => (
                  <option key={localidad.id_localidad} value={localidad.id_localidad}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Destino
              <select
                className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 mt-1"
                value={destino || ""}
                onChange={(e) => setDestino(Number(e.target.value))}
                required
              >
                <option value="">Seleccionar destino</option>
                {localidades.map((localidad) => (
                  <option key={localidad.id_localidad} value={localidad.id_localidad}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Duración Total
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.duracion_total}
                  onChange={(e) => setFormData({ ...formData, duracion_total: Number(e.target.value) })}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">horas</span>
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Distancia
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.distancia_km}
                  onChange={(e) => setFormData({ ...formData, distancia_km: Number(e.target.value) })}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">km</span>
                </div>
              </div>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Precio Base
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">Gs.</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border p-2 pl-12 rounded dark:bg-gray-700 dark:border-gray-600"
                  value={formData.precio_base}
                  onChange={(e) => setFormData({ ...formData, precio_base: Number(e.target.value) })}
                  required
                />
              </div>
            </label>
          </div>

          <div className="flex items-center h-full pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded"
                checked={formData.activo}
                onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              />
              <span className="text-sm font-medium">Ruta Activa</span>
            </label>
          </div>
        </div>

        <div className="flex space-x-2 pt-4">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {rutaEditando ? "Actualizar Ruta" : "Crear Ruta"}
          </button>
          {rutaEditando && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Rutas */}
      <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md mt-4">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2">Ruta</th>
            <th className="p-2">Duración Total (h)</th>
            <th className="p-2">Distancia (km)</th>
            <th className="p-2">Precio Base</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Paradas</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((ruta) => (
            <tr key={ruta.id_ruta} className="border-t dark:border-gray-600">
              <td className="p-2">{getOrigenDestino(ruta.detalles)}</td>
              <td className="p-2">{ruta.duracion_total}</td>
              <td className="p-2">{ruta.distancia_km}</td>
              <td className="p-2">{ruta.precio_base}</td>
              <td className="p-2">{ruta.activo ? "Activo" : "Inactivo"}</td>
              <td className="p-2">{ruta.detalles?.length || 0} paradas</td>
              <td className="p-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(ruta)}
                  className="text-yellow-500"
                  title="Editar"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(ruta.id_ruta)}
                  className="text-red-500"
                  title="Eliminar"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={() => handleGestionarDetalles(ruta)}
                  className="text-blue-500"
                  title="Gestionar Paradas"
                >
                  <MapPin size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Modal de Detalles */}
      {modalDetallesVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Gestión de Paradas</h3>
                <button
                  onClick={() => setModalDetallesVisible(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Lista de paradas */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="space-y-2">
                    {detallesTemp.map((detalle, index) => (
                      <div 
                        key={detalle.id} 
                        className="flex items-center justify-between bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500 w-6">{index + 1}</span>
                          <span className="font-medium">{detalle.nombre_parada}</span>
                          {index === 0 && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Origen
                            </span>
                          )}
                          {index === detallesTemp.length - 1 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Destino
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => moverParada(index, 'arriba')}
                            disabled={index === 0}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                            title="Mover arriba"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            onClick={() => moverParada(index, 'abajo')}
                            disabled={index === detallesTemp.length - 1}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
                            title="Mover abajo"
                          >
                            <ArrowDown size={16} />
                          </button>
                          <button
                            onClick={() => eliminarParada(detalle.id)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                            title="Eliminar"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selector de paradas */}
                <div className="flex space-x-2">
                  <select
                    onChange={agregarParada}
                    className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                    value=""
                  >
                    <option value="">+ Agregar parada a la ruta</option>
                    {localidades
                      .filter(loc => !detallesTemp.some(det => det.parada === loc.id_localidad))
                      .map((localidad) => (
                        <option key={localidad.id_localidad} value={localidad.id_localidad}>
                          {localidad.nombre}
                        </option>
                    ))}
                  </select>
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end space-x-2 pt-4">
                  {cambiosPendientes && (
                    <button
                      onClick={guardarCambiosDetalles}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Guardar Cambios
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (cambiosPendientes && !window.confirm('Hay cambios sin guardar. ¿Desea cerrar de todas formas?')) {
                        return;
                      }
                      setModalDetallesVisible(false);
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rutas;