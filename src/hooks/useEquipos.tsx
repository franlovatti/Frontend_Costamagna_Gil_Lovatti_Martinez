import {  useEffect, useState } from "react";
import axios from "axios";
import type { Equipo } from "../types";

export function useEquiposEvento(eventoId?: string) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [errorEquipos, setErrorEquipos] = useState<Error | null>(null);

   useEffect(() => {
    const fetchItems = async () => {
      setLoadingEquipos(true);
      try {
        const response = await axios.get(
          'http://localhost:3000/api/equipos/evento/' + eventoId
        );
        setEquipos(response.data.data);
      } catch (err) {
        setErrorEquipos(err as Error);
      } finally {
        setLoadingEquipos(false);
      }
    };

    fetchItems();
  }, [eventoId]);

  return { equipos, loadingEquipos, errorEquipos };
}