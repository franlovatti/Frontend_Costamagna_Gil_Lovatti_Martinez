import { createContext } from "react";
import type { Deporte } from "./deporte";

export interface Torneo {
  id?: number;
  nombre: string;
  esPublico: boolean;
  contraseña?: string;
  cantEquiposMax: number;
  fechaInicioInscripcion: Date;
  fechaFinInscripcion: Date;
  fechaInicioEvento?: Date;
  fechaFinEvento?: Date;
  deporte: Deporte;
}

export interface TorneoContextType {
  torneos: Torneo[];
  loading: boolean;
  error: string | null;
  getTorneos: () => void;
  filtrarTorneos: (fechaDesde?: string, fechaHasta?: string, deporte?: string, modalidad?: string, equiposDesde?: number, equiposHasta?: number) => Promise<void>;
  borrarTorneo: (id: number) => Promise<void>;
  modificarTorneo: (torneo: Torneo) => Promise<void>;
  crearTorneo: (torneo: Torneo) => Promise<void>;
}

export const TorneoContext = createContext<TorneoContextType | null>(null);