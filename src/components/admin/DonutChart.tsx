import "../cssComponentes/DonutChart.css";

interface DonutChartProps {
  publicos: number;
  totales: number;
}

const DonutChart = ({ publicos, totales }: DonutChartProps) => {
  return (
    <div>
      <h2 className="card-title mb-4">Distribución de Torneos</h2>
      <div className="distribucion-container">
        <div className="donut-chart">
          <svg viewBox="0 0 100 100" className="donut-svg">
            <circle cx="50" cy="50" r="40" className="donut-ring"></circle>
            <circle 
              cx="50" 
              cy="50" 
              r="40" 
              className="donut-segment"
              style={{
                strokeDasharray: `${(publicos / totales) * 251} 251`
              }}
            ></circle>
          </svg>
          <div className="donut-center">
            <span className="donut-total">{totales}</span>
            <span className="donut-label">Total</span>
          </div>
        </div>
        <div className="distribucion-legend">
          <div className="legend-item">
            <span className="legend-dot legend-dot-publico"></span>
            <span className="legend-text">Públicos</span>
            <span className="legend-value">{publicos}</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot-privado"></span>
            <span className="legend-text">Privados</span>
            <span className="legend-value">{totales - publicos}</span>
          </div>
        </div>
      </div>
    </div>
);
}

export default DonutChart;
