import {useState} from "react";
import { InputField } from "../components/InputField.tsx";
import {Button, Submit} from "../components/ButtonField.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";

export default function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();

  const [apellido, setApellido] = useState<string>("")
  const [nombre, setNombre] = useState<string>("");
  const [fechaNacimiento, setFechaNacimiento] = useState<string>("")
  const [usuario, setUsuario] = useState<string>("");
  const [contraseña, setContraseña] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [tipoFecha, setTipoFecha] = useState<"text"|"date">("text");  

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try{
      const response = await registro(nombre, apellido, usuario, contraseña, fechaNacimiento, email);
      if(!response){
        throw new Error("Error en la solicitud")
      }
    alert("Registro exitoso");
    navigate("/");
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

  const handleContraseñaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContraseña(e.target.value);
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
                  value={contraseña}
                  onChange={handleContraseñaChange}
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

