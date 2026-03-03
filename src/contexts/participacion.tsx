import { createContext } from 'react';
import type {
  ParticipacionEditPayload,
  ParticipacionPayload,
} from '../DTOs/participacionesDTO.tsx';
import type { Usuario } from './usuario';
import type { Partido } from './partido';

export interface Participacion {
  id: number;
  usuario: Usuario;
  minutosjugados: number;
  faltas: number;
  puntos: number;
  partido: Partido;
}

export interface ParticipacionContextType {
  loading: boolean;
  error: string | null;
  participaciones: Participacion[];
  getParticipacionesPartidoEquipo(
    partidoId: number,
    equipoId: number,
  ): Promise<void>;
  getParticipacionesUsuarioTorneo(
    usuarioId: number,
    eventoId: number,
  ): Promise<void>;
  getParticipacionesPorTorneo(eventoId: number): Promise<void>;
  getParticipacionesPorUsuario(usuarioId: number): Promise<void>;
  getParticipacionesTotalesPorTorneo(eventoId: number): Promise<void>;
  crearParticipacion(payload: ParticipacionPayload): Promise<boolean>;
  editarParticipacion(payload: ParticipacionEditPayload): Promise<boolean>;
  borrarParticipacion(id: number): Promise<boolean>;
}

export const ParticipacionContext =
  createContext<ParticipacionContextType | null>(null);
