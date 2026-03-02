import { EstablecimientoContext } from "../contexts/establecimiento.tsx";
import type { Establecimiento } from "../contexts/establecimiento.tsx";
import { AxiosError } from "axios";
import { useState, useCallback } from "react";
import apiAxios from "../helpers/api";

const EstablecimientoProvider = ({ children }: { children: React.ReactNode }) => {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [establecimiento, setEstablecimiento] = useState<Establecimiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEstablecimientosTorneo = useCallback(async (eventoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiAxios.get(`/establecimientos/evento/${eventoId}`);
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      setEstablecimientos(data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al recuperar establecimientos del torneo: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const getUnEstablecimiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiAxios.get(`/establecimientos/${id}`);
      setEstablecimiento(response.data.data);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al recuperar el establecimiento: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const crearEstablecimiento = useCallback(async (e: Omit<Establecimiento, 'id'>) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        nombre: e.nombre,
        direccion: e.direccion,
        eventoId: e.evento,
      };
      await apiAxios.post(`/establecimientos`, payload);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al crear el establecimiento: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const modificarEstablecimiento = useCallback(async (e: Establecimiento) => {
    setError(null);
    setLoading(true);
    try {
      const payload = {
        nombre: e.nombre,
        direccion: e.direccion,
        eventoId: e.evento,
      };
      await apiAxios.put(`/establecimientos/${e.id}`, payload);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al modificar el establecimiento: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  const borrarEstablecimiento = useCallback(async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      await apiAxios.delete(`/establecimientos/${id}`);
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al borrar el establecimiento: " + (e.response?.data?.message ?? e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <EstablecimientoContext.Provider value={{ establecimientos, establecimiento, loading, error, getEstablecimientosTorneo, getUnEstablecimiento, crearEstablecimiento, modificarEstablecimiento, borrarEstablecimiento }}>
      {children}
    </EstablecimientoContext.Provider>
  );
}

export default EstablecimientoProvider;