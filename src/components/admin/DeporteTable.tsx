import type { Deporte } from "../../contexts/deporte";
import DeporteRow from "./DeporteRow";
import "../cssComponentes/DeporteTable.css";

export default function DeportesTable({
  deportes,
  onEdit,
  onDelete,
  loading
}: {
  deportes: Deporte[];
  onEdit: (d: Deporte) => void;
  onDelete: (d: Deporte) => void;
  loading: boolean;
}) {
  return (
    <div className="table-responsive custom-table-container no-mobile-hide">
      <table className="table custom-table mb-0">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Tipo</th>
            <th>Mínimo de jugadores</th>
            <th>Máximo de jugadores</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-5 text-muted-custom">
                <div className="spinner-border text-primary" role="status"></div>
              </td>
            </tr>
            ) :deportes.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-5 text-muted-custom">
                No se encontraron deportes
              </td>
            </tr>
          ) : (
            deportes.map((d) => (
              <DeporteRow key={d.id} deporte={d} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}