import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import type { Establecimiento } from '../types';

type EstablecimientoPayload = {
  nombre: string;
  direccion: string;
  evento: string | number;
};

export function useEstablecimientosEvento(eventoId?: string) {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>(
    []
  );
  const [loadingEstablecimientos, setLoadingEstablecimientos] = useState(false);
  const [errorEstablecimientos, setErrorEstablecimientos] =
    useState<Error | null>(null);

  useEffect(() => {
    if (!eventoId) return;
    const fetchData = async () => {
      setLoadingEstablecimientos(true);
      setErrorEstablecimientos(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/establecimientos/evento/${eventoId}`
        );
        setEstablecimientos(response.data.data);
      } catch (err) {
        setErrorEstablecimientos(err as Error);
      } finally {
        setLoadingEstablecimientos(false);
      }
    };

    fetchData();
  }, [eventoId]);

  const deleteEstablecimiento = async (establecimientoId?: string | number) => {
    setLoadingEstablecimientos(true);
    setErrorEstablecimientos(null);
    try {
      await axios.delete(
        `http://localhost:3000/api/establecimientos/${establecimientoId}`
      );
      setEstablecimientos((prev) =>
        prev.filter((e) => e.id !== Number(establecimientoId))
      );
    } catch (err) {
      setErrorEstablecimientos(err as Error);
    } finally {
      setLoadingEstablecimientos(false);
    }
  };

  return {
    establecimientos,
    loadingEstablecimientos,
    errorEstablecimientos,
    deleteEstablecimiento,
  };
}

export function useOneEstablecimiento(establecimientoId?: string) {
  const [establecimiento, setestablecimiento] = useState<Establecimiento>();
  const [loadingEstablecimiento, setLoadingEstablecimiento] = useState(false);
  const [errorEstablecimiento, setErrorEstablecimiento] =
    useState<Error | null>(null);

  useEffect(() => {
    if (!establecimientoId) return;

    const fetchData = async () => {
      setLoadingEstablecimiento(true);
      setErrorEstablecimiento(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/establecimientos/${establecimientoId}`
        );
        setestablecimiento(response.data.data);
      } catch (err) {
        setErrorEstablecimiento(err as Error);
      } finally {
        setLoadingEstablecimiento(false);
      }
    };

    fetchData();
  }, [establecimientoId]);

  return {
    establecimiento,
    loadingEstablecimiento,
    errorEstablecimiento,
    setestablecimiento,
    setLoadingEstablecimiento,
    setErrorEstablecimiento,
  };
}

export function useCrearEstablecimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearEstablecimiento = async (payload: EstablecimientoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/establecimientos', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || e.message || 'Error al crear el establecimiento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { crearEstablecimiento, loading, error };
}

export function useEditarEstablecimiento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarEstablecimiento = async (establecimientoId: string, payload: EstablecimientoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:3000/api/establecimientos/${establecimientoId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || e.message || 'Error al editar el establecimiento');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editarEstablecimiento, loading, error };
}
