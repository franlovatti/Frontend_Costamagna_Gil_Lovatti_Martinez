// FiltroRange.tsx
interface FiltroRangeProps {
  title: string;
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  step?: number;
}

const FiltroRango = ({ 
  title,
  min, 
  max, 
  valueMin, 
  valueMax, 
  onMinChange, 
  onMaxChange,
  step = 1
}: FiltroRangeProps) => {
  return (
    <div className="filtro-group">
        {title && <h4 className="filtro-group-title">{title}</h4>}
      <div className="filtro-group">
        
        <div className="filtro-row">
          <div className="filtro-field">
            <label className="filtro-label">Mínimo</label>
            <input
              type="number"
              className="filtro-input"
              value={valueMin}
              onChange={(e) => onMinChange(Number(e.target.value))}
              min={min}
              max={max}
              step={step}
            />
          </div>

          <div className="filtro-field">
            <label className="filtro-label">Máximo</label>
            <input
              type="number"
              className="filtro-input"
              value={valueMax}
              onChange={(e) => onMaxChange(Number(e.target.value))}
              min={min}
              max={max}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltroRango;