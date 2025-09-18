import { useState, useCallback } from 'react';
import { AuthContext} from '../contexts/auth';
import type { AuthContextType, User } from '../contexts/auth';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import apiAxios from '../helpers/api';
import { useMemo } from 'react';

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [wasAuthenticated, setWasAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (usuario: string, contraseña: string, remember: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiAxios.post('/usuarios/login', { usuario, contraseña, remember });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        if (remember) {
          localStorage.setItem('recuerdame', data.recuerdame);
        } else {
          localStorage.removeItem('recuerdame');
        }
        setIsAuthenticated(true);
        setUser({ usuario, role: data.role, id: data.id, nombre: data.nombre, apellido: data.apellido });
        setWasAuthenticated(true);
        return true;
      }
      setError("Credenciales inválidas");
      return false;
    } catch {
      setError("Error en la conexión");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    try {
      await apiAxios.post('/usuarios/logout'); // Llamada al endpoint de logout para borrar la cookie
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  }, []);

  const registro = useCallback(async (nombre: string, apellido: string, usuario: string, contraseña: string, fechaNacimiento: string, email: string, remember: boolean) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiAxios.post('/usuarios', {
        nombre,
        apellido,
        usuario,
        contraseña,
        fechaNacimiento,
        email,
        role: "Usuario",
        participations: []
      });
      if (response.status === 201 || response.status === 200) {
        console.log("Usuario registrado:", response.data);
        const loginSuccess = await login(usuario, contraseña, remember); // Iniciar sesión automáticamente después del registro
        return loginSuccess;
      }
      setError("Error en el registro");
      return false;
    } catch {
      setError("Error en la conexión");
      return false;
    } finally {
      setLoading(false);
    }
  }, [login]);

  const authValue: AuthContextType = useMemo(() => ({
    isAuthenticated,
    user,
    loading,
    error,
    login,
    logout,
    registro,
    wasAuthenticated
  }), [isAuthenticated, user, loading, error, login, logout, registro, wasAuthenticated]);

  // Al renderizar verifica si hay un token o cookie "recuerdame" válida y restaura la sesión
  useEffect(() => {
    const restaurarSesion = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode<{ id: string; usuario: string; role: string; nombre?: string; apellido?: string; exp?: number }>(token);
          // Verificamos expiración
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            // Token expirado
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
          } else {
            const userFromToken: User = {
              id: decoded.id,
              nombre: decoded.nombre,
              apellido: decoded.apellido,
              usuario: decoded.usuario,
              role: decoded.role
            };
            setUser(userFromToken);
            setIsAuthenticated(true);
            return;
          }
        } catch {
          // Si el token es inválido, lo borramos
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      // Si no hay token válido, intentamos restaurar con cookie recuerdame
      try {
        const response = await apiAxios.post('/usuarios/restaurar');
        const data = response.data;
        if (data.token) {
          localStorage.setItem('token', data.token);
          const userFromToken: User = {
              id: data.id,
              nombre: data.nombre,
              apellido: data.apellido,
              usuario: data.usuario,
              role: data.role
            };
          setUser(userFromToken);
          setIsAuthenticated(true);
        }
      } catch {
        // No se pudo restaurar sesión con cookie
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    restaurarSesion();
  }, []);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;