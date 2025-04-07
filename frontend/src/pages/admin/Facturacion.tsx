import { useState } from "react";

const Facturacion = () => {
  // Estados para los formularios
  const [factura, setFactura] = useState({
    numero: "0001",
    fecha: "",
    termino: "Contado",
  });

  const [cliente, setCliente] = useState({
    ruc: "",
    nombre: "",
  });

  const [servicio, setServicio] = useState({
    codigo: "",
    descripcion: "",
  });

  const [servicios, setServicios] = useState([
    { codigo: "001", descripcion: "Servicio de Transporte", cantidad: 1, precio: 100000 },
  ]);

  // Manejo de cambios en los formularios
  const handleFacturaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleServicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServicio({ ...servicio, [e.target.name]: e.target.value });
  };

  const agregarProducto = (e: React.FormEvent) => {
    e.preventDefault();
    if (servicio.codigo && servicio.descripcion) {
      setServicios([...servicios, { ...servicio, cantidad: 1, precio: 0 }]);
      setServicio({ codigo: "", descripcion: "" });
    }
  };

  return (
    <div className="p-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de la Factura */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 text-lg font-bold mb-4">Información de la Factura</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium">Factura N°</label>
              <input
                type="text"
                name="numero"
                value={factura.numero}
                onChange={handleFacturaChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={factura.fecha}
                onChange={handleFacturaChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Término</label>
              <select
                name="termino"
                value={factura.termino}
                onChange={handleFacturaChange}
                className="w-full border rounded p-2"
              >
                <option>Contado</option>
                <option>Crédito</option>
              </select>
            </div>
          </form>
        </div>

        {/* Datos del Cliente */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 text-lg font-bold mb-4">Datos del Cliente</h3>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium">RUC</label>
              <input
                type="text"
                name="ruc"
                value={cliente.ruc}
                onChange={handleClienteChange}
                className="w-full border rounded p-2"
                placeholder="Ingrese RUC"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nombre Cliente</label>
              <input
                type="text"
                name="nombre"
                value={cliente.nombre}
                onChange={handleClienteChange}
                className="w-full border rounded p-2"
                placeholder="Ingrese Nombre"
              />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-400">
              Guardar Cliente
            </button>
          </form>
        </div>

        {/* servicio o Servicio */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-blue-600 text-lg font-bold mb-4">Servicio</h3>
          <form onSubmit={agregarProducto}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Código</label>
              <input
                type="text"
                name="codigo"
                value={servicio.codigo}
                onChange={handleServicioChange}
                className="w-full border rounded p-2"
                placeholder="Ingrese el código"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={servicio.descripcion}
                onChange={handleServicioChange}
                className="w-full border rounded p-2"
                placeholder="Ingrese la descripción"
              />
            </div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-400">
              Agregar
            </button>
          </form>
        </div>
      </div>

      {/* Tabla de servicios */}
      <div className="mt-6">
        <h3 className="text-blue-600 text-lg font-bold mb-4">Listado de servicios</h3>
        <table className="table-auto w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th className="p-2">Código</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Cantidad</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map((prod, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{prod.codigo}</td>
                <td className="p-2">{prod.descripcion}</td>
                <td className="p-2">{prod.cantidad}</td>
                <td className="p-2">Gs. {prod.precio.toLocaleString()}</td>
                <td className="p-2">
                  <button className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-300 mr-2">
                    Editar
                  </button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-400">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-200">
              <td colSpan={3} className="p-2 font-bold">Total</td>
              <td className="p-2 font-bold">
                Gs. {servicios.reduce((acc, prod) => acc + prod.precio, 0).toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Facturacion;
