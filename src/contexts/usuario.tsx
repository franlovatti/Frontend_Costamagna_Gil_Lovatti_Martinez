import { createContext } from 'react';
import type { User } from './auth';
import type { Partido } from './partido';
import type { Equipo } from './equipo';
import type { Participacion } from './participacion';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  equipos: Equipo[];
  mvps: Partido[];
  maxAnotados: Partido[];
  participations: Participacion[];
  equipocomocapitan: Equipo[];
}

type UsuarioContextType = {
  usuarios: User[] | Usuario[];
  loading: boolean;
  error: string | null;
  getUsuarios: (opts?: { q?: string; page?: number }) => Promise<void>;
  filtrarUsuarios: (rol?: string, estado?: string) => Promise<void>;
  modificarUsuario: (usuario: User) => Promise<boolean>;
  clearError: () => void;
  getUsuariosEvento: (eventoId: number) => Promise<Usuario[] | null>;
};

export const UsuarioContext = createContext<UsuarioContextType | null>(null);
