import { useCallback, useMemo, useState } from 'react';
import apiAxios from '../helpers/api.tsx';
import { AxiosError } from 'axios';
import {
  type Participacion,
  ParticipacionContext,
} from '../contexts/participacion.tsx';
import type {
  ParticipacionEditPayload,
  ParticipacionPayload,
} from '../DTOs/participacionesDTO.tsx';

const ParticipacionProvider = ({ children }: { children: React.ReactNode }) => {
  const [participaciones, setParticipaciones] = useState<Participacion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getParticipacionesPartidoEquipo = useCallback(
    async (partidoId: number, equipoId: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiAxios.get(
          `participaciones/participacionesxequipo`,
          { params: { partidoId, equipoId } },
        );
        setParticipaciones(result.data.data as Participacion[]);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al cargar las participaciones: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getParticipacionesUsuarioTorneo = useCallback(
    async (usuarioId: number, eventoId: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiAxios.get(
          `participaciones/participacionesPorUsuarioEnTorneo`,
          { params: { usuarioId, eventoId } },
        );
        setParticipaciones(result.data.data as Participacion[]);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al cargar las participaciones: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getParticipacionesPorTorneo = useCallback(async (eventoId: number) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiAxios.get(
        `participaciones/participacionesPorTorneo`,
        { params: { eventoId } },
      );
      setParticipaciones(result.data.data as Participacion[]);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al cargar las participacioes: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const getParticipacionesPorUsuario = useCallback(
    async (usuarioId: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiAxios.get(
          `participaciones/participacionesPorUsuario`,
          { params: { usuarioId } },
        );
        setParticipaciones(result.data.data as Participacion[]);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al cargar las participacioes: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getParticipacionesTotalesPorTorneo = useCallback(
    async (eventoId: number) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiAxios.get(
          `participaciones/participacionesPorUsuario`,
          { params: { eventoId } },
        );
        setParticipaciones(result.data.data as Participacion[]);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al cargar las participacioes: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const crearParticipacion = useCallback(
    async (payload: ParticipacionPayload) => {
      setLoading(true);
      setError(null);

      try {
        await apiAxios.post(`/participaciones`, payload);
        return true;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al crear la participacion: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const editarParticipacion = useCallback(
    async (payload: ParticipacionEditPayload) => {
      setLoading(true);
      setError(null);

      try {
        await apiAxios.put(`participaciones/${payload.id}`, payload);
        return true;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al editar la participacion: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const borrarParticipacion = useCallback(async (participacionId: number) => {
    setLoading(true);
    setError(null);

    try {
      await apiAxios.delete(`participaciones/${participacionId}`);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al editar la participacion: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({
      loading,
      error,
      participaciones,
      borrarParticipacion,
      getParticipacionesPartidoEquipo,
      getParticipacionesPorTorneo,
      getParticipacionesPorUsuario,
      getParticipacionesTotalesPorTorneo,
      getParticipacionesUsuarioTorneo,
      crearParticipacion,
      editarParticipacion,
    }),
    [
      loading,
      error,
      participaciones,
      borrarParticipacion,
      getParticipacionesPartidoEquipo,
      getParticipacionesPorTorneo,
      getParticipacionesPorUsuario,
      getParticipacionesTotalesPorTorneo,
      getParticipacionesUsuarioTorneo,
      crearParticipacion,
      editarParticipacion,
    ],
  );
  return (
    <ParticipacionContext.Provider value={value}>
      {children}
    </ParticipacionContext.Provider>
  );
};

export default ParticipacionProvider;
