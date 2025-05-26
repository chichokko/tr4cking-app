import { FC } from 'react';

interface ReservaTableProps {
  pasajes: Array<{
    viaje: number;
    pasajero: number;
    asiento: number;
  }>;
  viajes: any[];
  pasajeros: any[];
  loading: boolean;
  onEditPasaje: (index: number, pasaje: any) => void;
  onRemovePasaje: (index: number) => void;
}

const ReservaTable: FC<ReservaTableProps> = ({ 
  pasajes, 
  viajes, 
  pasajeros, 
  loading,
  onEditPasaje,
  onRemovePasaje 
}) => {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4 text-white">Pasajes Reservados</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-700">
          <tr>
            <th className="p-3 text-gray-300">Pasajero</th>
            <th className="p-3 text-gray-300">Viaje</th>
            <th className="p-3 text-gray-300">Bus</th>
            <th className="p-3 text-gray-300">Asiento</th>
            <th className="p-3 text-gray-300">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800">
          {pasajes.map((pasaje, index) => {
            const viaje = viajes.find(v => v.id_viaje === pasaje.viaje);
            const pasajero = pasajeros.find(p => p.id_pasajero === pasaje.pasajero);

            return (
              <tr key={`pasaje-${index}`} className="border-t border-gray-700">
                <td className="p-3 text-gray-300">
                  {pasajero?.persona_nombre}
                </td>
                <td className="p-3 text-gray-300">
                  {new Date(viaje?.fecha).toLocaleDateString()}
                </td>
                <td className="p-3 text-gray-300">
                  {viaje?.bus.placa}
                </td>
                <td className="p-3 text-gray-300">
                  {pasaje.asiento}
                </td>
                <td className="p-3 text-gray-300">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEditPasaje(index, pasaje)}
                      className="text-blue-500 hover:text-blue-400"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onRemovePasaje(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReservaTable;