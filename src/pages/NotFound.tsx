import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <>
      <div className="nf__container">
        <div>
          <h1 className="nf__status">404</h1>
          <h2 className="nf__title">¡Ups! Página No Encontrada</h2>
          <p className="nf__message">
            Parece que la página que estás buscando no existe o se ha movido.
            Por favor, verifica la URL o intenta volver a la página de inicio.
          </p>
          <Link to="/" className="home-button">
            Ir a la página de inicio
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
