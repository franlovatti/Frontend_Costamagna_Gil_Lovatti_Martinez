import type { Partido } from './partido';
import type { User } from './auth.tsx';
import type { Torneo } from './torneo';
import type { EquiposPayload, EquipoEditPayload } from '../DTOs/equipoDTO.tsx';
import { createContext } from 'react';

export interface Equipo {
  id: number;
  nombre: string;
  nombreCapitan: string;
  capitan: User;
  puntos: number;
  esPublico: boolean;
  constrasenia: string;
  miembros: User[];
  evento: Torneo;
  partidoVisitante: Partido[];
  partidoLocal: Partido[];
}

export interface EquipoContextType {
  Equipos: Equipo[];
  loading: boolean;
  error: string | null;
  getEquiposEvento: (eventoId: number) => Promise<void>;
  getMisEquipos: (usuarioId: number) => Promise<void>;
  borrarEquipo: (equipoId: number) => Promise<void>;
  crearEquipo: (payload: EquiposPayload) => Promise<Equipo | null>;
  inscribirseEquipo: (
    equipo: Equipo,
    contrseña: string,
    usuarioId: number,
  ) => Promise<boolean>;
  salirEquipo: (equipoId: number, usuarioId: number) => Promise<boolean>;
  obtenerEquipo: (equipoId: number) => Promise<Equipo>;
  editarEquipo: (
    equipoId: number,
    payload: EquipoEditPayload,
  ) => Promise<Equipo | null>;
  removerMiembro: (
    equipoId: number,
    usuarioId: number,
  ) => Promise<Equipo | null>;
}

export const EquipoContext = createContext<EquipoContextType | null>(null);
