import axios from 'axios';
import { Ruta, DetalleRuta, Parada } from './types';

const BASE_URL = "http://127.0.0.1:8000/api";

export const rutasApi = {
  // Rutas
  getRutas: () => 
    axios.get<Ruta[]>(`${BASE_URL}/rutas/`),
  
  createRuta: (ruta: Omit<Ruta, 'id_ruta'>) => 
    axios.post<Ruta>(`${BASE_URL}/rutas/`, ruta),
  
  updateRuta: (id: number, ruta: Partial<Ruta>) => 
    axios.put<Ruta>(`${BASE_URL}/rutas/${id}/`, ruta),
  
  deleteRuta: (id: number) => 
    axios.delete(`${BASE_URL}/rutas/${id}/`),

  // Paradas
  getParadas: () => 
    axios.get<Parada[]>(`${BASE_URL}/paradas/`),

  // Detalles de Ruta
  getDetalles: (rutaId: number) => 
    axios.get<DetalleRuta[]>(`${BASE_URL}/detalle-rutas/?ruta=${rutaId}`),
  
  createDetalle: (detalle: Omit<DetalleRuta, 'id'>) => 
    axios.post<DetalleRuta>(`${BASE_URL}/detalle-rutas/`, detalle),
  
  updateDetalle: (id: number, detalle: Partial<DetalleRuta>) => 
    axios.patch<DetalleRuta>(`${BASE_URL}/detalle-rutas/${id}/`, detalle),
  
  deleteDetalle: (id: number) => 
    axios.delete(`${BASE_URL}/detalle-rutas/${id}/`),

  // Localidades
  getLocalidades: () => 
    axios.get(`${BASE_URL}/localidades/`)
};

// Interceptor para manejar errores
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);