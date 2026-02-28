import { useEffect, useState, useCallback } from "react";
import { UsuarioContext } from "../contexts/usuario";
import apiAxios from "../helpers/api";
import type { User } from "../contexts/auth";
import { AxiosError } from "axios";

const UsuariosProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUsuarios = useCallback(async (opts?: { q?: string; page?: number }) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/usuarios', { params: opts });
      setUsuarios(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setUsuarios([]);
      setError("No se pudieron cargar los usuarios: " + (axiosError.response?.data?.message || axiosError.message));
    }
    setLoading(false);
  }, []);

  const filtrarUsuarios = useCallback(async (rol?: string, estado?: string) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/usuarios/filter', {
        params: { rol, estado },
      });
      setUsuarios(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setUsuarios([]);
      setError('No se pudieron cargar los usuarios filtrados: ' + (axiosError.response?.data?.message || axiosError.message));
    }
    setLoading(false);
  }, []);

  const modificarUsuario = async (usuario: User) => {
    try {
      setError(null);
      await apiAxios.put(`/usuarios/${usuario.id}`, usuario);
      await getUsuarios();
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const message = axiosError?.response?.data?.message || axiosError?.message || "Error al modificar el usuario";
      setError(message);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    getUsuarios();
  }, [getUsuarios]);

  return (
    <UsuarioContext.Provider value={{ usuarios, loading, error, getUsuarios, modificarUsuario, filtrarUsuarios, clearError }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export default UsuariosProvider;