import { useState, useCallback  } from "react";
import { EquipoContext } from "../contexts/equipo.tsx";
import apiAxios from "../helpers/api";
import type { Equipo } from "../contexts/equipo.tsx";
import { AxiosError } from "axios";

const EquipoProvider = ({ children }: { children: React.ReactNode }) => {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEquiposEvento = useCallback(async (eventoId: number) => {
    setLoading(true);
    setError(null);
    try {
        const response = await apiAxios.get(`/equipos/evento/${eventoId}`);
        const data = Array.isArray(response.data.data) ? response.data.data : [];
        setEquipos(data);
    } catch (err) {
        const e = err as AxiosError<{ message: string }>;
        setError("Error al recuperar equipos del evento: " + (e.response?.data?.message ?? e.message));
    } finally {
        setLoading(false);
    }
  }, []);

  const getMisEquipos = useCallback(async (usuarioId: string) => {
    setLoading(true);
    setError(null);
    try {
        const response = await apiAxios.get(`/equipos/usuario/${usuarioId}`);
        const data = Array.isArray(response.data.data) ? response.data.data : [] ;
        setEquipos(data);
    } catch (err) {
        const e = err as AxiosError<{ message: string }>;
        setError("Error al recuperar mis equipos: " + (e.response?.data?.message ?? e.message));
    } finally {
        setLoading(false);
    }
  }, []);

  const getUnEquipo = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
        const response = await apiAxios.get(`/equipos/${id}`);
        setEquipo(response.data.data);
    } catch (err) {
        const e = err as AxiosError<{ message: string }>;
        setError("Error al recuperar el equipo: " + (e.response?.data?.message ?? e.message));
    } finally {
        setLoading(false);
    }
  }, []);

  const inscribirseAEquipo = useCallback(async (equipo: Equipo, usuarioId: string, contraseña?: string) => {
    setError(null);
    setLoading(true);
    try {
      const body: Record<string, unknown> = { usuarioId: usuarioId };
      if (!equipo.esPublico) body.contraseña = contraseña;
      await apiAxios.post(`/equipos/${equipo.id}/miembros`, body);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al inscribirse en el equipo: " + (e.response?.data?.message ?? e.message));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const salirDeEquipo = useCallback(async (equipoId: number, usuarioId?: string) => {
    setError(null);
    setLoading(true);
    try {
      await apiAxios.patch(`/equipos/${equipoId}/miembros`, { usuarioId });
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al salir del equipo: " + (e.response?.data?.message ?? e.message));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removerMiembro = useCallback(async (equipoId: number, usuarioId: string) => {
    setError(null);
    setLoading(true);
    try {
      await apiAxios.patch(`/equipos/${equipoId}/miembros`, { usuarioId });
      getUnEquipo(equipoId);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al remover el miembro del equipo: " + (e.response?.data?.message ?? e.message));
      return false;
    } finally {
      setLoading(false);
    }
  }, [getUnEquipo]);

  const borrarEquipo = useCallback(async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      await apiAxios.delete(`/equipos/${id}`);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al borrar el equipo: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const modificarEquipo = useCallback(async (e: Equipo) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        nombre: e.nombre,
        nombreCapitan: e.nombreCapitan,
        puntos: e.puntos,
        esPublico: e.esPublico,
        contraseña: e.contraseña,
      };
      await apiAxios.put(`/equipos/${e.id}`, payload);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al modificar el equipo: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const crearEquipo = useCallback(async (e: Omit<Equipo, 'id'>) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        nombre: e.nombre,
        nombreCapitan: e.nombreCapitan,
        capitan: e.capitan.id,
        esPublico: e.esPublico,
        privado: !e.esPublico,
        puntos: e.puntos,
        contraseña: e.contraseña,
        miembros: e.miembros.map(m => m.id),
        evento: e.evento.id,
      };

      await apiAxios.post(`/equipos`, payload);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al crear el equipo: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EquipoContext.Provider value={{ equipos, equipo, loading, error, getEquiposEvento, getMisEquipos, getUnEquipo, inscribirseAEquipo, salirDeEquipo, removerMiembro, borrarEquipo, modificarEquipo, crearEquipo }}>
      {children}
    </EquipoContext.Provider>
  );
}

export default EquipoProvider;