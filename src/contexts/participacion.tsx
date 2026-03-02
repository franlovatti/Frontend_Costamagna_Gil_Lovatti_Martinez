import { createContext } from "react";
import type { Partido } from "./partido";
import type { Usuario } from "./usuario";

export interface Participation {
  id: number;
  usuario: Usuario;
  minutosjugados: number;
  faltas: number;
  puntos: number;
  partido: Partido;
}

export interface ParticipationContextType {
  participaciones: Participation[];
  participacion: Participation | null;
  loading: boolean;
  error: string | null;
  getParticipaciones: (partidoId: string, equipoId: string) => void;
  getParticipacionesPorUsuarioEnTorneo: (usuarioId: string, eventoId: string) => void;
  getParticipacionesPorTorneo: (eventoId: string) => void;
  getParticipacionesPorUsuario: (usuarioId: string) => void;
  getParticipacionesEquipo: (equipoId: string, partidoId: string) => void;
  crearParticipacion: (participacion: Omit<Participation, 'id'>) => Promise<void>;
  modificarParticipacion: (participacion: Participation) => Promise<void>;
  borrarParticipacion: (id: number) => Promise<void>;
}

export const ParticipationContext = createContext<ParticipationContextType | null>(null);