type Torneo = {
  id: number;
  nombre: string;
  deporte: Deporte;
  descripcion: string;
  fechaInicioInscripcion: string;
  fechaFinInscripcion: string;
  fechaInicioEvento: string;
  fechaFinEvento: string;
  localidad: Localidad;
  privado: boolean;
  cantEquiposMax: number;
  img: string;
  equipos?: Equipo[];
  creador: number;
  partidos?: Partido[];
};

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
  capitan: number | Usuario;
  puntos: number;
  esPublico: boolean;
  contraseña: string;
  miembros: Usuario[];
  evento: Torneo | number;
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
  hora: Date;
  establecimiento?: Establecimiento;
  participations?: Participation[];
  resultado: string;
  juez: string;
};

type Usuario = {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  usuario: string;
  equipos: Equipo[];
  mvps: Partido[];
  maxAnotados: Partido[];
  participations: Participation[];
  equipocomocapitan: Equipo[];
};

type Participation = {
  id: number;
  usuario: Usuario;
  minutosjugados: number;
  faltas: number;
  puntos: number; // Added property
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
type Noticia = {
  id: number;
  titulo: string;
  fecha: string;
  descripcion: string;
};

type Localidad = {
  id: number;
  nombre: string;
  descripcion: string;
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
};
