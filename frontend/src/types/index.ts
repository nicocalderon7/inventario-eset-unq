export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  createdAt?: string;
}

export interface Equipo {
  id: number;
  nombre: string;
  categoria: string;
  estado: 'disponible' | 'prestado' | 'mantenimiento';
  numero_serie: string;
  observaciones?: string;
  createdAt?: string;
}

export interface Prestamo {
  id: number;
  id_equipo: number;
  id_usuario: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado' | 'entregado' | 'devuelto';
  fecha_prestamo?: string;
  fecha_devolucion?: string;
  observaciones?: string;
  equipo?: Equipo;
  usuario?: Usuario;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
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