import { Link } from "react-router-dom";
import { Users, Bus, Route, ReceiptText, HandHelping, LogOut } from "lucide-react";

const AdminSidebar = () => {
  const menuItems = [
    { title: "Usuarios", path: "/admin/usuarios", icon: <Users className="size-5 opacity-75" /> },
    { title: "Servicios", path: "/admin/servicios", icon: <HandHelping className="size-5 opacity-75" /> },
    { title: "Buses", path: "/admin/buses", icon: <Bus className="size-5 opacity-75" /> },
    { title: "Rutas", path: "/admin/rutas", icon: <Route className="size-5 opacity-75" /> },
    { title: "Ventas", path: "/admin/facturacion", icon: <ReceiptText className="size-5 opacity-75" /> },
  ];

  return (
      <div className="hidden lg:flex h-screen w-16 flex-col justify-between border-e bg-white dark:bg-gray-800 dark:border-gray-700">
        <div>
          <div className="inline-flex size-16 items-center justify-center">
            <span className="grid size-10 place-content-center rounded-lg">
              <img src="../src/assets/react.svg" alt="logo" />
            </span>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700">
            <div className="px-2">
              <ul className="space-y-1 pt-4">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="group relative flex justify-center rounded-sm px-2 py-1.5 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
                    >
                      {item.icon}
                      <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-2">
          <Link
            to="/logout"
            className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white"
          >
            <LogOut className="size-5 opacity-75" />
            <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded-sm bg-gray-900 dark:bg-gray-700 px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
              Logout
            </span>
          </Link>
        </div>
      </div>
  );
};

export default AdminSidebar;