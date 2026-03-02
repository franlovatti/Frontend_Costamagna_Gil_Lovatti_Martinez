import { createContext } from "react";
import type { Partido } from "./partido";
import type { Usuario } from "./usuario";
import type { Torneo } from "./torneo";

export interface Equipo {
  id: number;
  nombre: string;
  nombreCapitan: string;
  capitan: Usuario;
  puntos: number;
  esPublico: boolean;
  contraseña: string;
  miembros: Usuario[];
  evento: Torneo;
  partidoVisitante: Partido[];
  partidoLocal: Partido[];
}

export interface EquipoContextType {
  equipos: Equipo[];
  equipo: Equipo | null;
  loading: boolean;
  error: string | null;
  getEquiposEvento: (eventoId: number) => void;
  getUnEquipo: (id: number) => void;
  getMisEquipos: (usuarioId: string) => void;
  inscribirseAEquipo: (equipo: Equipo, usuarioId: string, contraseña?: string) => Promise<boolean>;
  salirDeEquipo: (equipoId: number, usuarioId?: string) => Promise<boolean>;
  removerMiembro: (equipoId: number, usuarioId: string) => Promise<boolean>;
  borrarEquipo: (id: number) => Promise<void>;
  modificarEquipo: (equipo: Equipo) => Promise<void>;
  crearEquipo: (equipo: Omit<Equipo, 'id'>) => Promise<void>;
}

export const EquipoContext = createContext<EquipoContextType | null>(null);