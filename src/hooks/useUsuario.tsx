import { useCallback, useContext, useEffect, useState } from 'react';
import { UsuarioContext, type Usuario } from '../contexts/usuario';
import apiAxios from '../helpers/api.tsx';

export const useUsuario = () => {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario must be used within a UsuarioProvider');
  }
  return context;
};

export const useParticipantesEvento = (eventoId: string | undefined) => {
  const [participantes, setParticipantes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchParticipantes = useCallback(async () => {
    if (!eventoId) return;
    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get('/usuarios/usuariosPorEvento', {
        params: { eventoId },
      });
      setParticipantes(response.data.data);
    } catch (err) {
      console.error('Error fetching participantess:', err);
      setError('Failed to fetch participantes.');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    fetchParticipantes();
  }, [fetchParticipantes]);

  return { participantes, loading, error };
};
