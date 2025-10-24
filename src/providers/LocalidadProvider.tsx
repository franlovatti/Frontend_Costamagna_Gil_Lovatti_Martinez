import { useState, useCallback, useEffect } from "react";
import { LocalidadContext, type Localidad } from "../contexts/localidad.tsx";
import apiAxios from "../helpers/api.tsx";
import { AxiosError } from "axios";

const LocalidadProvider = ({ children }: { children: React.ReactNode }) => {

  const [localidades, setLocalidades] = useState<Localidad[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLocalidades = useCallback(async () =>{
    setError(null);
    setLoading(true);
    try {
      const response =  await apiAxios.get("localidades")
      setLocalidades(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      setLocalidades([]);
      setError("Error al cargar las localidades: " + error);
    } finally {
      setLoading(false);
    }
  }
  ,[]);

  const borrarLocalidad = useCallback(async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      await apiAxios.delete(`/localidades/${id}`);
      await getLocalidades();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMsg = axiosError.response?.data?.message || "Error al borrar la localidad";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getLocalidades]);

  const crearLocalidad = useCallback(async (localidad: Localidad) => {
    setError(null);
    setLoading(true);
    console.log("Creando localidad:", localidad);
    try {
      await apiAxios.post("/localidades", localidad);
      await getLocalidades();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMsg = axiosError.response?.data?.message || "Error al crear la localidad";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [getLocalidades]);

  useEffect(() => {
    getLocalidades();
  }, [getLocalidades]);

  return (
    <LocalidadContext.Provider
      value={{ localidades, loading, error, getLocalidades, borrarLocalidad, crearLocalidad }}
    >
      {children}
    </LocalidadContext.Provider>
  )
  };

export default LocalidadProvider;