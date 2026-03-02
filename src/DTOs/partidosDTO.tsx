
export type PartidoPayload = {
  id?: number;
  fecha: string;
  hora: string;
  juez: string;
  resultadoLocal: number | null;
  resultadoVisitante: number | null;
  equipoLocal: number;
  equipoVisitante: number;
  evento: number;
  establecimiento: number | null;
};

export type resultadosDto ={
    partidoId: number,
    resultadoLocal: string,
    resultadoVisitante: string
}