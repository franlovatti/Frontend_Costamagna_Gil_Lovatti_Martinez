// FiltroSelect.tsx
interface FiltroSelectProps {
  title: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

const FiltroSelect = ({ 
  title,
  label, 
  value, 
  onChange, 
  options,
  placeholder = "Seleccionar..."
}: FiltroSelectProps) => {
  return (
    <div className="filtro-group">
      {title && <h4 className="filtro-group-title">{title}</h4>}
      <div className="filtro-field">
        <label className="filtro-label">{label}</label>
        <select
          className="filtro-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FiltroSelect;