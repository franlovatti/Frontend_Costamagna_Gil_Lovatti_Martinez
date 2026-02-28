import { useState, useEffect, useCallback } from 'react';
import apiAxios from '../helpers/api';
import type { Participation } from '../types';

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
      console.log('Participaciones totales por torneo:', response.data.data);
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
