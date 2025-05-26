import { Edit, Trash, MapPin } from "lucide-react";
import { Ruta, DetalleRuta } from "./types";

interface RutasTableProps {
  rutas: Ruta[];
  onEdit: (ruta: Ruta) => void;
  onDelete: (id: number) => void;
  onGestionarDetalles: (ruta: Ruta) => void;
}

const getOrigenDestino = (detalles: DetalleRuta[] | undefined) => {
  if (!detalles || detalles.length === 0) return "Sin paradas";
  
  const detallesOrdenados = [...detalles].sort((a, b) => a.orden - b.orden);
  
  if (detalles.length === 1) {
    return `${detallesOrdenados[0].parada_nombre} - Sin destino`;
  }
  
  return `${detallesOrdenados[0].parada_nombre} - ${detallesOrdenados[detallesOrdenados.length - 1].parada_nombre}`;
};

const RutasTable = ({ rutas, onEdit, onDelete, onGestionarDetalles }: RutasTableProps) => {
  return (
    <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md mt-4">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-700">
          <th className="p-2">Nombre</th>
          <th className="p-2">Estado</th>
          <th className="p-2">Paradas</th>
          <th className="p-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {rutas.map((ruta) => (
          <tr key={ruta.id_ruta} className="border-t dark:border-gray-600">
            <td className="p-2">{ruta.nombre}</td>
            <td className="p-2">{ruta.activo ? "Activo" : "Inactivo"}</td>
            <td className="p-2">{ruta.detalles?.length || 0} paradas</td>
            <td className="p-2 flex space-x-2">
              <button
                onClick={() => onEdit(ruta)}
                className="text-yellow-500"
                title="Editar"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => onDelete(ruta.id_ruta)}
                className="text-red-500"
                title="Eliminar"
              >
                <Trash size={16} />
              </button>
              <button
                onClick={() => onGestionarDetalles(ruta)}
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
  );
};

export default RutasTable;
