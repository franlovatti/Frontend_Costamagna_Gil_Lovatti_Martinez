import { createContext } from "react";
import type { User } from "./auth";
import type { Equipo, Partido, Participation } from "../types";

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  equipos: Equipo[];
  mvps: Partido[];
  maxAnotados: Partido[];
  participations: Participation[];
  equipocomocapitan: Equipo[];
}

type UsuarioContextType = {
  usuarios: User[];
  loading: boolean;
  error: string | null;
  getUsuarios: (opts?: { q?: string; page?: number }) => Promise<void>;
  filtrarUsuarios: (rol?: string, estado?: string) => Promise<void>;
  modificarUsuario: (usuario: User) => Promise<boolean>;
  clearError: () => void;
};

export const UsuarioContext = createContext<UsuarioContextType | null>(null);