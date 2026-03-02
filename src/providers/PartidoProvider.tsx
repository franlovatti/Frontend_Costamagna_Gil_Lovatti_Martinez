import { useCallback, useMemo, useState } from "react"
import { PartidoContext, type Partido } from "../contexts/partido"
import apiAxios from "../helpers/api";
import { AxiosError } from "axios";
import type { PartidoPayload, resultadosDto } from "../DTOs/partidosDTO";

const PartidoProvider = ({children} : {children: React.ReactNode}) => {
    const [partidos, setPartidos] = useState<Partido[]>([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string| null>("");

    const getPartidosEvento = useCallback(async (eventoId: number) => {
        setLoading(true);
        setError(null);

        try{
            const response = await apiAxios.get(`/partidos/evento/${eventoId}`)
            setPartidos(response.data.data);
        }catch(err){
            const axiosError = err as AxiosError<{ message?: string }>;
            setError("Error al cargar los Partidos: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
        }
    }, [])

    const getOnePartido = useCallback(async (partidoId: number) => {
        setLoading(true);
        setError(null);

        try{
            const response = await apiAxios.get(`/partido/${partidoId}`)
            return response.data.data;
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>
            setError("Error al cargar el partido: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
        }
    },[])

    const borrarPartido = useCallback(async (partidoId: number) => {
        setLoading(true);
        setError(null);

        try{
            const response = await apiAxios.delete(`/partidos/${partidoId}`)
            return response.data.data;
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>
            setError("Error al borrar el partido: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
        }
    }, [])

    const cargarResultado = useCallback(async (resultado: resultadosDto) =>{
        setLoading(true);
        setError(null);

        try{
            await apiAxios.put(`/partidos/${resultado.partidoId}`, {
        resultadoLocal: resultado.resultadoLocal === '' ? null : Number(resultado.resultadoLocal),
        resultadoVisitante: resultado.resultadoVisitante === '' ? null : Number(resultado.resultadoVisitante),
      })
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>
            setError("Error al cargar Resultados: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
        }
    }, [])

    const crearPartido = useCallback(async (payload:PartidoPayload) => {
        setLoading(true);
        setError(null);

        try{
            await apiAxios.post(`/partidos`, payload);
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>
            setError("Error al crear Partido: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
        }
    }, [])

    const editarPartido = useCallback(async (partidoId: number, payload: PartidoPayload) => {
        setLoading(true);
        setError(null);

        try{
         const response = await apiAxios.put(`/partidos/${partidoId}`, payload);   
         return response.data.data;
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>
            setError("Error al Editar Partido: " + (axiosError.response?.data?.message || axiosError.message));    
        }finally{
            setLoading(false);
        }
    }, [])

    const value = useMemo(() => ({
        partidos,
        loading,
        error,
        getPartidosEvento,
        getOnePartido,
        borrarPartido,
        cargarResultado,
        crearPartido,
        editarPartido
    }), [partidos, loading, error, getPartidosEvento, getOnePartido, borrarPartido, cargarResultado, crearPartido, editarPartido])

    return(
        <PartidoContext.Provider value={value}>
            {children}
            </PartidoContext.Provider>
    )
}

export default PartidoProvider;
