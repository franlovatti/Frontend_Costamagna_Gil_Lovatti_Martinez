import "./cssComponentes/SearchBar.css";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onCreate: () => void;
  crear: string;
}

export default function SearchBar({ value, onChange, onCreate, crear }: Props) {
  return (
    <div className="d-flex align-items-center gap-3 mb-4 search-bar-row">
      <input
        type="text"
        className="form-control search-input flex-grow-1"
        placeholder={`Buscar ${crear}s...`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button
        className="btn btn-primary-custom d-flex align-items-center gap-2 mt-2 mt-sm-0"
        onClick={onCreate}
        style={{ whiteSpace: "nowrap" }}
      >
        <span>➕</span>
        Crear {crear}
      </button>
    </div>
  );
}