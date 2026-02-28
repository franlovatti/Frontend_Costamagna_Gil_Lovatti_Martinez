import {  useEffect, useState } from "react";
import type { Equipo, Partido, Torneo } from "../types";
import apiAxios from "../helpers/api";
import { AxiosError } from "axios";

export function useEquiposEvento(eventoId?: string) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [errorEquipos, setErrorEquipos] = useState<Error | null>(null);

   useEffect(() => {
    if (!eventoId) return;
    const fetchItems = async () => {
      setLoadingEquipos(true);
      setErrorEquipos(null);
      try {
        const response = await apiAxios.get(
          `/equipos/evento/${eventoId}`
        );
        setEquipos(response.data.data);
      } catch (err) {
        setErrorEquipos(err as Error);
      } finally {
        setLoadingEquipos(false);
      }
    };

    fetchItems();
  }, [eventoId]);

  return { equipos, loadingEquipos, errorEquipos };
}

type EquipoConTorneo = Equipo & { evento?: Torneo | null } & { partido?: Partido | null };

export function useMisEquipos(usuarioId: string) {
  const [equipos, setEquipos] = useState<EquipoConTorneo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [errorEquipos, setErrorEquipos] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) return;
    const fetchItems = async () => {
      setLoadingEquipos(true);
      setErrorEquipos(null);
      try {
        const response = await apiAxios.get<{ data: EquipoConTorneo[] }>(
          `/equipos/usuario/${usuarioId}`
        );
        setEquipos(response.data?.data ?? []);
      } catch (err) {
        const e = err as AxiosError<{ message: string }>;
        setErrorEquipos(e.response?.data?.message ?? e.message);
      } finally {
        setLoadingEquipos(false);
      }
    };
    fetchItems();
  }, [usuarioId]);

  return { equipos, loadingEquipos, errorEquipos };
}

export function useBorrarEquipo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const borrarEquipo = async (equipoId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiAxios.delete(`/equipos/${equipoId}`);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al borrar el equipo: " + (e.response?.data?.message || e.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { borrarEquipo, loading, error };
}

export function useInscribirseEquipo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inscribirseEquipo = async (equipo: Equipo, contraseña?: string, usuarioId?: number) => {
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, unknown> = { usuarioId: usuarioId };
      if (!equipo.esPublico) body.contraseña = contraseña;
      await apiAxios.post(`/equipos/${equipo.id}/miembros`, body);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al inscribirse en el equipo: " + (e.response?.data?.message || e.message));
      return false;
    } finally {      
      setLoading(false);
    }  };

  return { inscribirseEquipo, loading, error };
}