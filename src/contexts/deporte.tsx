import { createContext } from "react";

export interface Deporte {
  id: number;
  nombre: string;
  cantMinJugadores: number;
  cantMaxJugadores: number;
  duracion: number;
}

export interface DeporteContextType {
  deportes: Deporte[];
  loading: boolean;
  error: string | null;
  getDeportes: () => void;
  borrarDeporte: (id: number) => Promise<void>;
  modificarDeporte: (deporte: Deporte) => Promise<void>;
  crearDeporte: (deporte: Deporte) => Promise<void>;
}

export const DeporteContext = createContext<DeporteContextType | null>(null);

