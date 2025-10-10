import { useEffect, useState } from "react";
import { UsuarioContext } from "../contexts/usuario";
import apiAxios from "../helpers/api";
import type { User } from "../contexts/auth";


const UsuariosProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUsuarios = async (opts?: { q?: string; page?: number }) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/usuarios/filter', { params: opts });
      setUsuarios(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setUsuarios([]);
      setError("No se pudieron cargar los usuarios" + error);
    }
    setLoading(false);
  };

  const borrarUsuario = async (id: number) => {
    try {
      await apiAxios.delete(`/usuarios/${id}`);
      await getUsuarios();
    } catch (error) {
      setError("Error al borrar el usuario:" + error);
    }
  };

  const modificarUsuario = async (usuario: User) => {
    try {
      await apiAxios.put(`/usuarios/${usuario.id}`, usuario);
      await getUsuarios();
    } catch (error) {
      setError("Error al modificar el usuario:" + error);
    }
  };

  const crearUsuario = async (usuario: User) => {
    try {
      await apiAxios.post("/usuarios", usuario);
      await getUsuarios();
    } catch (error) {
      setError("Error al crear el usuario:" + error);
    }
  };

  useEffect(() => {
    getUsuarios();
  }, []);

  return (
    <UsuarioContext.Provider value={{ usuarios, loading, error, getUsuarios, borrarUsuario, modificarUsuario, crearUsuario }}>
      {children}
    </UsuarioContext.Provider>
  );
};

export default UsuariosProvider;