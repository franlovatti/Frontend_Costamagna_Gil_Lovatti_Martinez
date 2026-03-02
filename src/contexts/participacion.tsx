import { createContext } from 'react';
import type {
  ParticipacionEditPayload,
  ParticipacionPayload,
} from '../DTOs/participacionesDTO.tsx';
import type { User } from './auth';
import type { Partido } from './partido';

export interface Participacion {
  id: number;
  usuario: User;
  minutosjugados: number;
  faltas: number;
  puntos: number;
  partido: Partido;
}

export interface ParticipacionContextType {
  loading: boolean;
  error: string | null;
  getParticipacionesPartidoEquipo(
    partidoId: number,
    equipoId: number,
  ): Promise<Participacion[] | null>;
  getParticipacionesUsuarioTorneo(
    usuarioId: number,
    eventoId: number,
  ): Promise<Participacion[] | null>;
  getParticipacionesPorTorneo(
    eventoId: number,
  ): Promise<Participacion[] | null>;
  getParticipacionesPorUsuario(
    usuarioId: number,
  ): Promise<Participacion[] | null>;
  getParticipacionesTotalesPorTorneo(
    eventoId: number,
  ): Promise<Participacion[] | null>;
  crearParticipacion(payload: ParticipacionPayload): Promise<boolean>;
  editarParticipacion(payload: ParticipacionEditPayload): Promise<boolean>;
  borrarParticipacion(id: number): Promise<boolean>;
}

export const ParticipacionContext =
  createContext<ParticipacionContextType | null>(null);
