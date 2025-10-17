import type { Noticia } from '../contexts/noticia.tsx';
import NoticiaRow from './NoticiaRow';
import './cssComponentes/DeporteTable.css';

export default function NoticiaTable({
  noticias,
  onEdit,
  onDelete,
}: {
  noticias: Noticia[];
  onEdit: (n: Noticia) => void;
  onDelete: (n: Noticia) => void;
}) {
  return (
    <div className="table-responsive custom-table-container">
      <table className="table custom-table mb-0">
        <thead>
          <tr>
            <th>Título</th>
            <th>Contenido</th>
            <th>Fecha de Publicación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {noticias.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-5 text-muted-custom">
                No se encontraron noticias
              </td>
            </tr>
          ) : (
            noticias.map((n) => (
              <NoticiaRow
                key={n.id}
                noticia={n}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}