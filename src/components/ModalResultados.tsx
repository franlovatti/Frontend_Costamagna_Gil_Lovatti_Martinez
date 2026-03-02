import type { Partido } from "../contexts/partido.tsx";

export default function ModalResultados(
  { 
    partidoSeleccionado,
    resultadoLocal,
    setResultadoLocal,
    resultadoVisitante,
    setResultadoVisitante,
    handleCargarResultado,
    setResultadoModal,
    errorCargarResultados,
    loadingCargarResultados,
   }
  : {
    partidoSeleccionado: Partido;
    resultadoLocal: string;
    setResultadoLocal: (resultado: string) => void;
    resultadoVisitante: string;
    setResultadoVisitante: (resultado: string) => void;
    handleCargarResultado: () => void;
    setResultadoModal: (show: boolean) => void;
    errorCargarResultados?: string | null;
    loadingCargarResultados: boolean;
  }) {
  return (
    <div
        className="modal-custom-overlay"
        onClick={() => setResultadoModal(false)}
      >
        <div
          className="modal-custom-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-custom-header">
            <h2 className="modal-custom-title">Resultado del Partido</h2>
            <button
              className="modal-custom-close"
              onClick={() => setResultadoModal(false)}
            >
              ✕
            </button>
          </div>
          <div className="modal-custom-body">
            <p className="modal-info-text">
              {partidoSeleccionado.equipoLocal.nombre} vs{' '}
              {partidoSeleccionado.equipoVisitante.nombre}
            </p>
            {errorCargarResultados && (
              <div className="alert-danger-custom">{errorCargarResultados}</div>
            )}
            <div className="resultado-inputs-grid">
              <div className="modal-form-group">
                <label className="modal-form-label">Goles Local</label>
                <input
                  type="number"
                  min="0"
                  className="modal-form-input"
                  value={resultadoLocal}
                  onChange={(e) => setResultadoLocal(e.target.value)}
                  placeholder="0"
                  autoFocus
                />
              </div>
              <div className="modal-form-group">
                <label className="modal-form-label">Goles Visitante</label>
                <input
                  type="number"
                  min="0"
                  className="modal-form-input"
                  value={resultadoVisitante}
                  onChange={(e) => setResultadoVisitante(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="modal-custom-footer">
            <button
              className="btn-cancel-custom"
              onClick={() => setResultadoModal(false)}
            >
              Cancelar
            </button>
            <button
              className="btn-save-custom"
              onClick={handleCargarResultado}
              disabled={loadingCargarResultados}
            >
              {loadingCargarResultados ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </div>
      </div>
  );
}