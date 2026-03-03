import type { Equipo } from "../contexts/equipo.tsx";

export default function ModalInscripcion({
  selectedTeam,
  enrollPassword,
  setEnrollPassword,
  setShowEnrollModal,
  handleInscribe,
  enrollError,
  errorInscribirse,
  loadingInscribirse,
}: {
  selectedTeam?: Equipo | null;
  enrollPassword: string;
  setEnrollPassword: (password: string) => void;
  setShowEnrollModal: (show: boolean) => void;
  handleInscribe: () => void;
  enrollError?: string | null;
  errorInscribirse?: string | null;
  loadingInscribirse: boolean;
}) {
  return (
    <div
      className="modal-custom-overlay"
      onClick={() => setShowEnrollModal(false)}
    >
      <div
        className="modal-custom-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-custom-header">
          <h2 className="modal-custom-title">
            Inscribirse en {selectedTeam?.nombre}
          </h2>
          <button
            className="modal-custom-close"
            onClick={() => setShowEnrollModal(false)}
          >
            ✕
          </button>
        </div>
        <div className="modal-custom-body">
          {(enrollError || errorInscribirse) && (
            <div className="alert-danger-custom">
              {enrollError || errorInscribirse}
            </div>
          )}
          {selectedTeam && !selectedTeam.esPublico ? (
            <div className="modal-form-group">
              <label className="modal-form-label">contrasenia del equipo</label>
              <input
                type="password"
                className="modal-form-input"
                value={enrollPassword}
                onChange={(e) => setEnrollPassword(e.target.value)}
                placeholder="Ingrese la contrasenia"
                autoFocus
              />
            </div>
          ) : (
            <p className="modal-info-text">
              Este equipo es público. Confirme para inscribirse.
            </p>
          )}
        </div>
        <div className="modal-custom-footer">
          <button
            className="btn-cancel-custom"
            onClick={() => setShowEnrollModal(false)}
          >
            Cancelar
          </button>
          <button
            className="btn-save-custom"
            onClick={handleInscribe}
            disabled={loadingInscribirse}
          >
            {loadingInscribirse ? 'Inscribiendo...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
