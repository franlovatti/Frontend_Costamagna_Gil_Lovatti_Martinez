import {type Equipo, EquipoContext} from "../contexts/equipo";
import { useState, useCallback, useMemo } from "react";
import apiAxios from "../helpers/api";
import type { AxiosError } from "axios";
import type { EquiposPayload, EquipoEditPayload } from "../DTOs/equipoDTO";


const EquipoProvider = ({ children }: { children: React.ReactNode }) => {
    const[Equipos, setEquipos] = useState<Equipo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getEquiposEvento = useCallback(async (eventoId: number) =>{
        setLoading(true);
        setError(null);
        try{
            const response = await apiAxios.get(`/equipos/evento/${eventoId}`);
            setEquipos(response.data.data);
        }catch(err){
          const axiosError = err as AxiosError<{ message?: string }>;
          setError("Error al cargar los equipos: " + (axiosError.response?.data?.message || axiosError.message));   
        }finally{
            setLoading(false);
        }
    }, []);


    const getMisEquipos = useCallback(async (usuarioId: number) => {
        setLoading(true);
        setError(null);

        try{
            const response = await apiAxios.get(`/equipos/usuario/${usuarioId}`);
            setEquipos(response.data.data);
        }catch(err){
            const axiosError = err as  AxiosError<{message?: string}>;
            setError("Error al cargar los equipos del usuario: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
        }
    }, [])

    const borrarEquipo = useCallback(async (equipoId: number) => {
        setLoading(true);
        setError(null);

        try{
            await apiAxios.delete(`/equipos/${equipoId}`);
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>;
            setError("Error al borrar el equipo: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false);
            }
    }, []) 

    const crearEquipo = useCallback(async (payload: EquiposPayload) => {
        setLoading(true);
        setError(null);

        try{
            await apiAxios.post(`equipos`, payload)
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>;
            setError("Error creando el equipo: " + (axiosError.response?.data?.message || axiosError.message));
        }finally{
            setLoading(false)
        }
    }, [])

    const inscribirseEquipo = useCallback(async (equipo: Equipo, contrasenia?: string, usuarioId?: number) => {
        setLoading(true);
        setError(null);
        try{
            const body: Record<string, unknown> = {usuarioId};
            if(!equipo.esPublico) body.constrasenia = contrasenia;
            await apiAxios.post(`/equipos/${equipo.id}/miembros`, body)
            return true;
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>;
            setError("Error creando al equipo: " + (axiosError.response?.data?.message || axiosError.message))
            return false;
        }finally{
            setLoading(false);
        }
    }, [])

    const salirEquipo = useCallback(async (equipoId: number, usuarioId: number) => {
        setLoading(true);
        setError(null);

        try{
            await apiAxios.patch(`/equipo/${equipoId}/miembros`, {usuarioId})
            return true
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>;
            setError("Error creando al equipo: " + (axiosError.response?.data?.message || axiosError.message))
            return false;
        }finally{
            setLoading(false);
        }
    }, [])

    const obtenerEquipo = useCallback(async (equipoId: number) => {
        setLoading(true);
        setError(null);

        try{
            const response = await apiAxios.get(`/equipos/${equipoId}`);
            return response.data.data;
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>;
            setError("Error obteniendo el equipo: " + (axiosError.response?.data?.message || axiosError.message))
        }finally{
            setLoading(false);
        }
    }, [])

    const editarEquipo = useCallback(async (equipoId: number, datos: EquipoEditPayload) => {
        setLoading(true);
        setError(null);

        try{
            const payload: Record<string, unknown> = {};
            if(datos.nombre) payload.nombre = datos.nombre;
            if(datos.contrasenia)payload.contrasenia = datos.contrasenia;
            const response = await apiAxios.patch(`/equipos/${equipoId}`);
            return response.data.data;
        }catch(err){
            const axiosError = err as AxiosError<{message?:string}>;
            setError("Error editando el equipo: " + (axiosError.response?.data?.message || axiosError.message))
        } finally{
            setLoading(false);
        }
    }, [])

    const removerMiembro = useCallback(async (equipoId: number, usuarioId: number) => {
        setLoading(true);
        setError(null);

        try{
            await apiAxios.patch(`/equipos/${equipoId}/miembro`, usuarioId); 
        }catch(err){
            const axiosError = err as AxiosError<{message?: string}>;
            setError("Error removiendo miembro: " + (axiosError.response?.data?.message || axiosError.message))
        }finally{
            setLoading(true);
        }
    }, [])

    const value = useMemo(() => ({
        Equipos,
        loading,
        error,
        getEquiposEvento,
        getMisEquipos,
        removerMiembro,
        borrarEquipo,
        crearEquipo,
        inscribirseEquipo,
        salirEquipo,
        obtenerEquipo,
        editarEquipo,
    }), [Equipos,
        loading,
        error,
        getEquiposEvento,
        getMisEquipos,
        removerMiembro,
        borrarEquipo,
        crearEquipo,
        inscribirseEquipo,
        salirEquipo,
        obtenerEquipo,
        editarEquipo,])

        
           return(
            <EquipoContext.Provider value={value}>
                {children}
            </EquipoContext.Provider>
           )
}

export default EquipoProvider;