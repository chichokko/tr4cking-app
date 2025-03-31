import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/usuarios/";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dni: "",
    telefono: "",
    direccion: "",
    agencia: "",
    rol: "empleado",
  });
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);

  // Obtener usuarios al cargar la página
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (usuarioEditando) {
        await axios.put(`${API_URL}${usuarioEditando}/`, formData);
      } else {
        await axios.post(API_URL, formData);
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
      await axios.delete(`${API_URL}${id}/`);
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
    <div className="p-6 dark:bg-gray-900 dark:text-white">
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
          <option value="1">Agencia 1</option>
          <option value="2">Agencia 2</option>
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
      <table className="w-full mt-4 border-collapse bg-white dark:bg-gray-800 shadow-md">
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
            <tr key={usuario.id} className="border-t dark:border-gray-600">
              <td className="p-2">{usuario.username}</td>
              <td className="p-2">{usuario.email}</td>
              <td className="p-2">{usuario.dni}</td>
              <td className="p-2">{usuario.telefono}</td>
              <td className="p-2">{usuario.direccion}</td>
              <td className="p-2">{usuario.agencia}</td>
              <td className="p-2">{usuario.rol}</td>
              <td className="p-2">
                <button
                  className="text-yellow-500 mr-2"
                  onClick={() => handleEdit(usuario)}
                >
                  Editar
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(usuario.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
