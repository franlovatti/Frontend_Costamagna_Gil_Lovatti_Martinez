import type { Noticia } from '../types';

export default function NoticiaRow({
  noticia,
  onEdit,
  onDelete,
}: {
  noticia: Noticia;
  onEdit: (n: Noticia) => void;
  onDelete: (n: Noticia) => void;
}) {
  const fechaStr = noticia.fecha
    ? new Date(noticia.fecha).toLocaleDateString()
    : '';
  return (
    <tr>
      <td>{noticia.titulo}</td>
      <td>{noticia.descripcion}</td>
      <td>{fechaStr || '—'}</td>
      <td>
        <button className="btn-action me-2" onClick={() => onEdit(noticia)}>
          ✏️ Editar
        </button>
        <button
          className="btn-action btn-delete"
          onClick={() => onDelete(noticia)}
        >
          🗑️ Eliminar
        </button>
      </td>
    </tr>
  );
}
