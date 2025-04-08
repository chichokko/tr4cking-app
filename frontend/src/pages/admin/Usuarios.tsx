import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import { UsuarioDTO } from "../../shared/shared.types";

const USUARIOS_API_URL = "http://127.0.0.1:8000/api/users/";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState<UsuarioDTO[]>([]);
  const [formData, setFormData] = useState<
    Omit<UsuarioDTO, "id" | "date_joined" | "last_login"> & { password?: string }
  >({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    is_staff: false,
    is_active: true,
    password: "",
  });
  const [usuarioEditando, setUsuarioEditando] = useState<number | null>(null);

  // Obtener usuarios al cargar la página
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(USUARIOS_API_URL);
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (usuarioEditando) {
        const { password, ...data } = formData; // Excluir contraseña si está vacía al editar
        await axios.put(`${USUARIOS_API_URL}${usuarioEditando}/`, password ? formData : data);
      } else {
        await axios.post(USUARIOS_API_URL, formData);
      }

      fetchUsuarios();
      resetForm();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  const handleEdit = (usuario: UsuarioDTO) => {
    setFormData({
      username: usuario.username,
      first_name: usuario.first_name,
      last_name: usuario.last_name,
      email: usuario.email,
      is_staff: usuario.is_staff,
      is_active: usuario.is_active,
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
      first_name: "",
      last_name: "",
      email: "",
      is_staff: false,
      is_active: true,
      password: "",
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
          type="text"
          placeholder="Nombre"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Apellido"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
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
          type="password"
          placeholder="Contraseña"
          className="border p-2 rounded dark:bg-gray-700 dark:border-gray-600"
          value={formData.password || ""}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!usuarioEditando} // Obligatorio solo al crear
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_staff}
            onChange={(e) => setFormData({ ...formData, is_staff: e.target.checked })}
          />
          <span>Es administrador</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <span>Está activo</span>
        </label>
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

      {/* Tabla o Listado: */}
      <div className="w-full overflow-x-auto py-4">
        <table className="table w-full border-collapse bg-white dark:bg-gray-800 shadow-md">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700 dark:text-white">
              <th className="p-2">Nombre de usuario</th>
              <th className="p-2">Nombre</th>
              <th className="p-2">Apellido</th>
              <th className="p-2">Correo</th>
              <th className="p-2">Es administrador</th>
              <th className="p-2">Está activo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((usuario) => (
              <tr
                key={usuario.id}
                className="row-hover border-t dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="p-2">{usuario.username}</td>
                <td className="p-2">{usuario.first_name}</td>
                <td className="p-2">{usuario.last_name}</td>
                <td className="p-2">{usuario.email}</td>
                <td className="p-2">{usuario.is_staff ? "Sí" : "No"}</td>
                <td className="p-2">{usuario.is_active ? "Sí" : "No"}</td>
                <td className="p-2 flex space-x-2">
                  <button
                    className="btn btn-circle btn-text btn-sm text-yellow-500"
                    aria-label="Editar"
                    onClick={() => handleEdit(usuario)}
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    className="btn btn-circle btn-text btn-sm text-red-500"
                    aria-label="Eliminar"
                    onClick={() => handleDelete(usuario.id)}
                  >
                    <Trash size={20} />
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
