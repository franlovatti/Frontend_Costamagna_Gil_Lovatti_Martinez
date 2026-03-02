import { useState, useCallback } from 'react';
import apiAxios from '../helpers/api';
import { AxiosError } from 'axios';

interface InvitacionData {
  emailInvitado: string;
  estado: string;
  expirada: boolean;
  aceptada: boolean;
  equipo: {
    id: number;
    nombre: string;
    esPublico: boolean;
  };
  evento: {
    id: number;
    nombre: string;
  } | null;
  capitan: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export function useInvitacion() {
  const [invitacion, setInvitacion] = useState<InvitacionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getInvitacion = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiAxios.get(`/invitaciones/${token}`);
      setInvitacion(response.data.data);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al obtener la invitación: ' + axiosError.response?.data.message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const aceptarInvitacion = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiAxios.post('/invitaciones/aceptar', { token });
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al aceptar la invitación: ' + axiosError.response?.data.message,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const enviarInvitacion = useCallback(
    async (equipoId: number, emailInvitado: string) => {
      setLoading(true);
      setError(null);
      try {
        await apiAxios.post('/invitaciones/enviar', {
          equipoId,
          emailInvitado,
        });
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al enviar la invitación: ' + axiosError.response?.data.message,
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    invitacion,
    loading,
    error,
    getInvitacion,
    aceptarInvitacion,
    enviarInvitacion,
  };
}
