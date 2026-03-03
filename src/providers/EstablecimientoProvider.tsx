import {
  EstablecimientoContext,
  type Establecimiento,
} from '../contexts/establecimiento';
import type { EstablecimientoPayloadEdicion } from '../DTOs/establecimientosDTO';
import { AxiosError } from 'axios';
import { useCallback, useMemo, useState } from 'react';
import apiAxios from '../helpers/api';

const EstablecimientoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getEstablecimientos = useCallback(async (eventoId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get(
        '/establecimientos/evento/' + eventoId,
      );
      setEstablecimientos(
        Array.isArray(response.data.data) ? response.data.data : [],
      );
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al cargar los establecimientos: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const crearEstablecimiento = useCallback(
    async (payload: EstablecimientoPayloadEdicion) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiAxios.post('/establecimientos', payload);
        return response.data.data as Establecimiento;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al crear el establecimiento: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteEstablecimiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await apiAxios.delete(`/establecimientos/${id}`);
      return true;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al eliminar el establecimiento: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getOneEstablecimiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiAxios.get(`/establecimientos/${id}`);
      return response.data.data as Establecimiento;
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        'Error al obtener el establecimiento: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const editarEstablecimiento = useCallback(
    async (id: number, payload: EstablecimientoPayloadEdicion) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiAxios.put(`/establecimientos/${id}`, payload);
        return response.data.data as Establecimiento;
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          'Error al editar el establecimiento: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      establecimientos,
      loading,
      error,
      getEstablecimientos,
      crearEstablecimiento,
      deleteEstablecimiento,
      getOneEstablecimiento,
      editarEstablecimiento,
    }),
    [
      establecimientos,
      loading,
      error,
      getEstablecimientos,
      crearEstablecimiento,
      deleteEstablecimiento,
      getOneEstablecimiento,
      editarEstablecimiento,
    ],
  );

  return (
    <EstablecimientoContext.Provider value={value}>
      {children}
    </EstablecimientoContext.Provider>
  );
};

export default EstablecimientoProvider;
