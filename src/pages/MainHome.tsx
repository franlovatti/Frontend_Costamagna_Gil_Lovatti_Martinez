import { useAuth } from "../hooks/useAuth";

export default function MainHome(){
  const { user } = useAuth();
  return(
    //PAGINA PRINCIPAL CUANDO ESTA LOGGEADO
    <div className="text-bg-dark">
      <h1>HOME</h1>
      <p>Bienvenido {user?.nombre || 'User'}!</p>
    </div>
  )
}