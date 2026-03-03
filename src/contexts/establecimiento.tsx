import { createContext } from 'react';
import type { Equipo } from '../types';
import type { Torneo } from '../contexts/torneo.tsx';
import type { EstablecimientoPayloadEdicion } from '../DTOs/establecimientosDTO.tsx';

export interface Establecimiento {
  id: number;
  nombre: string;
  direccion: string;
  partidos: Equipo[];
  evento: Torneo;
  localidad: number;
}

export interface EstablecimientoContextType {
  establecimientos: Establecimiento[];
  loading: boolean;
  error: string | null;
  getEstablecimientos: (eventoId: number) => void;
  crearEstablecimiento: (
    payload: EstablecimientoPayloadEdicion,
  ) => Promise<Establecimiento | null>;
  deleteEstablecimiento: (id: number) => Promise<boolean>;
  getOneEstablecimiento: (id: number) => Promise<Establecimiento | null>;
  editarEstablecimiento: (
    id: number,
    payload: EstablecimientoPayloadEdicion,
  ) => Promise<Establecimiento | null>;
}

export const EstablecimientoContext =
  createContext<EstablecimientoContextType | null>(null);
