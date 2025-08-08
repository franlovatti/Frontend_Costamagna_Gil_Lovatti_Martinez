import {useState} from "react";
import { InputField } from "../components/InputField.tsx";
import {Button, Submit} from "../components/ButtonField.tsx";

export default function Registro() {
  const [apellido, setApellido] = useState<string>("")
  const [nombre, setNombre] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("")
  const [usuario, setUsuario] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [tipoFecha, setTipoFecha] = useState<"text"|"date">("text");  

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await fetch("http://localhost:5173/Registro", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, apellido, usuario, password, fechaNacimiento, email}),
      });

      if(!response.ok){
        throw new Error("Error en la solicitud")
      }
    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    alert("Registro exitoso");
    } catch (error) {
    console.error("Error al Registrarse:", error)
    alert("Error al Registrarse");
  } finally{
    setLoading(false);
  } 
  };

   const handleUsuarioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsuario(e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  }

    const handleApellidoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApellido(e.target.value);
  }

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  }

    const handleFechaNacimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFechaNacimiento(e.target.value);
  }

  return(
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
          <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Registrarse</h2>
            <form onSubmit={handleRegistro}>
              <div>
                <div className="mb-3">
                <InputField
                type="text"
                placeholder="Nombres"
                value={nombre}
                onChange={handleNombreChange}
                required
                />
              </div>
              <div className="mb-3">
                <InputField
                type="text"
                placeholder="Apellidos"
                value={apellido}
                onChange={handleApellidoChange}
                required
                />
              </div>
              <div className="mb-3">
                <InputField
                  type="text"
                  placeholder="Usuario"
                  value={usuario}
                  onChange={handleUsuarioChange}
                  required
                />
              </div>
              <div className="mb-3">
                <InputField
                  type="text"
                  placeholder="Direccion de correo electronico"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
              </div>
              <div className="mb-3">
                <InputField
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-3">
                <input
                type={tipoFecha}
                placeholder="Fecha de Nacimiento"
                className="form-control"
                value={fechaNacimiento}
                onFocus={() => setTipoFecha("date")}
                onBlur={() => {
                  if(!fechaNacimiento) setTipoFecha("text")
                }}
                onChange={handleFechaNacimientoChange}
                required
                />
              </div>
              </div>
              <div className="d-flex justify-content-between">
                <Button className="btn btn-primary" onClick={() => window.location.href = '/Login'}>
                  Iniciar Sesion
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

