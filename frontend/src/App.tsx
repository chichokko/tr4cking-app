import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./index.css";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Usuarios from "./pages/admin/Usuarios";
// import PrivateRoute from "./components/PrivateRoute";
import Login from "./auth/Login";
import EmpLayout from "./layouts/EmpLayout";
import Buses from "./pages/admin/Buses";
import Empresas from "./pages/admin/Empresas";
import Localidades from "./pages/admin/Localidades";
import Rutas from "./pages/admin/Rutas";
import Horarios from "./pages/admin/Horarios";
import Pasajes from "./pages/admin/Pasajes";
import Clientes from "./pages/admin/Clientes";
import Empleados from "./pages/admin/Empleados";
import Viajes from "./pages/admin/Viajes";
import Encomiendas from "./pages/admin/Encomiendas/Encomiendas";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="rutas" element={<Rutas />} />
          <Route path="empresas" element={<Empresas />} />
          <Route path="localidades" element={<Localidades />} />
          <Route path="pasajes" element={<Pasajes />} />
          <Route path="buses" element={<Buses />} />
          <Route path="horarios" element={<Horarios />} />
          <Route path="viajes" element={<Viajes />} />
          <Route path="encomiendas" element={<Encomiendas />} />
        </Route>

        <Route path="/empleado" element={<EmpLayout />}>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
