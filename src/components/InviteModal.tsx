import React, { useState } from 'react';
import apiAxios from '../helpers/api';

interface InviteModalProps {
  equipoId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ equipoId, isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await apiAxios.post('/invitaciones/enviar', {
        equipoId,
        emailInvitado: email.trim(),
      });
      setSuccess(true);
      setEmail('');
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ??
          (err as Error).message ??
          'Error al enviar invitación.',
      );
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      onClose();
      setEmail('');
      setError(null);
      setSuccess(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="modal-overlay-participacion" onClick={handleClose}>
      <div
        className="modal-content-participacion"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-participacion">
          <h3 className="modal-title-participacion">Invitar Miembro</h3>
          <button
            className="modal-close-btn"
            onClick={handleClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body-participacion">
            {success ? (
              <div
                style={{ color: 'green', textAlign: 'center', padding: '1rem' }}
              >
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✓</p>
                <p>¡Invitación enviada correctamente!</p>
              </div>
            ) : (
              <>
                <p style={{ marginBottom: '1rem' }}>
                  Ingresa el correo electrónico de la persona que deseas invitar
                  al equipo.
                </p>
                <div className="form-group-custom">
                  <label className="form-label-custom">
                    Correo electrónico
                  </label>
                  <input
                    className="form-input-custom"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    required
                    disabled={loading}
                  />
                </div>
                {error && (
                  <p
                    style={{
                      color: 'red',
                      marginTop: '0.5rem',
                      fontSize: '0.9rem',
                    }}
                  >
                    {error}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="modal-footer-participacion">
            <button
              type="button"
              className="btn-cancel-custom"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </button>
            {!success && (
              <button
                type="submit"
                className="action-btn btn-primary-action"
                disabled={loading || !email.trim()}
              >
                {loading ? 'Enviando...' : 'Enviar Invitación'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
