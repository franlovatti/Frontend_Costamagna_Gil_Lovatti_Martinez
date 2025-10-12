import { useEffect, useState } from "react";
import { TorneoContext } from "../contexts/torneo";
import apiAxios from "../helpers/api";
import type { Torneo } from "../contexts/torneo";
import type { Deporte } from "../contexts/deporte";


const TorneosProvider = ({ children }: { children: React.ReactNode }) => {
  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface Payload{
    deporte: number,
    id?: number;
    nombre: string;
    esPublico: boolean;
    contraseña?: string;
    cantEquiposMax: number;
    fechaInicioInscripcion: Date;
    fechaFinInscripcion: Date;
    fechaInicioEvento?: Date;
    fechaFinEvento?: Date;
    deporteC: Deporte;
  }

  const getTorneos = async () => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/eventos');
      setTorneos(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setTorneos([]);
      setError("No se pudieron cargar los torneos" + error);
    }
    setLoading(false);
  };

  const borrarTorneo = async (id: number) => {
    try {
      await apiAxios.delete(`/eventos/${id}`);
      await getTorneos();
    } catch (error) {
      setError("Error al borrar el torneo:" + error);
    }
  };

  const modificarTorneo = async (torneo: Torneo) => {
    try {
      const payload: Payload = { ...torneo, deporte: torneo.deporte.id, deporteC: torneo.deporte };
      payload.deporteC = undefined as unknown as Deporte; // No enviar el objeto deporte completo
      console.log("Payload de torneo a modificar: ", payload);
      await apiAxios.put(`/eventos/${torneo.id}`, payload);
      await getTorneos();
    } catch (error) {
      setError("Error al modificar el torneo:" + error);
    }
  };

  const crearTorneo = async (torneo: Torneo) => {
    try {
      const payload: Payload = { ...torneo, deporte: torneo.deporte.id, deporteC: torneo.deporte };
      payload.deporteC = undefined as unknown as Deporte; // No enviar el objeto deporte completo
      console.log("Payload de torneo a crear payload: ", payload);
      await apiAxios.post("/eventos", payload);
      await getTorneos();
    } catch (error) {
      setError("Error al crear el torneo:" + error);
    }
  };

  useEffect(() => {
    getTorneos();
  }, []);

  return (
    <TorneoContext.Provider value={{ torneos, loading, error, getTorneos, borrarTorneo, modificarTorneo, crearTorneo }}>
      {children}
    </TorneoContext.Provider>
  );
};

export default TorneosProvider;