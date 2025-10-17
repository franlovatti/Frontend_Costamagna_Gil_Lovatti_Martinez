import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];      // Array de strings para los roles permitidos
}


const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // 1. Verificar autenticación
  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login.
    // 'replace' evita que el usuario vuelva a la página protegida con el botón de atrás.
    return <Navigate to={isAuthenticated ? "/" : "/login"} replace />;
  }

  // 2. Verificar roles (si se especificaron 'allowedRoles')
  if (allowedRoles && allowedRoles.length > 0) {
    // Comprobamos si el rol del usuario está incluido en los roles permitidos
    const userHasRequiredRole = user && allowedRoles.includes(user.role);
    if (!userHasRequiredRole) {
      return <Navigate to="/login" replace />;
    }
  }

  // 3. Si está autenticado y tiene el rol correcto, renderiza los hijos.
  // Usamos 'children' directamente para mayor flexibilidad.
  // Si se usa como elemento de <Route>, se puede usar <Outlet /> para rutas anidadas.
  return <Outlet />;
};

export default ProtectedRoute;
