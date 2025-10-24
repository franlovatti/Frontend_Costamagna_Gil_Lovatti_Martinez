import { createContext } from "react";

export interface Localidad {
  id: number;
  lat: string;
  lng: string;
  descripcion: string;
  codigo: string;
}

interface LocalidadContextType {
  localidades: Localidad[];
  loading: boolean;
  error: string | null;
  getLocalidades: () => void;
  crearLocalidad: (localidad: Localidad) => Promise<void>;
  borrarLocalidad: (id: number) => void;
}


export const LocalidadContext = createContext<LocalidadContextType | null>(null);