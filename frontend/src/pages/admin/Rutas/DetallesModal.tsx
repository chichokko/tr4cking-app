import { useState } from "react";
import axios from "axios";
import { X, ArrowUp, ArrowDown } from "lucide-react";
import { DetalleRuta, Parada } from "./types";

interface DetallesModalProps {
  visible: boolean;
  onClose: () => void;
  detalles: DetalleRuta[];
  rutaId: number;
  paradas: Parada[];
  onDetallesUpdated: () => void;
}

const DETALLES_API_URL = "http://127.0.0.1:8000/api/detalle-rutas/";

const DetallesModal = ({
  visible,
  onClose,
  detalles,
  rutaId,
  paradas,
  onDetallesUpdated,
}: DetallesModalProps) => {
  const [detallesTemp, setDetallesTemp] = useState<DetalleRuta[]>(
    detalles.map((d, index) => ({
      ...d,
      id_detalle: d.id_detalle || -(index + 1) // Usamos IDs negativos para temporales
    }))
  );
  const [cambiosPendientes, setCambiosPendientes] = useState(false);

  const agregarParada = async (paradaId: number) => {
    if (!paradaId || !rutaId) return;

    const parada = paradas.find(p => p.id_parada === paradaId);
    if (!parada) return;

    try {
        // Crear nueva parada directamente en el backend
        const response = await axios.post<DetalleRuta>(DETALLES_API_URL, {
        ruta: rutaId,
        parada: paradaId,
        orden: detallesTemp.length + 1
        });

        // Actualizar estado local solo si la petición fue exitosa
        const nuevaParada = {
        ...response.data,
        parada_nombre: parada.nombre,
        localidad_nombre: parada.localidad_nombre
        };
        
        setDetallesTemp([...detallesTemp, nuevaParada]);
        onDetallesUpdated();
    } catch (error) {
        console.error("Error al agregar parada:", error);
    }
  };

  const moverParada = (index: number, direccion: 'arriba' | 'abajo') => {
    if (
      (direccion === 'arriba' && index === 0) ||
      (direccion === 'abajo' && index === detallesTemp.length - 1)
    ) return;

    const newDetalles = [...detallesTemp];
    const newIndex = direccion === 'arriba' ? index - 1 : index + 1;
    
    [newDetalles[index], newDetalles[newIndex]] = [newDetalles[newIndex], newDetalles[index]];
    
    setDetallesTemp(newDetalles);
    setCambiosPendientes(true);
  };

	const eliminarParada = async (id_detalle: number) => {
		try {
			// Solo intentar eliminar en el backend si el ID es positivo
			if (id_detalle > 0) {
				await axios.delete(`${DETALLES_API_URL}${id_detalle}/`);
			}
			
			setDetallesTemp(detallesTemp.filter(d => d.id_detalle !== id_detalle));
			onDetallesUpdated();
		} catch (error) {
			console.error("Error al eliminar parada:", error);
		}
	};

  const guardarCambios = async () => {
    try {
      // Eliminar detalles existentes
      await Promise.all(
        detalles
          .filter(detalle => detalle.id_detalle)
          .map(detalle => 
            axios.delete(`${DETALLES_API_URL}${detalle.id_detalle}/`)
          )
      );

      // Crear nuevos detalles
      if (rutaId) {
        const nuevosDetalles = await Promise.all(
          detallesTemp.map((detalle, index) =>
            axios.post<DetalleRuta>(DETALLES_API_URL, {
              ruta: rutaId,
              parada: detalle.parada,
              parada_nombre: detalle.parada_nombre, // Añadido
              localidad_nombre: detalle.localidad_nombre, // Añadido
              orden: index + 1
            })
          )
        );

        setDetallesTemp(nuevosDetalles.map(res => res.data));
        setCambiosPendientes(false);
        onDetallesUpdated();
      }
    } catch (error) {
      console.error("Error al actualizar las paradas:", error);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Gestión de Paradas</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="space-y-2">
                {detallesTemp.map((detalle, index) => (
                  <div 
                    key={detalle.id_detalle} 
                    className="flex items-center justify-between bg-white dark:bg-gray-600 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-500 w-6">{index + 1}</span>
                      <span className="font-medium">
                        {detalle.parada_nombre} ({detalle.localidad_nombre})
                      </span>
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
                        onClick={() => eliminarParada(detalle.id_detalle)}
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

            <div className="flex space-x-2">
              <select
                onChange={(e) => agregarParada(Number(e.target.value))}
                className="flex-1 border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
                value=""
              >
                <option value="">+ Agregar parada a la ruta</option>
                {paradas
                  .filter(p => !detallesTemp.some(det => det.parada === p.id_parada))
                  .map((parada) => (
                    <option key={parada.id_parada} value={parada.id_parada}>
                      {parada.nombre} ({parada.localidad_nombre})
                    </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallesModal;
