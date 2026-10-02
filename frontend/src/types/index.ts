export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'admin' | 'usuario';
  createdAt?: string;
}

export interface Equipo {
  id: number;
  id_categoria?: number;
  nombre: string;
  marca?: string;
  modelo?: string;
  nro_serie?: string;
  estado_operativo: 'Disponible' | 'Solicitado' | 'Prestado' | 'Mantenimiento';
  nro_patrimonio?: string;
  observaciones?: string;
  propietario?: string;
  codigo?: string;
  patrimonio_unq?: boolean;
  imagen_url?: string;
  Categorium?: Categoria;
  createdAt?: string;
  updatedAt?: string;
}

export interface Prestamo {
  id: number;
  id_equipo: number;
  id_usuario: number;
  id_responsable_entrega?: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'entregado' | 'devuelto';
  fecha_solicitud?: string;
  fecha_entrega?: string;
  fecha_devolucion?: string;
  observaciones?: string;
  motivo_rechazo?: string;
  observaciones_devolucion?: string;
  solicitante?: Usuario;
  Equipo?: Equipo;
  responsable?: Usuario;
  createdAt?: string;
  updatedAt?: string;
}

export interface Mantenimiento {
  id: number;
  id_equipo: number;
  fecha_inicio: string;
  fecha_fin: string | null;
  descripcion_falla: string;
  responsable: string | null;
  repuestos: string | null;
  observaciones: string | null;
  estado: 'pendiente' | 'en_progreso' | 'completado';
  Equipo?: Equipo;
  createdAt?: string;
  updatedAt?: string;
}

export type CrearMantenimiento = Pick<Mantenimiento, 'id_equipo' | 'fecha_inicio' | 'descripcion_falla'> &
  Partial<Pick<Mantenimiento, 'fecha_fin' | 'responsable' | 'repuestos' | 'observaciones' | 'estado'>>;

export type ActualizarMantenimiento = Partial<Omit<CrearMantenimiento, 'id_equipo'>>;

export interface Categoria {
  id: number;
  nombre: string;
  descripcion_uso?: string;
  tipo_uso?: string;
  color?: string;
  icono?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthContextType {
  user: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
