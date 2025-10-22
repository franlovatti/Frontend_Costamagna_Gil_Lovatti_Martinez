import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Establecimiento } from '../types'; // ajustá el import según tu proyecto

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
        console.log(response.data.data);
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
