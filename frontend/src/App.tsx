import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import Usuarios from "./pages/admin/Usuarios";
// import PrivateRoute from "./components/PrivateRoute";
import Login from "./auth/Login";
import EmpLayout from "./layouts/EmpLayout";
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
          <Route path="agencias" element={<div>Agencias</div>} />
          <Route path="encomiendas" element={<div>Encomiendas</div>} />
          <Route path="buses" element={<div>Buses</div>} />
          <Route path="rutas" element={<div>Rutas</div>} />
        </Route>

        <Route path="/empleado" element={<EmpLayout />}>

        </Route>
      </Routes>
    </Router>
  )
}

export default App
