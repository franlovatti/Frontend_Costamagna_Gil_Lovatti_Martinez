import { useContext, useEffect, useCallback, useState } from 'react';
import { TorneoContext } from '../contexts/torneo.tsx';
import apiAxios from '../helpers/api.tsx';
import type { Torneo } from '../contexts/torneo.tsx';

export const useTorneo = () => {
  const context = useContext(TorneoContext);
  if (!context) {
    throw new Error('useTorneo must be used within a TorneoProvider');
  }
  return context;
}; 

export function useOneTorneo(idTorneo: string|undefined){
    const [torneo, setTorneo] = useState<Torneo>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string|null>();

    const fetchTorneo = useCallback(async () => {
        if (!idTorneo) return;

        setLoading(true);
        setError(null);

        try{
            const response = await apiAxios.get(`/eventos/${idTorneo}`)
            setTorneo(response.data.data); 
        } catch (err) {
            console.log("Error fetching Torneo:", err);
            setError('Failed to fetch Torneo');
        } finally {
            setLoading(false);
        }
    }, [idTorneo]);
    useEffect(() => {
        fetchTorneo();
    }, [fetchTorneo]);


    return { torneo, loading, error };
}