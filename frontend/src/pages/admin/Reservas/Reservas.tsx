import { useState, useEffect } from 'react';
import axios from 'axios';
import ReservaTable from './ReservaTable';
import ReservaForm from './ReservaForm';

// Interfaces
interface Cliente {
  id_cliente: number;
  razon_social: string;
  cedula: number;
  dv: number;
}

interface Viaje {
  id_viaje: number;
  fecha: string;
  ruta: number;
  nombre_ruta?: string;
  bus_placa: string;
  bus: {
    empresa_nombre: string;
  };
}

interface Pasajero {
  id_pasajero: number;
  cedula: number;
  persona_nombre: string;
}

interface Reserva {
  id_reserva: number;
  cliente: number;
  estado: 'Pagada' | 'Pendiente' | 'Cancelada';
  fecha_reserva: string | null;
}

interface PasajeForm {
  viaje: number;
  pasajero: number;
  asiento: number;
}

interface ReservaConDetalles extends Reserva {
  pasajes: Array<{
    id_pasaje: number;
    viaje: number;
    pasajero: number;
    asiento: number;
  }>;
}

const Reservas = () => {
  // Estados
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [pasajeros, setPasajeros] = useState<Pasajero[]>([]);
  const [reservaActual, setReservaActual] = useState<Reserva | null>(null);
  const [pasajesTemp, setPasajesTemp] = useState<PasajeForm[]>([]);
  const [pasajes, setPasajes] = useState<PasajeForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [reservasActivas, setReservasActivas] = useState<ReservaConDetalles[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);

  // URLs de la API
  const API_URL = 'http://127.0.0.1:8000/api';

  // Efectos para cargar datos iniciales
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [clientesRes, viajesRes, pasajerosRes] = await Promise.all([
        axios.get<Cliente[]>(`${API_URL}/clientes/`),
        axios.get<Viaje[]>(`${API_URL}/viajes/`),
        axios.get<Pasajero[]>(`${API_URL}/pasajeros/`)
      ]);
      console.log('Viajes cargados:', viajesRes.data);

      setClientes(clientesRes.data);
      setViajes(viajesRes.data);
      setPasajeros(pasajerosRes.data);
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
    } finally {
      setLoading(false);
    }
  };

  // Agregar nueva función para obtener reservas por cliente
  const fetchReservasPorCliente = async (clienteId: number) => {
    try {
      setLoading(true);
      const response = await axios.get<ReservaConDetalles[]>(
        `${API_URL}/reservas/?cliente=${clienteId}&estado=Pendiente`
      );
      setReservasActivas(response.data);
      
      // Si hay reservas pendientes, cargar la primera
      if (response.data.length > 0) {
        const reservaActiva = response.data[0];
        setReservaActual(reservaActiva);
        setPasajes(reservaActiva.pasajes);
      }
    } catch (error) {
      console.error('Error al obtener reservas del cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  // Manejadores
  const handleCreateReserva = async (clienteId: number) => {
    try {
      setLoading(true);
      // Primero verificar si hay reservas pendientes
      const reservasExistentes = await axios.get<ReservaConDetalles[]>(
        `${API_URL}/reservas/?cliente=${clienteId}&estado=Pendiente`
      );

      if (reservasExistentes.data.length > 0) {
        // Si hay reservas pendientes, usar la primera
        setReservaActual(reservasExistentes.data[0]);
        setPasajes(reservasExistentes.data[0].pasajes);
      } else {
        // Si no hay reservas pendientes, crear una nueva
        const response = await axios.post<Reserva>(`${API_URL}/reservas/`, {
          cliente: clienteId,
          estado: 'Pendiente'
        });
        setReservaActual(response.data);
        setPasajes([]);
      }
      setClienteSeleccionado(clienteId);
    } catch (error) {
      console.error('Error al crear/obtener reserva:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPasaje = (pasajeData: PasajeForm) => {
    setPasajesTemp(currentPasajes => [...currentPasajes, pasajeData]);
  };

  const handleRemovePasaje = (index: number) => {
    setPasajesTemp(currentPasajes => 
      currentPasajes.filter((_, i) => i !== index)
    );
  };

  const handleEditPasaje = (index: number, pasajeData: PasajeForm) => {
    setPasajesTemp(currentPasajes => 
      currentPasajes.map((pasaje, i) => 
        i === index ? pasajeData : pasaje
      )
    );
  };

  const handleFinalizarReserva = async () => {
    if (!reservaActual?.id_reserva || pasajesTemp.length === 0) return;

    try {
      setLoading(true);
      
      // Crear todos los pasajes
      await Promise.all(
        pasajesTemp.map(pasaje => 
          axios.post(`${API_URL}/pasajes/`, {
            ...pasaje,
            reserva: reservaActual.id_reserva
          })
        )
      );

      // Reset states
      setPasajesTemp([]);
      setReservaActual(null);
      setClienteSeleccionado(null);
      
    } catch (error) {
      console.error('Error al finalizar reserva:', error);
    } finally {
      setLoading(false);
    }
  };

  // Modificar el return para mostrar las reservas activas
  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Sistema de Reservas</h1>
        
        <div className="space-y-6">
          <ReservaForm 
            clientes={clientes}
            viajes={viajes}
            pasajeros={pasajeros}
            onCreateReserva={handleCreateReserva}
            onAddPasaje={handleAddPasaje}
            loading={loading}
            reservaActual={reservaActual}
            reservasActivas={reservasActivas}
            clienteSeleccionado={clienteSeleccionado}
          />

          {pasajes && pasajes.length > 0 && (
            <div className="bg-gray-800 p-6 rounded-xl shadow-md">
              <ReservaTable
                pasajes={pasajes}
                viajes={viajes}
                pasajeros={pasajeros}
                loading={loading}
                onEditPasaje={handleEditPasaje}
                onRemovePasaje={handleRemovePasaje}
              />
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleFinalizarReserva}
                  disabled={loading || pasajes.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md"
                >
                  {loading ? 'Procesando...' : 'Finalizar Reserva'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservas;