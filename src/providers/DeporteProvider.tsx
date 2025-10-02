import { useEffect, useState } from "react";
import { DeporteContext } from "../contexts/deporte";
import apiAxios from "../helpers/api";
import type { Deporte } from "../contexts/deporte";


const DeportesProvider = ({ children }: { children: React.ReactNode }) => {
  const [deportes, setDeportes] = useState<Deporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getDeportes = async () => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/deportes');
      setDeportes(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setDeportes([]);
      setError("No se pudieron cargar los deportes" + error);
    }
    setLoading(false);
  };

  const borrarDeporte = async (id: number) => {
    try {
      await apiAxios.delete(`/deportes/${id}`);
      await getDeportes();
    } catch (error) {
      setError("Error al borrar el deporte:" + error);
    }
  };

  const modificarDeporte = async (deporte: Deporte) => {
    try {
      await apiAxios.put(`/deportes/${deporte.id}`, deporte);
      await getDeportes();
    } catch (error) {
      setError("Error al modificar el deporte:" + error);
    }
  };

  const crearDeporte = async (deporte: Deporte) => {
    try {
      await apiAxios.post("/deportes", deporte);
      await getDeportes();
    } catch (error) {
      setError("Error al crear el deporte:" + error);
    }
  };

  useEffect(() => {
    console.log("useEffect ejecutado del provider");
    getDeportes();
  }, []);

  return (
    <DeporteContext.Provider value={{ deportes, loading, error, getDeportes, borrarDeporte, modificarDeporte, crearDeporte }}>
      {children}
    </DeporteContext.Provider>
  );
};

export default DeportesProvider;