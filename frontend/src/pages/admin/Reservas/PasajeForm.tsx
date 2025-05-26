import { FC, useState } from 'react';
import AsientosSelector from '../AsientosSelector2';

interface PasajeFormProps {
  viajes: any[];
  pasajeros: any[];
  onSubmit: (pasajeData: any) => void;
  loading: boolean;
}

const PasajeForm: FC<PasajeFormProps> = ({ viajes, pasajeros, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    viaje: '',
    pasajero: '',
    asiento: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      viaje: Number(formData.viaje),
      pasajero: Number(formData.pasajero),
      asiento: formData.asiento
    });
    setFormData({ viaje: '', pasajero: '', asiento: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-white">Agregar Pasaje</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Viaje</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            value={formData.viaje}
            onChange={(e) => setFormData({ ...formData, viaje: e.target.value })}
            required
          >
            <option value="">-- Seleccione Viaje --</option>
            {viajes.map(viaje => (
              <option key={viaje.id_viaje} value={viaje.id_viaje}>
                {viaje.fecha} - Bus: {viaje.bus.placa} - {viaje.bus.empresa.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Pasajero</label>
          <select
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
            value={formData.pasajero}
            onChange={(e) => setFormData({ ...formData, pasajero: e.target.value })}
            required
          >
            <option value="">-- Seleccione Pasajero --</option>
            {pasajeros.map(pasajero => (
              <option key={pasajero.id_pasajero} value={pasajero.id_pasajero}>
                {pasajero.cedula.nombre} {pasajero.cedula.apellido}
              </option>
            ))}
          </select>
        </div>
      </div>

      {formData.viaje && (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Selección de Asiento
          </label>
          <div className="bg-gray-700 p-4 rounded-lg">
            <AsientosSelector
              asientosOcupados={[]} // Aquí deberías pasar los asientos ocupados del viaje seleccionado
              asientoSeleccionado={formData.asiento}
              onAsientoClick={(numero) => setFormData({ ...formData, asiento: numero })}
            />
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Agregar Pasaje'}
        </button>
      </div>
    </form>
  );
};

export default PasajeForm;