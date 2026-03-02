import { createContext } from "react";
import type { Partido } from "./partido";

export interface Establecimiento {
  id: number;
  nombre: string;
  direccion: string;
  partidos: Partido[];
  evento: number;
  localidad: string;
}

export interface EstablecimientoContextType {
  establecimientos: Establecimiento[];
  establecimiento: Establecimiento | null;
  loading: boolean;
  error: string | null;
  getEstablecimientosTorneo: (id: number) => void;
  getUnEstablecimiento: (id: number) => void;
  borrarEstablecimiento: (id: number) => Promise<void>;
  modificarEstablecimiento: (establecimiento: Establecimiento) => Promise<void>;
  crearEstablecimiento: (establecimiento: Establecimiento) => Promise<void>;
}

export const EstablecimientoContext = createContext<EstablecimientoContextType | null>(null);