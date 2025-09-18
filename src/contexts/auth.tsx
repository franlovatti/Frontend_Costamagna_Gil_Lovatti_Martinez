import { createContext } from 'react';

export interface User {
  id: string;
  nombre?: string;
  apellido?: string;
  usuario: string;
  role: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (usuario: string, contraseña: string, remember: boolean) => Promise<boolean>;
  logout: () => void;
  registro: (nombre: string, apellido: string, usuario: string, contraseña: string, fechaNacimiento: string, email: string, remember: boolean) => Promise<boolean>;
  wasAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);