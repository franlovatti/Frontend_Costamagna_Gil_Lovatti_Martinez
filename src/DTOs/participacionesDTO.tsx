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
