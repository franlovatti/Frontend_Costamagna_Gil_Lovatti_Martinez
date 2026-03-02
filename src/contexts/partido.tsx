import { createContext } from "react";
import type { Equipo } from "./equipo";
import type { Establecimiento } from "./establecimiento";
import type { Participation } from "./participacion";
import type { Torneo } from "./torneo";
import type { Usuario } from "./usuario";

export interface Partido {
  id: number;
  equipoLocal: Equipo;
  equipoVisitante: Equipo;
  mvp?: Usuario;
  maxAnotador?: Usuario;
  evento: Torneo;
  fecha: Date;
  hora: string;
  establecimiento?: Establecimiento;
  participations?: Participation[];
  resultadoLocal: number | null;
  resultadoVisitante: number | null;
  juez: string;
}

export interface PartidoContextType {
  partidos: Partido[];
  partido: Partido | null;
  loading: boolean;
  error: string | null;
  getPartidos: () => void;
  getPartidosEvento: (eventoId: number) => void;
  getUnPartido: (id: number) => void;
  borrarPartido: (id: number) => Promise<void>;
  modificarPartido: (partido: Partido) => Promise<void>;
  crearPartido: (partido: Partido) => Promise<void>;
}

export const PartidoContext = createContext<PartidoContextType | null>(null);