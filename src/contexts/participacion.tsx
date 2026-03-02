import type { User } from "./auth";
import type { Partido } from "./partido";

export interface Participacion{
    id: number;
    usuario: User;
    minutosjugados: number;
    faltas: number;
    puntos: number;
    partido: Partido;
}