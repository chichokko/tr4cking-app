import { FC, useState } from 'react';
import { AsientosSelector } from '../AsientosSelector';

interface ReservaConDetalles {
  id_reserva: number;
  fecha_reserva: string;
  pasajes: Array<{
    id_pasajero: number;
    cedula: number;
    asiento: number;
  }>;
}

interface ReservaFormProps {
  clientes: Array<{
    id_cliente: number;
    razon_social: string;
    cedula: number;
    dv: number;
  }>;
  viajes: Array<{
    id_viaje: number;
    fecha: string;
    ruta: number;
    nombre_ruta?: string;
    bus_placa: string;
    bus: {
      empresa_nombre: string;
    }
  }>;
  pasajeros: Array<{
    id_pasajero: number;
    cedula: number;
    persona_nombre: string;
  }>;
  onCreateReserva: (clienteId: number) => void;
  onAddPasaje: (pasajeData: any) => void;
  loading: boolean;
  reservaActual: {
    id_reserva?: number;
    cliente: number;
    estado: string;
    fecha_reserva: string | null;
  } | null;
  reservasActivas: Array<{
    id_reserva: number;
    cliente: number;
    estado: string;
    fecha_reserva: string | null;
    pasajes: Array<{
      id_pasaje: number;
      viaje: number;
      pasajero: number;
      asiento: number;
    }>;
  }>;
  clienteSeleccionado: number | null;
}

const ReservaForm: FC<ReservaFormProps> = ({
  clientes,
  viajes,
  pasajeros,
  onCreateReserva,
  onAddPasaje,
  loading,
  reservaActual,
  reservasActivas,
  clienteSeleccionado
}) => {
  const [pasajeForm, setPasajeForm] = useState({
    viaje: '',
    pasajero: '',
    asiento: 0
  });

  const handleClienteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const clienteId = parseInt(form.cliente.value);
    if (clienteId) {
      onCreateReserva(clienteId);
    }
  };

  const handlePasajeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pasajeForm.viaje && pasajeForm.pasajero && pasajeForm.asiento) {
      onAddPasaje({
        viaje: parseInt(pasajeForm.viaje),
        pasajero: parseInt(pasajeForm.pasajero),
        asiento: pasajeForm.asiento
      });
      setPasajeForm({ viaje: '', pasajero: '', asiento: 0 });
    }
  };

  // Add this near the other useState declarations
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Selector de Cliente */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-white">Seleccionar Cliente</h2>
        
        {/* Mostrar reservas activas si existen */}
        {clienteSeleccionado && reservasActivas.length > 0 && (
          <div className="mb-4">
            <h3 className="text-md font-medium text-gray-300 mb-2">
              Reservas Pendientes
            </h3>
            <div className="bg-gray-700 p-4 rounded-lg">
              {reservasActivas.map(reserva => (
                <div 
                  key={reserva.id_reserva}
                  className="flex justify-between items-center text-gray-300 py-2"
                >
                  <span>Reserva #{reserva.id_reserva}</span>
                  <span>{new Date(reserva.fecha_reserva!).toLocaleDateString()}</span>
                  <span>{reserva.pasajes.length} pasajes</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleClienteSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="cliente" className="block text-sm font-medium text-gray-300">
                Cliente
              </label>
              <select
                id="cliente"
                name="cliente"
                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white py-2 px-3"
                disabled={loading}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map(cliente => (
                  <option key={cliente.id_cliente} value={cliente.id_cliente}>
                    {cliente.razon_social} - RUC: {cliente.cedula}-{cliente.dv}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Siguiente'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Formulario de Pasajes */}
      {reservaActual && (
        <form onSubmit={handlePasajeSubmit} className="bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Agregar Pasaje</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Viaje
              </label>
              <select
                value={pasajeForm.viaje}
                onChange={(e) => setPasajeForm({ ...pasajeForm, viaje: e.target.value })}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                disabled={loading}
                required
              >
                <option value="">Seleccione un viaje</option>
                {viajes.map(viaje => (
                  <option key={viaje.id_viaje} value={viaje.id_viaje}>
                    {viaje.nombre_ruta}- {viaje.fecha} - {viaje.bus.empresa_nombre} ({viaje.bus_placa})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Pasajero
              </label>
              <select
                value={pasajeForm.pasajero}
                onChange={(e) => setPasajeForm({ ...pasajeForm, pasajero: e.target.value })}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                disabled={loading}
                required
              >
                <option value="">Seleccione un pasajero</option>
                {pasajeros.map(pasajero => (
                  <option key={pasajero.id_pasajero} value={pasajero.id_pasajero}>
                    {pasajero.cedula} - {pasajero.persona_nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {pasajeForm.viaje && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Asiento Seleccionado: {pasajeForm.asiento || 'Ninguno'}
              </label>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Seleccionar Asiento
              </button>
            </div>
          )}

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 overflow-y-auto z-50">
              <div className="flex min-h-screen items-center justify-center px-4">
                <div className="fixed inset-0 bg-black opacity-50" onClick={() => setIsModalOpen(false)}></div>
                
                <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-lg w-full m-4">
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Seleccionar Asiento
                    </h3>

                    <AsientosSelector
                      asientosOcupados={[] as number[]}
                      asientoSeleccionado={pasajeForm.asiento}
                      onAsientoClick={(numero: number) => setPasajeForm({ ...pasajeForm, asiento: numero })}
                    />

                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm bg-gray-600 hover:bg-gray-500 text-white rounded-md"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        Confirmar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              disabled={loading || !pasajeForm.viaje || !pasajeForm.pasajero || !pasajeForm.asiento}
            >
              {loading ? 'Procesando...' : 'Agregar Pasaje'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReservaForm;