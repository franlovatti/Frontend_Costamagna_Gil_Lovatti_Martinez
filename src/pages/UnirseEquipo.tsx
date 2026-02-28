import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import apiAxios from '../helpers/api';
import './Auth.css';

interface InvitacionData {
  emailInvitado: string;
  estado: string;
  expirada: boolean;
  aceptada: boolean;
  equipo: {
    id: number;
    nombre: string;
    esPublico: boolean;
  };
  evento: {
    id: number;
    nombre: string;
  } | null;
  capitan: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

export default function UnirseEquipo() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const token = searchParams.get('token');

  const [invitacion, setInvitacion] = useState<InvitacionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptError, setAcceptError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de invitación no proporcionado');
      setLoading(false);
      return;
    }

    const fetchInvitacion = async () => {
      try {
        const response = await apiAxios.get(`/invitaciones/${token}`);
        setInvitacion(response.data.data);
        setError(null);
      } catch (err: unknown) {
        const axiosError = err as {
          response?: { status?: number; data?: { message?: string } };
        };
        if (axiosError.response?.status === 404) {
          setError('Invitación no encontrada');
        } else {
          setError(
            axiosError.response?.data?.message ||
              'Error al cargar la invitación',
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchInvitacion();
  }, [token]);

  const handleAceptarInvitacion = async () => {
    if (!token) return;

    setAccepting(true);
    setAcceptError(null);

    try {
      await apiAxios.post('/invitaciones/aceptar', { token });
      setSuccess(true);

      // Redirect to team page after a short delay
      setTimeout(() => {
        if (invitacion?.equipo?.id) {
          navigate(`/home/equipos/${invitacion.equipo.id}`);
        } else {
          navigate('/home');
        }
      }, 2000);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      setAcceptError(
        axiosError.response?.data?.message || 'Error al aceptar la invitación',
      );
    } finally {
      setAccepting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-spinner-container">
            <div className="auth-spinner"></div>
          </div>
          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: 'var(--text-muted)',
            }}
          >
            Cargando invitación...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Invitación</h2>
          <div className="auth-error-alert">{error}</div>
          <div className="auth-button-group">
            <Link to="/home" className="auth-btn auth-btn-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!invitacion) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Invitación</h2>
          <div className="auth-error-alert">
            Datos de invitación no disponibles
          </div>
          <div className="auth-button-group">
            <Link to="/home" className="auth-btn auth-btn-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if invitation is expired
  if (invitacion.expirada) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Invitación Expirada</h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            La invitación para unirte al equipo{' '}
            <strong>{invitacion.equipo.nombre}</strong> ha expirado.
          </p>
          <div className="auth-button-group">
            <Link to="/home" className="auth-btn auth-btn-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if invitation is already accepted
  if (invitacion.aceptada) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Invitación Ya Utilizada</h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            Esta invitación ya ha sido utilizada para unirse al equipo{' '}
            <strong>{invitacion.equipo.nombre}</strong>.
          </p>
          <div className="auth-button-group">
            <Link
              to={`/home/equipos/${invitacion.equipo.id}`}
              className="auth-btn auth-btn-primary"
            >
              Ver Equipo
            </Link>
            <Link to="/home" className="auth-btn auth-btn-secondary">
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state after accepting
  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title" style={{ color: 'var(--success)' }}>
            ¡Te has unido al equipo!
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginBottom: '1.5rem',
            }}
          >
            Te has unido correctamente al equipo{' '}
            <strong>{invitacion.equipo.nombre}</strong>.
          </p>
          <div className="auth-spinner-container">
            <div className="auth-spinner"></div>
          </div>
          <p
            style={{
              textAlign: 'center',
              marginTop: '1rem',
              color: 'var(--text-muted)',
            }}
          >
            Redirigiendo al equipo...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Invitación</h2>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Has sido invitado a unirte al equipo:
          </p>
          <h3
            style={{
              textAlign: 'center',
              color: 'var(--primary)',
              marginBottom: '1rem',
            }}
          >
            {invitacion.equipo.nombre}
          </h3>

          {invitacion.evento && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              Evento: <strong>{invitacion.evento.nombre}</strong>
            </p>
          )}

          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginTop: '0.5rem',
            }}
          >
            Invitado por:{' '}
            <strong>
              {invitacion.capitan.nombre} {invitacion.capitan.apellido}
            </strong>
          </p>

          <p
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginTop: '0.5rem',
              fontSize: '0.85rem',
            }}
          >
            Correo: <strong>{invitacion.emailInvitado}</strong>
          </p>
        </div>

        {acceptError && (
          <div className="auth-error-alert" style={{ marginBottom: '1rem' }}>
            {acceptError}
          </div>
        )}

        {isAuthenticated ? (
          <>
            <div className="auth-button-group">
              <button
                className="auth-btn auth-btn-primary"
                onClick={handleAceptarInvitacion}
                disabled={accepting}
              >
                {accepting ? 'Uniéndose...' : 'Unirse al Equipo'}
              </button>
              <Link to="/home" className="auth-btn auth-btn-secondary">
                Cancelar
              </Link>
            </div>
          </>
        ) : (
          <>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}
            >
              Debes iniciar sesión para unirte al equipo.
            </p>
            <div className="auth-button-group">
              <Link
                to={`/Login?redirect=/unirse-equipo?token=${token}`}
                className="auth-btn auth-btn-primary"
              >
                Iniciar Sesión
              </Link>
              <Link to="/home" className="auth-btn auth-btn-secondary">
                Cancelar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
