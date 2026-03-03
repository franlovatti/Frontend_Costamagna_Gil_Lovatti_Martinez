import { createContext } from 'react';
import type { Deporte } from './deporte';
import type { Localidad } from './localidad.tsx';
import type { Equipo } from './equipo.tsx';
import type { Partido } from './partido.tsx';

export interface Torneo {
  id?: number;
  nombre: string;
  deporte: Deporte;
  fechaInicioInscripcion: Date;
  fechaFinInscripcion: Date;
  fechaInicioEvento?: Date;
  fechaFinEvento?: Date;
  localidad: Localidad;
  esPublico: boolean;
  cantEquiposMax: number;
  equipos?: Equipo[];
  creador: number;
  partidos?: Partido[];
  codigo?: string;
  contraseña?: string;
  descripcion?: string;
  img?: string;
}

export interface TorneoContextType {
  torneos: Torneo[];
  torneo: Torneo | null;
  torneosCreados: Torneo[];
  torneosInscripto: Torneo[];
  loading: boolean;
  error: string | null;
  getTorneos: () => void;
  getUnTorneo: (id: number) => Promise<void>;
  filtrarTorneos: (
    fechaDesde?: string,
    fechaHasta?: string,
    deporte?: string,
    modalidad?: string,
    equiposDesde?: number,
    equiposHasta?: number,
  ) => Promise<void>;
  borrarTorneo: (id: number) => Promise<void>;
  modificarTorneo: (torneo: Torneo) => Promise<void>;
  crearTorneo: (torneo: Torneo) => Promise<void>;
  getTorneosCreadosPorUsuario: (id: number) => Promise<void>;
  getTorneosInscriptoPorUsuario: (id: number) => Promise<void>;
  getTorneoPorCodigo: (codigo: string) => Promise<void>;
}

export const TorneoContext = createContext<TorneoContextType | null>(null);
