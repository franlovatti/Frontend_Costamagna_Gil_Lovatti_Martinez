interface FiltroFechasProps {
  fechaDesde: string;
  fechaHasta: string;
  onFechaDesdeChange: (fecha: string) => void;
  onFechaHastaChange: (fecha: string) => void;
  label?: string;
}

const FiltroFechas = ({ 
  fechaDesde, 
  fechaHasta, 
  onFechaDesdeChange, 
  onFechaHastaChange,
  label = "Rango de fechas"
}: FiltroFechasProps) => {
  return (
    <div className="filtro-group">
      {label && <h4 className="filtro-group-title">{label}</h4>}
      
      <div className="filtro-row">
        <div className="filtro-field">
          <label className="filtro-label">Desde</label>
          <input
            type="date"
            className="filtro-input"
            value={fechaDesde}
            onChange={(e) => onFechaDesdeChange(e.target.value)}
          />
        </div>

        <div className="filtro-field">
          <label className="filtro-label">Hasta</label>
          <input
            type="date"
            className="filtro-input"
            value={fechaHasta}
            onChange={(e) => onFechaHastaChange(e.target.value)}
            min={fechaDesde || undefined}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltroFechas;