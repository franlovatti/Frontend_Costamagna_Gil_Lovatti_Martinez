import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import type { Partido } from '../contexts/partido.tsx';
import { PartidoContext } from '../contexts/partido.tsx';
import { AxiosError } from 'axios';

type PartidoPayload = {
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

export function usePartidos() {
  const context = useContext(PartidoContext);
    if (!context) {
      throw new Error('usePartidos must be used within an PartidoProvider');
    }
    return context;
  }

export function usePartidosEvento(eventoId?: string) {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loadingPartidos, setLoadingPartidos] = useState(false);
  const [errorPartidos, setErrorPartidos] = useState<Error | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoadingPartidos(true);
      try {
        const response = await axios.get(
          'http://localhost:3000/api/partidos/evento/' + eventoId
        );
        setPartidos(response.data.data);
      } catch (err) {
        setErrorPartidos(err as Error);
      } finally {
        setLoadingPartidos(false);
      }
    };

    fetchItems();
  }, [eventoId]);

  return { partidos, loadingPartidos, errorPartidos };
}

export function useOnePartido(partidoId?: string) {
  const [partido, setPartido] = useState<Partido>();
  const [loadingPartido, setLoadingPartido] = useState(false);
  const [errorPartido, setErrorPartido] = useState<Error | null>(null);

  useEffect(() => {
    if (!partidoId) return;

    const fetchData = async () => {
      setLoadingPartido(true);
      setErrorPartido(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/partidos/${partidoId}`
        );
        setPartido(response.data.data);
      } catch (err) {
        setErrorPartido(err as Error);
      } finally {
        setLoadingPartido(false);
      }
    };

    fetchData();
  }, [partidoId]);

  return {
    partido,
    loadingPartido,
    errorPartido,
    setPartido,
    setLoadingPartido,
    setErrorPartido,
  };
}

export function useBorrarPartido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const borrarPartido = async (partidoId: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/partidos/${partidoId}`);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al borrar el partido: " + (e.response?.data?.message || e.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { borrarPartido, loading, error };
}

export function useCargarResultados() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarResultados = async (
    partidoId: number,
    resultadoLocal: string,
    resultadoVisitante: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(`/partidos/${partidoId}`, {
        resultadoLocal: resultadoLocal === '' ? null : Number(resultadoLocal),
        resultadoVisitante:
          resultadoVisitante === '' ? null : Number(resultadoVisitante),
      });
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(
        "Error al cargar resultado: " +
          (e.response?.data?.message || e.message)
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { cargarResultados, loading, error };
}

export function useCrearPartido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const crearPartido = async (payload: PartidoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/partidos', payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || e.message || 'Error al crear el partido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { crearPartido, loading, error };
}

export function useEditarPartido() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editarPartido = async (partidoId: number, payload: PartidoPayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(`http://localhost:3000/api/partidos/${partidoId}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError(e.response?.data?.message || e.message || 'Error al editar el partido');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { editarPartido, loading, error };
}