import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth.tsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const { login, loading: cargandoAuth, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: Location })?.from;
  const redirectTo = from
    ? `${from.pathname}${from.search}${from.hash}`
    : '/home';

  type LoginFormFields = {
    usuario: string;
    contrasenia: string;
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

  const onSubmit = async (data: LoginFormFields) => {
    setLoading(true);
    try {
      const success = await login(
        data.usuario,
        data.contrasenia,
        data.remember,
      );
      if (!success) {
        throw new Error('Credenciales inválidas');
      }
      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error('Error al iniciar sesion:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title mb-4">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="auth-form-group">
            <input
              type="text"
              className="auth-input"
              placeholder="Usuario o Dirección de correo electrónico"
              {...register('usuario', { required: true })}
            />
            {errors.usuario && (
              <span className="auth-error-text">Este campo es obligatorio</span>
            )}
          </div>

          <div className="auth-form-group">
            <input
              type="password"
              className="auth-input"
              placeholder="contrasenia"
              {...register('contrasenia', { required: true })}
            />
            {errors.contrasenia && (
              <span className="auth-error-text">Este campo es obligatorio</span>
            )}
          </div>

          <div className="auth-checkbox-container">
            <input
              type="checkbox"
              id="remember"
              className="auth-checkbox"
              {...register('remember')}
            />
            <label htmlFor="remember" className="auth-checkbox-label">
              Recordarme
            </label>
          </div>

          <div className="auth-button-group">
            <button
              type="button"
              className="auth-btn auth-btn-secondary"
              onClick={() => {
                setError(null);
                navigate('/Registro');
              }}
            >
              Registrarse
            </button>
            <button
              type="submit"
              className="auth-btn auth-btn-primary"
              disabled={loading || cargandoAuth}
            >
              {loading ? 'Iniciando...' : 'Iniciar Sesión'}
            </button>
          </div>

          {cargandoAuth && (
            <div className="auth-spinner-container">
              <div className="auth-spinner"></div>
            </div>
          )}

          {error && <div className="auth-error-alert">{error}</div>}

          <div className="auth-link-container">
            <Link to="/ForgotPassword" className="auth-link">
              ¿Olvidaste tu contrasenia?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
