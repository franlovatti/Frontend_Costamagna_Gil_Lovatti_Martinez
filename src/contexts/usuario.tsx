import { createContext } from "react";
import type { User } from "./auth";

type UsuarioContextType = {
  usuarios: User[];
  loading: boolean;
  error: string | null;
  getUsuarios: (opts?: { q?: string; page?: number }) => Promise<void>;
  filtrarUsuarios: (rol?: string, estado?: string) => Promise<void>;
  modificarUsuario: (usuario: User) => Promise<void>;
};

export const UsuarioContext = createContext<UsuarioContextType | null>(null);