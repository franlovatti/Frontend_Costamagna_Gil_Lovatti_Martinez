import { useState, useEffect, useCallback} from 'react';
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
        }
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

export function useParticipacionesPorUsuarioEnTorneo(usuarioId: string, eventoId: string) {
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipaciones = useCallback(async () => {
    if (!usuarioId || !eventoId) return;

    setLoading(true);
    setError(null);

    try{
      const response = await apiAxios.get(
        '/participaciones/participacionesPorUsuarioEnTorneo',
        {
          params: { usuarioId, eventoId: eventoId },
        }
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
