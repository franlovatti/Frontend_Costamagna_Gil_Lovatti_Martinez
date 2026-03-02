

type Deporte = {
  id: number;
  nombre: string;
  cantMaxJugadores: number;
  cantMinJugadores: number;
};

type Equipo = {
  id: number;
  nombre: string;
  nombreCapitan: string;
  capitan: Usuario;
  puntos: number;
  esPublico: boolean;
  constrasenia: string;
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



type Stats = {
    puntos: number;
    minutosjugados: number;
    faltas: number;
    equipo: number;
  };

export type {
  Torneo,
  Deporte,
  Equipo,
  Partido,
  Usuario,
  Participation,
  Establecimiento,
  Noticia,
  Localidad,
  Stats,
};
