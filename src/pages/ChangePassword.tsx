import {useState} from "react";
import { InputField } from "../components/InputField.tsx";
import {Button, Submit} from "../components/ButtonField.tsx";

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);  

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await fetch("http://localhost:5173/ChangePassword", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({password, newPassword}),
      });

      if(!response.ok){
        throw new Error("Error en la solicitud")
      }
    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    alert("Cambio de contraseña exitoso");
    } catch (error) {
    console.error("Error al cambiar contraseña:", error)
    alert("Error al Cambiar contraseña");
  } finally{
    setLoading(false);
  } 
  };


  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

 const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  }

  return(
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
          <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Cambiar contraseña</h2>
            <form onSubmit={handleChangePassword}>
              <div>
                <div className="mb-3">
                <InputField
                type="password"
                placeholder="Ingrese su contraseña actual"
                value={password}
                onChange={handlePasswordChange}
                required
                />
              </div>
              <div className="mb-3">
                <InputField
                  type="password"
                  placeholder="Ingrese su nueva contraseña"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  required
                />
              </div>
              </div>
              <div className="d-flex justify-content-between">
                <Button className="btn btn-primary" onClick={() => window.location.href = '/MainHome'}>
                  Volver
                </Button>
                <Submit className="btn btn-primary" disabled={loading}>
                  {loading ? "Enviando..." : "Aceptar"}
                </Submit>
              </div>
              <div className="text-center mt-3">
                <a href="/ForgottenPassword">¿Olvidaste tu contraseña?</a>
              </div>
            </form>
          </div>
        </div>
      )
}

