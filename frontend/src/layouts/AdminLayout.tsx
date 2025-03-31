import { Outlet } from "react-router-dom";
//import AdminSidebar from "../components/AdminSidebar";
import HyperUISidebar from "../components/HyperUISidebar";

const AdminLayout = () => {
    return (
      <div className="flex-grow flex h-screen">
        <HyperUISidebar />
          <div className="flex-grow p-6 bg-gray-100 dark:bg-gray-900 overflow-auto h-full">
            <Outlet />
          </div>
      </div>
    );
  };
  
  export default AdminLayout;