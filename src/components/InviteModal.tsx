import React, { useState, useEffect, useRef } from 'react';
import { useInvitacion } from '../hooks/useInvitacion.tsx';

interface InviteModalProps {
  equipoId: number;
  isOpen: boolean;
  onClose: () => void;
}

export function InviteModal({ equipoId, isOpen, onClose }: InviteModalProps) {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const operationInProgress = useRef(false);
  const { enviarInvitacion, error, loading } = useInvitacion();

  // Watch for loading state changes to detect when the async operation completes
  useEffect(() => {
    // If an operation was in progress and now loading is false, it completed
    if (operationInProgress.current && !loading) {
      operationInProgress.current = false;
      if (!error) {
        setSuccess(true);
        setEmail('');
        setTimeout(() => {
          onClose();
          setSuccess(false);
        }, 2000);
      }
    }
  }, [loading, error, onClose]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSuccess(false);
    operationInProgress.current = true;
    enviarInvitacion(equipoId, email);
  }

  function handleClose() {
    if (!(loading && operationInProgress.current)) {
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
            disabled={loading && operationInProgress.current}
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
                    disabled={loading && operationInProgress.current}
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
              disabled={loading && operationInProgress.current}
            >
              Cancelar
            </button>
            {!success && (
              <button
                type="submit"
                className="action-btn btn-primary-action"
                disabled={
                  (loading && operationInProgress.current) || !email.trim()
                }
              >
                {loading && operationInProgress.current
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
