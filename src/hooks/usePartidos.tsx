import {  useEffect, useState } from "react";
import axios from "axios";
import type { Partido } from "../types.tsx";

export function usePartidosEvento(eventoId?: string) {
  const [partidos, setPartidos] = useState<Partido[]>([]);
  const [loadingPartidos, setLoadingPartidos] = useState(false);
  const [errorPartidos, setErrorPartidos] = useState<Error | null>(null);

   useEffect(() => {
    const fetchItems = async () => {
      setLoadingPartidos(true);
      try {
        const response = await axios.get(
          'http://localhost:3000/api/partidos/evento/' + eventoId
        );
        setPartidos(response.data.data);
      } catch (err) {
        setErrorPartidos(err as Error);
      } finally {
        setLoadingPartidos(false);
      }
    };

    fetchItems();
  }, [eventoId]);

  return { partidos, loadingPartidos, errorPartidos };
}

export function useOnePartido(partidoId?: string){
  const [partido, setPartido] = useState<Partido>();
  const [loadingPartido, setLoadingPartido] = useState(false);
  const [errorPartido, setErrorPartido] = useState<Error | null>(null);

   useEffect(() => {
    if (!partidoId) return;

    const fetchData = async () => {
      setLoadingPartido(true);
      setErrorPartido(null);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/partidos/${partidoId}`
        );
        setPartido(response.data.data);
        console.log(response.data.data);
      } catch (err) {
        setErrorPartido(err as Error);
      } finally {
        setLoadingPartido(false);
      }
    };

    fetchData();
  }, [partidoId]);

  return { partido, loadingPartido, errorPartido, setPartido, setLoadingPartido, setErrorPartido };
}