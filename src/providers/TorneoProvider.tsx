import { useEffect, useState, useCallback } from 'react';
import { TorneoContext } from '../contexts/torneo';
import apiAxios from '../helpers/api';
import type { Torneo } from '../contexts/torneo';
import { AxiosError } from 'axios';

const TorneosProvider = ({ children }: { children: React.ReactNode }) => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [torneosCreados, setTorneosCreados] = useState<Torneo[]>([]);
  const [torneosInscripto, setTorneosInscripto] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Payload {
    deporte: number;
    localidad: number;
    id?: number;
    nombre: string;
    descripcion: string;
    esPublico: boolean;
    contrasenia?: string;
    cantEquiposMax: number;
    fechaInicioInscripcion: Date;
    fechaFinInscripcion: Date;
    fechaInicioEvento?: Date;
    fechaFinEvento?: Date;
  }

  function ordenarTorneos(torneos: Torneo[]): Torneo[] {
    return torneos.sort((a: Torneo, b: Torneo) => {
      const fechaA = a.fechaInicioEvento
        ? new Date(a.fechaInicioEvento).getTime()
        : 0;
      const fechaB = b.fechaInicioEvento
        ? new Date(b.fechaInicioEvento).getTime()
        : 0;
      return fechaB - fechaA;
    });
  }

  const getTorneos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/eventos');
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const ordenados = ordenarTorneos(data);
      setTorneos(ordenados);
      setError(null);
    } catch (error) {
      setTorneos([]);
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        'No se pudieron cargar los torneos: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
    }
    setLoading(false);
  }, []);

  const getUnTorneo = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/eventos/' + id);
      setTorneo(res.data.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        'No se pudo cargar el torneo: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
      setTorneo(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTorneosCreadosPorUsuario = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/eventos/creador/' + id);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const ordenados = ordenarTorneos(data);
      setTorneosCreados(ordenados);
      setError(null);
    } catch (error) {
      setTorneosCreados([]);
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        'No se pudieron cargar los torneos creados por el usuario: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
    }
    setLoading(false);
  }, []);

  const getTorneosInscriptoPorUsuario = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/eventos/participacion/' + id);
      const data = Array.isArray(res.data.data) ? res.data.data : [];
      const ordenados = ordenarTorneos(data);
      setTorneosInscripto(ordenados);
      setError(null);
    } catch (error) {
      setTorneosInscripto([]);
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        'No se pudieron cargar los torneos del usuario: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
    }
    setLoading(false);
  }, []);

  const getTorneoPorCodigo = useCallback(async (codigo: string) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/eventos/codigo/' + codigo);
      setTorneo(res.data.data);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setError(
        'No se pudo cargar el torneo por código: ' +
          (axiosError.response?.data?.message || axiosError.message),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarTorneos = useCallback(
    async (
      fechaDesde?: string,
      fechaHasta?: string,
      deporte?: string,
      modalidad?: string,
      equiposDesde?: number,
      equiposHasta?: number,
    ) => {
      setLoading(true);
      try {
        const res = await apiAxios.get('/eventos/filter', {
          params: {
            fechaDesde,
            fechaHasta,
            deporte,
            modalidad,
            equiposDesde,
            equiposHasta,
          },
        });
        setTorneos(Array.isArray(res.data.data) ? res.data.data : []);
        setError(null);
      } catch (error) {
        setTorneos([]);
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(
          'No se pudieron cargar los torneos filtrados: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      }
      setLoading(false);
    },
    [],
  );

  const borrarTorneo = useCallback(
    async (id: number) => {
      try {
        await apiAxios.delete(`/eventos/${id}`);
        await getTorneos();
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(
          'Error al borrar el torneo: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      }
    },
    [getTorneos],
  );

  const modificarTorneo = useCallback(
    async (torneo: Torneo) => {
      try {
        const payload: Payload = {
          id: torneo.id,
          nombre: torneo.nombre,
          descripcion: torneo.descripcion ?? torneo.nombre,
          esPublico: torneo.esPublico,
          contrasenia: torneo.contrasenia,
          cantEquiposMax: torneo.cantEquiposMax,
          fechaInicioInscripcion: torneo.fechaInicioInscripcion,
          fechaFinInscripcion: torneo.fechaFinInscripcion,
          fechaInicioEvento: torneo.fechaInicioEvento,
          fechaFinEvento: torneo.fechaFinEvento,
          deporte: torneo.deporte.id,
          localidad: torneo.localidad.id,
        };
        await apiAxios.put(`/eventos/${torneo.id}`, payload);
        await getTorneos();
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(
          'Error al modificar el torneo: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      }
    },
    [getTorneos],
  );

  const crearTorneo = useCallback(
    async (torneo: Torneo) => {
      try {
        const payload: Payload = {
          nombre: torneo.nombre,
          descripcion: torneo.descripcion ?? torneo.nombre,
          esPublico: torneo.esPublico,
          contrasenia: torneo.contrasenia,
          cantEquiposMax: torneo.cantEquiposMax,
          fechaInicioInscripcion: torneo.fechaInicioInscripcion,
          fechaFinInscripcion: torneo.fechaFinInscripcion,
          fechaInicioEvento: torneo.fechaInicioEvento,
          fechaFinEvento: torneo.fechaFinEvento,
          deporte: torneo.deporte.id,
          localidad: torneo.localidad.id,
        };
        await apiAxios.post('/eventos', payload);
        await getTorneos();
      } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>;
        setError(
          'Error al crear el torneo: ' +
            (axiosError.response?.data?.message || axiosError.message),
        );
      }
    },
    [getTorneos],
  );

  useEffect(() => {
    getTorneos();
  }, [getTorneos]);

  return (
    <TorneoContext.Provider
      value={{
        torneos,
        torneo,
        torneosCreados,
        torneosInscripto,
        loading,
        error,
        getTorneos,
        getUnTorneo,
        getTorneoPorCodigo,
        borrarTorneo,
        modificarTorneo,
        crearTorneo,
        filtrarTorneos,
        getTorneosCreadosPorUsuario,
        getTorneosInscriptoPorUsuario,
      }}
    >
      {children}
    </TorneoContext.Provider>
  );
};

export default TorneosProvider;
