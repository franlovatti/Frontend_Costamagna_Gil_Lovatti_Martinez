export interface EquiposPayload {
  nombre: string;
  nombreCapitan?: string;
  capitan?: string;
  puntos?: number;
  esPublico: boolean;
  privado: boolean;
  contrasenia?: string | null;
  miembros: string[] | { id: string }[];
  evento: number;
}

export interface EquipoEditPayload {
  nombre: string;
  contrasenia: string;
}
