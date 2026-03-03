export interface DeporteConEventos {
  deporteId: number;
  deporte: string;
  totalEventos: number;
}

export interface Stats {
  totalUsers: number;
  deportes: number;
  eventos: number;
  [key: string]: number;
  publicos: number;
  activeUsers: number;
  activeEventos: number;
  partidosJugados: number;
  partidosPorJugar: number;
}
