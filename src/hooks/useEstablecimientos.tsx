import { useState, useEffect } from "react";
import axios from "axios";
import type { Establecimiento } from "../types"; // ajustá el import según tu proyecto

export function useEstablecimientos(eventoId?: string) {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [loadingEstablecimientos, setLoadingEstablecimientos] = useState(false);
  const [errorEstablecimientos, setErrorEstablecimientos] = useState<Error | null>(null);

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

  return { establecimientos, loadingEstablecimientos, errorEstablecimientos };
}
