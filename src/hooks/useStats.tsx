import { useEffect, useState } from "react";
import apiAxios from "../helpers/api";

export function useStats() {

  interface Stats {
    totalUsers: number;
    deportes: number;
    eventos: number;
    [key: string]: number;
  }

  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiAxios.get("/admin/stats").then(res => {
      setStats(res.data);
      setLoading(false);
    });
  }, []);

  return { stats, loading };
}