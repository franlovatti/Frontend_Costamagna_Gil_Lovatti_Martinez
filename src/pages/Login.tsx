import { useState } from "react";
import { InputField } from "../components/InputField.tsx";
import {Button, Submit} from "../components/ButtonField.tsx"

export default function Login() {
  const [usuario, setUsuario] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
    const response = await fetch("http://localhost:3000/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, contraseña }),
    });

    if(!response.ok){
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    alert("Inicio de sesión exitoso");
  } catch (error) {
    console.error("Error al iniciar sesion:", error)
    alert("Error al iniciar sesión");
  } finally{
    setLoading(false);
  }
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  }

  const handleContraseñaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContraseña(e.target.value);
  };

  return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <InputField
              type="text"
              placeholder="Usuario o Dirección de correo electrónico"
              value={usuario}
              onChange={handleUsuarioChange}
              required
            />
          </div>
          <div className="mb-3">
            <InputField
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={handleContraseñaChange}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button className="btn btn-primary" onClick={() => window.location.href = '/Registro'}>
              Registrarse
            </Button>
            <Submit className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Aceptar"}
            </Submit>
          </div>
          <div className="text-center mt-3">
            <a href="ForgottenContraseña">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  );
}