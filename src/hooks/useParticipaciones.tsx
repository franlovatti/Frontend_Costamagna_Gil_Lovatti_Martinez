import { useState, useEffect, useCallback, useContext } from 'react';
import apiAxios from '../helpers/api';
import { ParticipationContext, type Participation } from '../contexts/participacion.tsx';
import { AxiosError } from 'axios';

// Tipos para los payloads
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

export function useParticipacion(){
  const context = useContext(ParticipationContext);
    if (!context) {
      throw new Error('useParticipacion must be used within an ParticipationProvider');
    }
    return context;
}

export function useParticipaciones(partidoId: string, equipoId: string) {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipaciones = useCallback(async () => {
    if (!partidoId || !equipoId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get(
        '/participaciones/participacionesxequipo',
        {
          params: { partidoId, equipoid: equipoId },
        },
      );
      setParticipaciones(response.data.data);
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to fetch participations.');
    } finally {
      setLoading(false);
    }
  }, [partidoId, equipoId]);

  useEffect(() => {
    fetchParticipaciones();
  }, [fetchParticipaciones]);

  return { participaciones, loading, error };
}

export function useParticipacionesPorUsuarioEnTorneo(
  usuarioId: string,
  eventoId: string,
) {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipaciones = useCallback(async () => {
    if (!usuarioId || !eventoId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get(
        '/participaciones/participacionesPorUsuarioEnTorneo',
        {
          params: { usuarioId, eventoId: eventoId },
        },
      );
      setParticipaciones(response.data.data);
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to fetch participations.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId, eventoId]);

  useEffect(() => {
    fetchParticipaciones();
  }, [fetchParticipaciones]);

  return { participaciones, loading, error };
}

export function useParticipacionesPorTorneo(eventoId: string) {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipaciones = useCallback(async () => {
    if (!eventoId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get(
        'participaciones/participacionesPorTorneo',
        {
          params: { eventoId: eventoId },
        },
      );
      setParticipaciones(response.data.data);
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to fetch participations.');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    fetchParticipaciones();
  }, [fetchParticipaciones]);

  return { participaciones, loading, error };
}

export const useParticipacionesporUsuario = (usuarioId: string) => {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipaciones = useCallback(async () => {
    if (!usuarioId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get(
        '/participaciones/participacionesPorUsuario',
        {
          params: { usuarioId },
        },
      );
      setParticipaciones(response.data.data);
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to fetch participations.');
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    fetchParticipaciones();
  }, [fetchParticipaciones]);

  return { participaciones, loading, error };
};

export const useParticipacionesTotalesPorTorneo = (
  eventoId: string | undefined,
) => {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipaciones = useCallback(async () => {
    if (!eventoId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get<{ data: Participation[] }>(
        'participaciones/participacionesTotalesPorTorneo',
        {
          params: { eventoId: eventoId },
        },
      );
      setParticipaciones(response.data.data);
    } catch (err) {
      console.error('Error fetching participations:', err);
      setError('Failed to fetch participations.');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    fetchParticipaciones();
  }, [fetchParticipaciones]);

  return { participaciones, loading, error };
};

export const useParticipacionBasic = () => {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const crearParticipacion = useCallback(async (p: ParticipacionPayload) => {
    setLoading(true);
    setError(null);
    try {
      await apiAxios.post("/participaciones", p);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError("Error al crear la participación: " + (axiosError.response?.data?.message || axiosError.message));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const editarParticipacion = useCallback(async (p: ParticipacionEditPayload) => {
    setLoading(true);
    setError(null);
    try {
      await apiAxios.put(`/participaciones/${p.id}`, p);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError("Error al editar la participación: " + (axiosError.response?.data?.message || axiosError.message));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const borrarParticipacion = async (participacionId: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiAxios.delete(`/participaciones/${participacionId}`);
      return true;
    } catch (err) {
      const e = err as AxiosError<{ message: string }>;
      setError("Error al borrar la participación: " + (e.response?.data?.message || e.message));
      return false;
    } finally {
      setLoading(false);
    }
  };

  const traerParticipacionesEquipo = useCallback(async (id: string | undefined, equipoid: string) => {
    if (!id || !equipoid) return;
    const equipoIdNum = Number(equipoid);
    if (isNaN(equipoIdNum) || equipoIdNum <= 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await apiAxios.get(
        `/participaciones/participacionesxequipo`,
        {
          params: { partidoId: id, equipoid: equipoIdNum },
        }
      );
      setParticipaciones(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      setError("Error al traer las participaciones: " + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }, []);

  return { crearParticipacion, editarParticipacion, borrarParticipacion, traerParticipacionesEquipo, participaciones, loading, error };
};