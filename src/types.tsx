import type { Torneo } from "./contexts/torneo.tsx";
import type { Usuario } from "./contexts/usuario.tsx";

type Equipo = {
  id: number;
  nombre: string;
  nombreCapitan: string;
  capitan: Usuario;
  puntos: number;
  esPublico: boolean;
  contraseña: string;
  miembros: Usuario[];
  evento: Torneo;
  partidoVisitante: Partido[];
  partidoLocal: Partido[];
};

type Partido = {
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
};

type Participation = {
  id: number;
  usuario: Usuario;
  minutosjugados: number;
  faltas: number;
  puntos: number;
  partido: Partido;
};

type Establecimiento = {
  id: number;
  nombre: string;
  direccion: string;
  partidos: Partido[];
  evento: number;
  localidad: string;
};

type Stats = {
    puntos: number;
    minutosjugados: number;
    faltas: number;
    equipo: number;
  };

export type {
  Equipo,
  Partido,
  Participation,
  Establecimiento,
  Stats,
};
