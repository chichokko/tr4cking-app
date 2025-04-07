import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { UsuarioDTO } from "../../shared/shared.types";

const USUARIOS_API_URL = "http://127.0.0.1:8000/api/usuarios/";
const AGENCIAS_API_URL = "http://127.0.0.1:8000/api/agencias/";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [agencias, setAgencias] = useState<any[]>([]); // Estado para almacenar las agencias
  const [formData, setFormData] = useState<Omit<UsuarioDTO, "id">>({
    username: "",
    email: "",
    dni: "",
    telefono: "",
    direccion: "",
    agencia: "",
    rol: "empleado",
  });
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);

  // Obtener usuarios y agencias al cargar la página
  useEffect(() => {
    fetchUsuarios();
    fetchAgencias(); // Llamada para obtener las agencias
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(USUARIOS_API_URL);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchAgencias = async () => {
    try {
      const response = await axios.get(AGENCIAS_API_URL);
      setAgencias(response.data); // Guardar las agencias en el estado
    } catch (error) {
      console.error("Error al obtener agencias:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (usuarioEditando) {
        await axios.put(`${USUARIOS_API_URL}${usuarioEditando}/`, formData);
      } else {
        await axios.post(USUARIOS_API_URL, formData);
      }

      fetchUsuarios();
      resetForm();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleEdit = (usuario: any) => {
    setFormData({
      username: usuario.username,
      email: usuario.email,
      dni: usuario.dni,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      agencia: usuario.agencia,
      rol: usuario.rol,
    });
    setUsuarioEditando(usuario.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${USUARIOS_API_URL}${id}/`);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      dni: "",
      telefono: "",
      direccion: "",
      agencia: "",
      rol: "empleado",
    });
    setUsuarioEditando(null);
  };

  return (
    <div className="p-2 dark:bg-gray-900 dark:text-white">
      <h2 className="text-xl font-bold text-blue-600 dark:text-white mb-4">
        Gestión de Usuarios
      </h2>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Correo Electrónico"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="DNI"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.dni}
          onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.telefono}
          onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
        />
        <input
          type="text"
          placeholder="Dirección"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
        />
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.agencia}
          onChange={(e) => setFormData({ ...formData, agencia: e.target.value })}
        >
          <option value="">Seleccione una agencia</option>
          {agencias.map((agencia) => (
            <option key={agencia.id} value={agencia.id}>
              {agencia.nombre}
            </option>
          ))}
        </select>
        <select
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.rol}
          onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
        >
          <option value="admin">Administrador</option>
          <option value="empleado">Empleado</option>
        </select>
        <div className="flex space-x-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            {usuarioEditando ? "Actualizar" : "Agregar"}
          </button>
          {usuarioEditando && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla de Usuarios */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Nombre</th>
              <th className="p-2">Correo</th>
              <th className="p-2">DNI</th>
              <th className="p-2">Teléfono</th>
              <th className="p-2">Dirección</th>
              <th className="p-2">Agencia</th>
              <th className="p-2">Rol</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="p-2">{usuario.username}</td>
                <td className="p-2">{usuario.email}</td>
                <td className="p-2">{usuario.dni}</td>
                <td className="p-2">{usuario.telefono}</td>
                <td className="p-2">{usuario.direccion}</td>
                <td className="p-2">{usuario.agencia}</td>
                <td className="p-2">{usuario.rol}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(usuario)}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
