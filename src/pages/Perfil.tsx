import { useAuth } from "../hooks/useAuth"

export default function Perfil(){
  const { user } = useAuth();
  return(
    <div className="text-bg-dark">
      <h1>PERFIL</h1>
      <p>Tu rol es: {user?.role || 'Usuario'}</p>
      <p>ID de usuario: {user?.id || 'N/A'}</p>
      <p>Nombre: {user?.nombre || 'N/A'}</p>
      <p>Apellido: {user?.apellido || 'N/A'}</p>
    </div>
  )
}