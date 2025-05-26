import { FC } from 'react';

interface Cliente {
  id_cliente: number;
  razon_social: string;
  ruc: string;
  telefono?: string;
}

interface CabeceraReservaProps {
  clientes: Cliente[];
  onClienteSelect: (clienteId: number) => void;
}

const CabeceraReserva: FC<CabeceraReservaProps> = ({ clientes, onClienteSelect }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-white">Datos del Cliente</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Seleccione un cliente
          </label>
          <select 
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            onChange={(e) => onClienteSelect(Number(e.target.value))}
          >
            <option value="">-- Seleccione --</option>
            {clientes.map(cliente => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.razon_social} - RUC: {cliente.ruc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default CabeceraReserva;