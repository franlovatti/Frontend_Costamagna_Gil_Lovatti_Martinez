import type { Deporte } from "../contexts/deporte";

export default function DeporteRow({
  deporte,
  onEdit,
  onDelete,
}: {
  deporte: Deporte;
  onEdit: (d: Deporte) => void;
  onDelete: (d: Deporte) => void;
}) {
  return (
    <tr>
      <td>{deporte.nombre}</td>
      <td>
        <span
          className={`badge-custom ${
            deporte.cantMaxJugadores === 1 ? "badge-equipo" : "badge-individual"
          }`}
        >
          {deporte.cantMaxJugadores === 1 ? "Individual" : "Equipo"}
        </span>
      </td>
      <td>{deporte.cantMinJugadores}</td>
      <td>{deporte.cantMaxJugadores}</td>
      <td>{deporte.duracion}</td>
      <td>
        <button className="btn-action me-2" onClick={() => onEdit(deporte)}>
          ✏️ Editar
        </button>
        <button className="btn-action btn-delete" onClick={() => onDelete(deporte)}>
          🗑️ Eliminar
        </button>
      </td>
    </tr>
  );
}