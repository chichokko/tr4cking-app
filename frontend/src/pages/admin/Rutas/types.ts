export interface Localidad {
  id_localidad: number;
  nombre: string;
}

export interface Parada {
  id_parada: number;
  nombre: string;
  localidad_nombre: string;
}

export interface DetalleRuta {
  id_detalle: number;
  ruta: number;
  parada: number;
  parada_nombre: string;
  localidad_nombre: string;
  orden: number;
}

export interface Ruta {
  id_ruta: number;
  nombre: string;
  duracion_total: number;
  distancia_km: number;
  precio_base: number;
  activo: boolean;
  fecha_actualizacion?: string;
  detalles: DetalleRuta[];
}