export interface ParticipacionPayload {
  usuario: number;
  minutosjugados: number;
  faltas: number;
  puntos: number;
  partido: number;
}

export interface ParticipacionEditPayload extends ParticipacionPayload {
  id: number;
}

export type Stats = {
  puntos: number;
  minutosjugados: number;
  faltas: number;
  equipo: number;
};
