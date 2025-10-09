type Torneo = {
  id: number;
  nombre: string;
  deporte: string;
  descripcion: string;
  fechaInicioInscripcion: string;
  fechaFinInscripcion: string;
  fechaInicioTorneo: string;
  fechaFinTorneo: string;
  ubicacion: string;
  privado: boolean;
  cantidadEquipos: number;
  img: string;
  equipos?: Equipo[];
};

type Deporte = {
  id: number;
  nombre: string;
};

type Equipo = {
  id: number;
  nombre: string;
  nombreCapitan: string;
  puntos: number;
  privado: boolean;
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
};

type Participation = {
  id: number;
  usuario: Usuario;
  minutosJugados: number;
  faltas: number;
  partido: Partido;
};

type Establecimiento = {
  id: number;
  nombre: string;
  direccion: string;
  partidos: Partido[];
  evento: number;
};
type Noticia = {
  id: number;
  titulo: string;
  contenido: string;
  fechaPublicacion: string;
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
};
