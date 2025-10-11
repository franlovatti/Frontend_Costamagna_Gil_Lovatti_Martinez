import {  useEffect, useState } from "react";
import axios from "axios";
import type { Partido } from "../types.tsx";

export function usePartidos(eventoId?: string) {
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