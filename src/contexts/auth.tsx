import { createContext } from 'react';

export interface User {
  id: string;
  nombre?: string;
  apellido?: string;
  usuario: string;
  email: string;
  role: string;
  estado: boolean;
  fechaNacimiento?: Date;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  login: (
    usuario: string,
    contraseña: string,
    remember: boolean,
  ) => Promise<boolean>;
  logout: () => void;
  registro: (
    nombre: string,
    apellido: string,
    usuario: string,
    contraseña: string,
    fechaNacimiento: string,
    email: string,
    remember: boolean,
  ) => Promise<boolean>;
  bajaUsuario: (id: string) => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
