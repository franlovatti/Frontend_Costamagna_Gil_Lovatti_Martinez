import "../cssComponentes/DeportePopular.css";

export type DeportePopularProps = {
  deporte: {
    deporteId: number;
    deporte: string;
    totalEventos: number;
  };
  eventos: number;
};

export const DeportePopular = ({ deporte, eventos }: DeportePopularProps) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h4 className="deporte-nombre mb-1">{deporte.deporte}</h4>
          <p className="deporte-info mb-0">
            {deporte.totalEventos} eventos
          </p>
        </div>
        <span className="deporte-porcentaje">{eventos > 0 ? (deporte.totalEventos / eventos * 100).toFixed(2): 0}%</span>
      </div>
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${eventos > 0 ? (deporte.totalEventos / eventos * 100).toFixed(2): 0}%` }}
        ></div>
      </div>
    </div>
    );
};

export default DeportePopular;