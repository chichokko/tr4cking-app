import { Link } from "react-router-dom";
import { Users, Package, Bus, Route, FileText } from "lucide-react";

const AdminSidebar = () => {
  const menuItems = [
    { title: "Usuarios", path: "/admin/usuarios", icon: <Users size={20} /> },
    { title: "Encomiendas", path: "/admin/encomiendas", icon: <Package size={20} /> },
    { title: "Buses", path: "/admin/buses", icon: <Bus size={20} /> },
    { title: "Rutas", path: "/admin/rutas", icon: <Route size={20} /> },
    { title: "Facturación", path: "/admin/facturacion", icon: <FileText size={20} /> },
  ];

  return (
    <>
      {/* Menú móvil inferior */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-blue-700 dark:bg-gray-800 text-white shadow-lg z-50">
        <nav className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center text-sm hover:text-yellow-300"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Sidebar flotante para desktop */}
      <div className="hidden lg:block fixed top-0 left-0 h-full bg-blue-700 dark:bg-gray-800 text-white w-64 shadow-lg z-50">
        <h2 className="font-bold text-center text-2xl p-6 border-b border-blue-600">
          <Link to="/admin">Tr4cking</Link>
        </h2>
        <nav className="mt-4">
          <ul className="space-y-3 m-4 px-4">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center p-2 hover:bg-blue-600 rounded-lg transition-colors duration-200"
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default AdminSidebar;