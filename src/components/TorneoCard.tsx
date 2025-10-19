import type { Torneo } from "../contexts/torneo.tsx";
import { useNavigate } from "react-router-dom";
import "./cssComponentes/TorneoCard.css";

export default function TorneoCard({
  torneo,
  onEdit,
  onDelete,
}: {
  torneo: Torneo;
  onEdit: (d: Torneo) => void;
  onDelete: (d: Torneo) => void;
}) {

  const toDate = (v?: string | Date | null): Date | null => {
    if (!v) return null;
    const d = typeof v === "string" ? new Date(v) : v;
    return isNaN(d.getTime()) ? null : d;
  };

  const fmtDate = (v?: string | Date | null) => {
    const d = toDate(v);
    return d ? d.toLocaleDateString() : "";
  };

  const navigate = useNavigate();
  const deporte = torneo.deporte ?? null;
  const isIndividual = deporte?.cantMaxJugadores === 1;

  return (

<div key={torneo.id} className="col-12 col-md-6 col-lg-4" role="button" onClick={() => navigate(`/home/torneos/${torneo.id}`)}>
  <div className="torneo-card h-100">
    <div className="d-flex justify-content-between align-items-start mb-3">
      <h3 className="torneo-nombre mb-0">{torneo.nombre}</h3>
      <span
        className={`badge-custom ${
          isIndividual ? "badge-equipo" : "badge-individual"
        }`}
      >
        {isIndividual ? "Individual" : "Equipo"}
      </span>
    </div>
    
    <div className="torneo-info mb-3">
      <p className="torneo-descripcion mb-0">Deporte: {deporte?.nombre}</p>
      <div className="d-flex align-items-center gap-2 mb-2">
        <span className="info-icon">👥</span>
        <span className="info-text">{torneo.cantEquiposMax} equipos</span>
      </div>

      <p className="torneo-descripcion mb-0">Fechas de inscripcion {fmtDate(torneo.fechaInicioInscripcion)} - {fmtDate(torneo.fechaFinInscripcion)}</p>
      {torneo.fechaInicioEvento && torneo.fechaFinEvento && (
        <p className="torneo-descripcion mb-0">Fechas del evento {fmtDate(torneo.fechaInicioEvento)} - {fmtDate(torneo.fechaFinEvento)}</p>
      )}
    </div>
    
    <div className="d-flex gap-2 mt-auto">
      <button className="btn-action flex-grow-1" onClick={(e) =>{e.stopPropagation(); onEdit(torneo);}}>
        ✏️ Editar
      </button>
      <button className="btn-action btn-delete flex-grow-1" onClick={(e) =>{e.stopPropagation(); onDelete(torneo);}}>
        🗑️ Eliminar
      </button>
    </div>
  </div>
</div>
  );
}