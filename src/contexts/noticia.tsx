import { createContext } from 'react';

export interface Noticia {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
}

export interface NoticiaContextType {
  noticias: Noticia[];
  loading: boolean;
  error: string | null;
  getNoticias: () => void;
  filtrarNoticias: (fechaDesde?: string, fechaHasta?: string) => Promise<void>;
  borrarNoticia: (id: number) => Promise<void>;
  modificarNoticia: (noticia: Noticia) => Promise<void>;
  crearNoticia: (noticia: Noticia) => Promise<void>;
}

export const NoticiaContext = createContext<NoticiaContextType | null>(null);