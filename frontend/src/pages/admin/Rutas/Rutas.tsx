import { useState, useEffect } from "react";
import axios from "axios";
import { Ruta, Localidad, Parada } from "./types";
import RutasForm from "./RutasForm";
import RutasTable from "./RutasTable";
import DetallesModal from "./DetallesModal";

const RUTAS_API_URL = "http://127.0.0.1:8000/api/rutas/";
const LOCALIDADES_API_URL = "http://127.0.0.1:8000/api/localidades/";

const Rutas = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [rutaEditando, setRutaEditando] = useState<Ruta | null>(null);
  const [modalDetallesVisible, setModalDetallesVisible] = useState(false);
  const [rutaSeleccionada, setRutaSeleccionada] = useState<Ruta | null>(null);
  const [paradas, setParadas] = useState<Parada[]>([]);

  useEffect(() => {
    fetchRutas();
    fetchLocalidades();
    fetchParadas();
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

  const fetchParadas = async () => {
    try {
      const response = await axios.get<Parada[]>("http://127.0.0.1:8000/api/paradas/");
      setParadas(response.data);
    } catch (error) {
      console.error("Error al obtener paradas:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de eliminar esta ruta?")) return;
    try {
      await axios.delete(`${RUTAS_API_URL}${id}/`);
      fetchRutas();
    } catch (error) {
      console.error("Error al eliminar ruta:", error);
    }
  };

  const handleGestionarDetalles = (ruta: Ruta) => {
    setRutaSeleccionada(ruta);
    setModalDetallesVisible(true);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Rutas
      </h2>

      <RutasForm
        localidades={localidades}
        onRutaCreated={fetchRutas}
        rutaEditando={rutaEditando}
        onCancelEdit={() => setRutaEditando(null)}
      />

      <RutasTable
        rutas={rutas}
        onEdit={setRutaEditando}
        onDelete={handleDelete}
        onGestionarDetalles={handleGestionarDetalles}
      />

      {rutaSeleccionada && (
        <DetallesModal
          visible={modalDetallesVisible}
          onClose={() => {
            setModalDetallesVisible(false);
            setRutaSeleccionada(null);
          }}
          detalles={rutaSeleccionada.detalles}
          rutaId={rutaSeleccionada.id_ruta}
          paradas={paradas}
          onDetallesUpdated={fetchRutas}
        />
      )}
    </div>
  );
};

export default Rutas;
