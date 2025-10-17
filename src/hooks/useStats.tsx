import { useEffect, useState } from "react";
import apiAxios from "../helpers/api";

export function useStats() {

  interface DeporteConEventos {
    deporteId: number;
    deporte: string;
    totalEventos: number;
  }

  interface Stats {
    totalUsers: number;
    deportes: number;
    eventos: number;
    [key: string]: number;
    publicos: number;
    activeUsers: number;
    activeEventos: number;
    partidosJugados: number;
    partidosPorJugar: number;
  }

  const [stats, setStats] = useState<Stats | null>(null);
  const [deportesConEventos, setDeportesConEventos] = useState<DeporteConEventos[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    apiAxios.get("/admin/stats").then(res => {
      setStats(res.data);
      setLoading(false);
    });
    apiAxios.get("/admin/stats/deportesStats").then(res => {
      setDeportesConEventos(res.data);
      setLoading(false);
    });
  }, []);

  return { stats, deportesConEventos, loading };
}