import { useState } from "react";
import axios from "axios";
import { Localidad, Ruta, DetalleRuta } from "./types";

interface RutasFormProps {
  localidades: Localidad[];
  onRutaCreated: () => void;
  rutaEditando: Ruta | null;
  onCancelEdit: () => void;
}

const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";
const DETALLES_API_URL = "http://127.0.0.1:8000/api/detalle-rutas/";

interface FormData {
  nombre: string;
  activo: boolean;
}

const RutasForm = ({ onRutaCreated, rutaEditando, onCancelEdit }: RutasFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    nombre: rutaEditando?.nombre ?? '',
    activo: rutaEditando?.activo ?? true,
  });
  const [origen, setOrigen] = useState<number | null>(
    rutaEditando?.detalles?.[0]?.parada || null
  );
  const [destino, setDestino] = useState<number | null>(
    rutaEditando?.detalles?.[1]?.parada || null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let rutaId;
      if (rutaEditando) {
        await axios.put(`${RUTAS_API_URL}${rutaEditando.id_ruta}/`, formData);
        rutaId = rutaEditando.id_ruta;
      } else {
        const response = await axios.post<{ id_ruta: number }>(RUTAS_API_URL, formData);
        rutaId = response.data.id_ruta;
      }

      // Agregar origen y destino como detalles
      if (origen && destino) {
        // Si estamos editando, primero eliminamos los detalles existentes
        if (rutaEditando?.detalles) {
          await Promise.all(
            rutaEditando.detalles.map((detalle) =>
              axios.delete(`${DETALLES_API_URL}${detalle.id_detalle}/`)
            )
          );
        }

        // Agregar origen y destino
        await Promise.all([
          axios.post(DETALLES_API_URL, {
            ruta: rutaId,
            parada: origen,
            orden: 1,
          }),
          axios.post(DETALLES_API_URL, {
            ruta: rutaId,
            parada: destino,
            orden: 2,
          }),
        ]);
      }

      onRutaCreated();
      resetForm();
    } catch (error) {
      console.error("Error al guardar ruta:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      activo: true,
    });
    setOrigen(null);
    setDestino(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md space-y-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre de la Ruta
            <input
              type="text"
              className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600 mt-1"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
            />
          </label>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="rounded"
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
            onClick={onCancelEdit}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default RutasForm;
