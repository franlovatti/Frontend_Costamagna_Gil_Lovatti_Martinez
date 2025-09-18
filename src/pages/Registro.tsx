import { useState } from "react";
import { InputField } from "../components/InputField.tsx";
import {Button, Submit} from "../components/ButtonField.tsx";
import { useAuth } from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function Registro() {
  const { registro, loading: cargandoAuth, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tipoFecha, setTipoFecha] = useState<"text"|"date">("text");

  type RegistroFormFields = {
    nombre: string;
    apellido: string;
    usuario: string;
    email: string;
    contraseña: string;
    fechaNacimiento: string;
    remember: boolean;
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegistroFormFields>({ mode: 'onBlur' });

  const onSubmit = async (data: RegistroFormFields) => {
    setLoading(true);
    try {
      const response = await registro(
        data.nombre,
        data.apellido,
        data.usuario,
        data.contraseña,
        data.fechaNacimiento,
        data.email,
        data.remember
      );
      if (!response) {
        throw new Error("Error en la solicitud");
      }
      navigate("/");
    } catch (error) {
      console.error("Error al Registrarse:", error);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
        <h2 className="text-center mb-4">Registrarse</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="mb-3">
              <InputField
                type="text"
                placeholder="Nombres"
                {...register("nombre", { required: true })}
              />
              {errors.nombre && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className="mb-3">
              <InputField
                type="text"
                placeholder="Apellidos"
                {...register("apellido", { required: true })}
              />
              {errors.apellido && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className="mb-3">
              <InputField
                type="text"
                placeholder="Usuario"
                {...register("usuario", { required: true })}
              />
              {errors.usuario && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className="mb-3">
              <InputField
                type="text"
                placeholder="Direccion de correo electronico"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className="mb-3">
              <InputField
                type="password"
                placeholder="Contraseña"
                {...register("contraseña", { required: true })}
              />
              {errors.contraseña && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className="mb-3">
              <input
                type={tipoFecha}
                placeholder="Fecha de Nacimiento"
                className="form-control"
                {...register("fechaNacimiento", { required: true })}
                onFocus={() => setTipoFecha("date")}
                onBlur={e => {
                  if (!e.target.value) setTipoFecha("text");
                }}
              />
              {errors.fechaNacimiento && <span className="text-danger">Este campo es obligatorio</span>}
            </div>
            <div className="mb-3">
              <label className="checkbox-label">
                <input type="checkbox" {...register("remember")} />
                <span>Recordarme</span>
              </label>
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
          {cargandoAuth && (
          <div className="d-flex justify-content-center my-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
          )}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
          <div className="text-center mt-3">
            <Link to="/ForgotPassword">¿Olvidaste tu contraseña?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

