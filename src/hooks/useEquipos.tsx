import {  useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import type { Equipo, Partido, Torneo } from "../types";

export function useEquiposEvento(eventoId?: string) {
  const [equipos, setEquipos] = useState<Equipo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [errorEquipos, setErrorEquipos] = useState<Error | null>(null);

   useEffect(() => {
    if (!eventoId) return;
    const fetchItems = async () => {
      console.log(eventoId);
      setLoadingEquipos(true);
      setErrorEquipos(null);
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

type EquipoConTorneo = Equipo & { evento?: Torneo | null } & { partido?: Partido | null };

export function useMisEquipos(usuarioId: string) {
  const [equipos, setEquipos] = useState<EquipoConTorneo[]>([]);
  const [loadingEquipos, setLoadingEquipos] = useState(false);
  const [errorEquipos, setErrorEquipos] = useState<string | null>(null);

  useEffect(() => {
    if (!usuarioId) return;
    const fetchItems = async () => {
      setLoadingEquipos(true);
      setErrorEquipos(null);
      try {
        const response = await axios.get<{ data: EquipoConTorneo[] }>(
          `http://localhost:3000/api/equipos/usuario/${usuarioId}`
        );
        setEquipos(response.data?.data ?? []);
      } catch (err) {
        const e = err as AxiosError<{ message: string }>;
        setErrorEquipos(e.response?.data?.message ?? e.message);
      } finally {
        setLoadingEquipos(false);
      }
    };
    fetchItems();
  }, [usuarioId]);

  return { equipos, loadingEquipos, errorEquipos };
}