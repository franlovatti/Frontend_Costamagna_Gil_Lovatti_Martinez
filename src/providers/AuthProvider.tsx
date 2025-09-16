import { useState } from 'react';
import { AuthContext} from '../contexts/auth';
import type { AuthContextType, User } from '../contexts/auth';
import { useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [wasAuthenticated, setWasAuthenticated] = useState<boolean>(false);

  const login = async (usuario: string, contraseña: string) => {
  const response = await fetch('http://localhost:3000/api/usuarios/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario, contraseña })
  });
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('token', data.token);
    setIsAuthenticated(true);
    setUser({ usuario, role: data.role, id: data.id, nombre: data.nombre, apellido: data.apellido });
    setWasAuthenticated(true);
    return true;
  }
  return false;
};

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const registro = async (nombre: string, apellido: string, usuario: string, contraseña: string, fechaNacimiento: string, email: string) => {
    const response = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, usuario, contraseña, fechaNacimiento, email, role: "Usuario", participations: [] })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Usuario registrado:", data);
      const loginSuccess = await login(usuario, contraseña); // Iniciar sesión automáticamente después del registro
      return loginSuccess;
    }
    
    return false;
  };

  const authValue: AuthContextType = {
    isAuthenticated,
    user,
    login,
    logout,
    registro,
    wasAuthenticated
  };

  useEffect(() => {
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
        }
      } catch {
        // Si el token es inválido, lo borramos
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;