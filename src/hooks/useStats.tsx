import { useEffect, useState } from "react";
import apiAxios from "../helpers/api";
import { AxiosError } from "axios";

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
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [statsRes, deportesRes] = await Promise.all([
          apiAxios.get("/admin/stats"),
          apiAxios.get("/admin/stats/deportesStats")
        ]);
        setStats(statsRes.data);
        setDeportesConEventos(deportesRes.data);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        const message = axiosError.response?.data?.message || "Error al cargar estadísticas";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, deportesConEventos, loading, error };
}