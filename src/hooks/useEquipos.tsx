import {  useEffect, useState } from "react";
import type { Equipo, Partido } from "../types";
import type { Torneo } from "../contexts/torneo";
import apiAxios from "../helpers/api";
import { AxiosError } from "axios";

export interface EquiposPayload {
  nombre: string;
  nombreCapitan?: string;
  capitan?: string;
  puntos?: number;
  esPublico: boolean;
  privado: boolean;
  contraseña?: string | null;
  miembros: string[] | { id: string }[];
  evento: number;
};

export interface EquiposPayloadEdit extends EquiposPayload {
  id: number;
}

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

export function useCrearEquipo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipo, setEquipo] = useState<Partial<Equipo>>({});

  const crearEquipo = async (equipo: EquiposPayload) => {
    setLoading(true);
    setError(null);
    setEquipo({});
    try {
      const res = await apiAxios.post(`/equipos`, equipo);
      setEquipo(res?.data?.data ?? {});
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al crear el equipo: " + (e.response?.data?.message || e.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { crearEquipo, loading, error, equipo };
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

export function useSalirEquipo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const salirEquipo = async (equipoId: number, usuarioId?: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiAxios.patch(`/equipos/${equipoId}/miembros`, { usuarioId });
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al salir del equipo: " + (e.response?.data?.message || e.message));
      return false;
    }
    finally {
      setLoading(false);
    }
  };

  return { salirEquipo, loading, error };
}

export function useObtenerEquipo(equipoId?: string) {
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEquipo = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiAxios.get(`/equipos/${id}`);
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setEquipo(payload as Equipo);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al cargar el equipo: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!equipoId) return;
    fetchEquipo(equipoId);
  }, [equipoId]);

  return { equipo, loading, error, refetch: () => equipoId && fetchEquipo(equipoId) };
}

export function useEditarEquipo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  const editarEquipo = async (equipoId: number, datos: { nombre?: string; contraseña?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {};
      if (datos.nombre) payload.nombre = datos.nombre;
      if (datos.contraseña) payload.contraseña = datos.contraseña;
      const res = await apiAxios.patch(`/equipos/${equipoId}`, payload);
      setEquipo(res.data.data as Equipo);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al guardar cambios: " + (e.response?.data?.message || e.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editarEquipo, loading, error, equipo };
}

export function useRemoverMiembroEquipo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipo, setEquipo] = useState<Equipo | null>(null);

  const removerMiembro = async (equipoId: number, usuarioId: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiAxios.patch(`/equipos/${equipoId}/miembros`, { usuarioId });
      setEquipo(res.data.data as Equipo);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al eliminar miembro: " + (e.response?.data?.message || e.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { removerMiembro, loading, error, equipo };
}