import { FC } from 'react';

interface DetalleReservaProps {
  pasajes: any[];
  viajes: any[];
  pasajeros: any[];
}

const DetalleReserva: FC<DetalleReservaProps> = ({ pasajes, viajes, pasajeros }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Detalle de la Reserva</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pasajero
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Viaje
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asiento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pasajes.map((pasaje, index) => {
              const viaje = viajes.find(v => v.id_viaje === pasaje.viaje);
              const pasajero = pasajeros.find(p => p.id_pasajero === pasaje.pasajero);

              return (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pasajero ? `${pasajero.cedula.nombre} ${pasajero.cedula.apellido}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {viaje ? `${viaje.fecha} - Bus: ${viaje.bus.placa}` : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {pasaje.asiento}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetalleReserva;