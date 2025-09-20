import { useState } from 'react';
import { InputField } from '../components/InputField.tsx';
import { Button, Submit } from '../components/ButtonField.tsx';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const { login, loading: cargandoAuth, error } = useAuth();
  const navigate = useNavigate();

  type LoginFormFields = {
    usuario: string;
    contraseña: string;
    remember: boolean;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormFields>({
    mode: 'onBlur',
  });

  const [loading, setLoading] = useState<boolean>(false);

  //Falta la logica del remember
  const onSubmit = async (data: LoginFormFields) => {
    setLoading(true);
    try {
      const success = await login(data.usuario, data.contraseña, data.remember);
      if (!success) {
        throw new Error('Credenciales inválidas');
      }
      navigate('/home');
    } catch (error) {
      console.error('Error al iniciar sesion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div
        className="bg-white p-4 rounded shadow w-50"
        style={{ maxWidth: '400px' }}
      >
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <InputField
              type="text"
              placeholder="Usuario o Dirección de correo electrónico"
              {...register('usuario', { required: true })}
            />
            {errors.usuario && (
              <span className="text-danger">Este campo es obligatorio</span>
            )}
          </div>
          <div className="mb-3">
            <InputField
              type="password"
              placeholder="Contraseña"
              {...register('contraseña', { required: true })}
            />
            {errors.contraseña && (
              <span className="text-danger">Este campo es obligatorio</span>
            )}
          </div>
          <div className="mb-3">
            <label className="checkbox-label">
              <input type="checkbox" {...register('remember')} />
              <span>Recordarme</span>
            </label>
          </div>
          <div className="d-flex justify-content-between">
            <Button
              className="btn btn-primary"
              onClick={() => (window.location.href = '/Registro')}
            >
              Registrarse
            </Button>
            <Submit className="btn btn-primary" disabled={loading}>
              {loading ? 'Enviando...' : 'Aceptar'}
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
};

export default Login;
