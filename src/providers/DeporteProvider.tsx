import { useEffect, useState, useCallback, useMemo } from "react";
import { DeporteContext } from "../contexts/deporte";
import apiAxios from "../helpers/api";
import type { Deporte } from "../contexts/deporte";


const DeportesProvider = ({ children }: { children: React.ReactNode }) => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDeportes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/deportes');
      setDeportes(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setDeportes([]);
      setError("No se pudieron cargar los deportes" + error);
    } finally {
      setLoading(false);
    }
  }, []);

  const filtrarDeportes = useCallback(async (cantMaxJug?: number, cantMinJug?: number, minDesde?: number, maxHasta?: number) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/deportes/filter', {
        params: { cantMaxJug, cantMinJug, minDesde, maxHasta },
      });
      setDeportes(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setDeportes([]);
      setError('No se pudieron cargar los deportes filtrados' + error);
    }
    setLoading(false);
  }, []);

  const borrarDeporte = useCallback(async (id: number) => {
    try {
      await apiAxios.delete(`/deportes/${id}`);
      await getDeportes();
    } catch (error) {
      setError("Error al borrar el deporte:" + error);
    }
  }, [getDeportes]);

  const modificarDeporte = useCallback(async (deporte: Deporte) => {
    try {
      await apiAxios.put(`/deportes/${deporte.id}`, deporte);
      await getDeportes();
    } catch (error) {
      setError("Error al modificar el deporte:" + error);
    }
  }, [getDeportes]);

  const crearDeporte = useCallback(async (deporte: Deporte) => {
    try {
      await apiAxios.post("/deportes", deporte);
      await getDeportes();
    } catch (error) {
      setError("Error al crear el deporte:" + error);
    }
  }, [getDeportes]);

  useEffect(() => {
    getDeportes();
  }, [getDeportes]);

  const value = useMemo(() => ({
    deportes,
    loading,
    error,
    getDeportes,
    filtrarDeportes,
    borrarDeporte,
    modificarDeporte,
    crearDeporte
  }), [deportes, loading, error, getDeportes, filtrarDeportes, borrarDeporte, modificarDeporte, crearDeporte]);


  return (
    <DeporteContext.Provider value={value}>
      {children}
    </DeporteContext.Provider>
  );
};

export default DeportesProvider;