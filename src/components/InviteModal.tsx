import React, { useState, useEffect } from 'react';
import { useInvitacion } from '../hooks/useInvitacion.tsx';

interface InviteModalProps {
  equipoId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ equipoId, isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [operationInProgress, setOperationInProgress] = useState(false);
  const { enviarInvitacion, error, loading } = useInvitacion();

  useEffect(() => {
    if (operationInProgress && !loading) {
      setOperationInProgress(false);
      if (!error) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    }
  }, [loading, error, onClose, operationInProgress]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSuccess(false);
    setOperationInProgress(true);
    enviarInvitacion(equipoId, email);
  }

  function handleClose() {
    if (!(loading && operationInProgress)) {
      onClose();
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
            disabled={loading && operationInProgress}
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
                    disabled={loading && operationInProgress}
                  />
                </div>
                {error && <div className="alert-danger-custom">⚠️ {error}</div>}
              </>
            )}
          </div>
          <div className="modal-footer-participacion">
            <button
              type="button"
              className="btn-cancel-custom"
              onClick={handleClose}
              disabled={loading && operationInProgress}
            >
              Cancelar
            </button>
            {!success && (
              <button
                type="submit"
                className="action-btn btn-primary-action"
                disabled={
                  (loading && operationInProgress) || !email.trim()
                }
              >
                {loading && operationInProgress
                  ? 'Enviando...'
                  : 'Enviar Invitación'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
