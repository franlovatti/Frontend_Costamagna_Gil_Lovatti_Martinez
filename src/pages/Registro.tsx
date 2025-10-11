import { useState } from "react";
import { useAuth } from "../hooks/useAuth.tsx";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import "./Auth.css";

export default function Registro() {
  const { registro, loading: cargandoAuth, error } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [tipoFecha, setTipoFecha] = useState<"text" | "date">("text");

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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="auth-form-group">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nombre"
                  {...register("nombre", { required: true })}
                />
                {errors.nombre && (
                  <span className="auth-error-text">Este campo es obligatorio</span>
                )}
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="auth-form-group">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Apellido"
                  {...register("apellido", { required: true })}
                />
                {errors.apellido && (
                  <span className="auth-error-text">Este campo es obligatorio</span>
                )}
              </div>
            </div>
          </div>

          <div className="auth-form-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Usuario"
              {...register("usuario", { required: true })}
            />
            {errors.usuario && (
              <span className="auth-error-text">Este campo es obligatorio</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="email"
              className="auth-input"
              placeholder="Correo electrónico"
              {...register("email", { 
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Correo electrónico inválido"
                }
              })}
            />
            {errors.email && (
              <span className="auth-error-text">{errors.email.message}</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              className="auth-input"
              placeholder="Contraseña"
              {...register("contraseña", { 
                required: "Este campo es obligatorio",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres"
                }
              })}
            />
            {errors.contraseña && (
              <span className="auth-error-text">{errors.contraseña.message}</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type={tipoFecha}
              className="auth-input"
              placeholder="Fecha de Nacimiento"
              {...register("fechaNacimiento", { required: true })}
              onFocus={() => setTipoFecha("date")}
              onBlur={(e) => {
                if (!e.target.value) setTipoFecha("text");
              }}
            />
            {errors.fechaNacimiento && (
              <span className="auth-error-text">Este campo es obligatorio</span>
            )}
          </div>

          <div className="auth-checkbox-container">
            <input
              type="checkbox"
              id="remember"
              className="auth-checkbox"
              {...register("remember")}
            />
            <label htmlFor="remember" className="auth-checkbox-label">
              Recordarme
            </label>
          </div>

          <div className="auth-button-group">
            <button
              type="button"
              className="auth-btn auth-btn-secondary"
              onClick={() => navigate('/Login')}
            >
              Iniciar Sesión
            </button>
            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading || cargandoAuth}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </div>

          {cargandoAuth && (
            <div className="auth-spinner-container">
              <div className="auth-spinner"></div>
            </div>
          )}

          {error && (
            <div className="auth-error-alert">{error}</div>
          )}

          <div className="auth-link-container">
            <Link to="/ForgotPassword" className="auth-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// import { useState } from "react";
// import { InputField } from "../components/InputField.tsx";
// import {Button, Submit} from "../components/ButtonField.tsx";
// import { useAuth } from "../hooks/useAuth.tsx";
// import { useNavigate } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { Link } from "react-router-dom";

// export default function Registro() {
//   const { registro, loading: cargandoAuth, error } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [tipoFecha, setTipoFecha] = useState<"text"|"date">("text");

//   type RegistroFormFields = {
//     nombre: string;
//     apellido: string;
//     usuario: string;
//     email: string;
//     contraseña: string;
//     fechaNacimiento: string;
//     remember: boolean;
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }
//   } = useForm<RegistroFormFields>({ mode: 'onBlur' });

//   const onSubmit = async (data: RegistroFormFields) => {
//     setLoading(true);
//     try {
//       const response = await registro(
//         data.nombre,
//         data.apellido,
//         data.usuario,
//         data.contraseña,
//         data.fechaNacimiento,
//         data.email,
//         data.remember
//       );
//       if (!response) {
//         throw new Error("Error en la solicitud");
//       }
//       navigate("/");
//     } catch (error) {
//       console.error("Error al Registrarse:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return(
//     <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
//       <div className="bg-white p-4 rounded shadow w-50" style={{maxWidth: "400px" }}>
//         <h2 className="text-center mb-4">Registrarse</h2>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <div>
//             <div className="mb-3">
//               <InputField
//                 type="text"
//                 placeholder="Nombres"
//                 {...register("nombre", { required: true })}
//               />
//               {errors.nombre && <span className="text-danger">Este campo es obligatorio</span>}
//             </div>
//             <div className="mb-3">
//               <InputField
//                 type="text"
//                 placeholder="Apellidos"
//                 {...register("apellido", { required: true })}
//               />
//               {errors.apellido && <span className="text-danger">Este campo es obligatorio</span>}
//             </div>
//             <div className="mb-3">
//               <InputField
//                 type="text"
//                 placeholder="Usuario"
//                 {...register("usuario", { required: true })}
//               />
//               {errors.usuario && <span className="text-danger">Este campo es obligatorio</span>}
//             </div>
//             <div className="mb-3">
//               <InputField
//                 type="text"
//                 placeholder="Direccion de correo electronico"
//                 {...register("email", { required: true })}
//               />
//               {errors.email && <span className="text-danger">Este campo es obligatorio</span>}
//             </div>
//             <div className="mb-3">
//               <InputField
//                 type="password"
//                 placeholder="Contraseña"
//                 {...register("contraseña", { required: true })}
//               />
//               {errors.contraseña && <span className="text-danger">Este campo es obligatorio</span>}
//             </div>
//             <div className="mb-3">
//               <input
//                 type={tipoFecha}
//                 placeholder="Fecha de Nacimiento"
//                 className="form-control"
//                 {...register("fechaNacimiento", { required: true })}
//                 onFocus={() => setTipoFecha("date")}
//                 onBlur={e => {
//                   if (!e.target.value) setTipoFecha("text");
//                 }}
//               />
//               {errors.fechaNacimiento && <span className="text-danger">Este campo es obligatorio</span>}
//             </div>
//             <div className="mb-3">
//               <label className="checkbox-label">
//                 <input type="checkbox" {...register("remember")} />
//                 <span>Recordarme</span>
//               </label>
//             </div>
//           </div>
//           <div className="d-flex justify-content-between">
//             <Button className="btn btn-primary" onClick={() => window.location.href = '/Login'}>
//               Iniciar Sesion
//             </Button>
//             <Submit className="btn btn-primary" disabled={loading}>
//               {loading ? "Enviando..." : "Aceptar"}
//             </Submit>
//           </div>
//           {cargandoAuth && (
//           <div className="d-flex justify-content-center my-3">
//             <div className="spinner-border text-primary" role="status">
//               <span className="visually-hidden">Cargando...</span>
//             </div>
//           </div>
//           )}
//           {error && <div className="alert alert-danger mt-3">{error}</div>}
//           <div className="text-center mt-3">
//             <Link to="/ForgotPassword">¿Olvidaste tu contraseña?</Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

