import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';
import Reservas from './components/Reservas/Reservas';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            <div>
              <h1>Home</h1>
            </div>
          } />
          <Route path="reservar" element={<Reservas />} />
          <Route path="encomiendas" element={
            <div>
              <h1>Consultar Encomiendas</h1>
            </div>
          } />
        </Route>
      </Routes>
    </Router>
  )
}

export default App