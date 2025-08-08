import { useState } from "react";
import { InputField } from "../components/InputField.tsx";
import {Button, Submit} from "../components/ButtonField.tsx"

export default function ForgottenPassword() {
  const [usuario, setUsuario] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const handleForgottenPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
    const response = await fetch("http://localhost:5173/ForgottenPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario}),
    });

    if(!response.ok){
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    alert("Inicio de sesión exitoso");
  } catch (error) {
    console.error("Error al encontrar su correo:", error)
    alert("Error al Encontrar su correo");
  } finally{
    setLoading(false);
    setVerified(!verified); // para probar
  }
  };

    const handleForgottenPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
    const response = await fetch("http://localhost:5173/ForgottenPassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usuario, password}),
    });

    if(!response.ok){
      throw new Error("Error en la solicitud");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    alert("Cambio de contraseña exitoso");
  } catch (error) {
    console.error("Error al encontrar cambiar su contraseña:", error)
    alert("Error al Cambiar su contraseña");
  } finally{
    setLoading(false);
    setVerified(!verified) // para probar
  }
  };

  const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setPassword(e.target.value);
  }

  if (!verified){
     return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
        <h2 className="text-center mb-4 fs-4">¿Ha olvidado su contraseña?</h2>
        <h3 className= "text-cente fs-6 mb-4">Ingrese su Direccion de correo electronico y lo ayudaremos con su problema</h3>
        <form onSubmit={handleForgottenPassword}>
          <div className="mb-3">
            <InputField
              type="text"
              placeholder="Dirección de correo electrónico"
              value={usuario}
              onChange={handleUsuarioChange}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button className="btn btn-primary" onClick={() => window.location.href = '/Login'}>
              Iniciar Sesion
            </Button>
            <Submit className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Aceptar"}
            </Submit>
          </div>
        </form>
      </div>
    </div>
  );
  } else{
     return (
      <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
        <h2 className="text-center mb-4 fs-4">¡Ya casi!</h2>
        <form onSubmit={handleForgottenPasswordChange}>
          <div className="mb-3">
            <InputField
              type="password"
              placeholder="Ingrese la nueva constraseña"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button className="btn btn-primary" onClick={() => window.location.href = '/Login'}>
              Iniciar Sesion
            </Button>
            <Submit className="btn btn-primary" disabled={loading}>
              {loading ? "Enviando..." : "Aceptar"}
            </Submit>
          </div>
        </form>
      </div>
    </div>
  );
  }
 
}