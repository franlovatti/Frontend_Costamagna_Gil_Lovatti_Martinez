import type { Establecimiento } from './establecimiento';
import type { Torneo } from './torneo';
import type { Equipo } from './equipo';
import type { User } from './auth.tsx';
import type { Participacion } from './participacion.tsx';
import { createContext } from 'react';
import type { PartidoPayload, resultadosDto } from '../DTOs/partidosDTO.tsx';

export interface Partido {
  id: number;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  mvp?: User;
  maxAnotador?: User;
  evento: Torneo;
  fecha: Date;
  hora: string;
  establecimiento?: Establecimiento;
  participations?: Participacion[];
  resultadoLocal: number | null;
  resultadoVisitante: number | null;
  juez: string;
}

export interface PartidoContextType {
  partidos: Partido[];
  loading: boolean;
  error: string | null;
  getPartidosEvento: (eventoId: number) => void;
  getOnePartido: (partidoId: number) => Promise<Partido | null>;
  borrarPartido: (partidoId: number) => Promise<Partido | null>;
  cargarResultado: (resultado: resultadosDto) => Promise<Partido | null>;
  crearPartido: (payload: PartidoPayload) => Promise<Partido | null>;
  editarPartido: (
    partidoId: number,
    payload: PartidoPayload,
  ) => Promise<Partido | null>;
}

export const PartidoContext = createContext<PartidoContextType | null>(null);
