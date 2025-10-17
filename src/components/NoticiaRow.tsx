import type { Noticia } from '../contexts/noticia.tsx';

export default function NoticiaRow({
  noticia,
  onEdit,
  onDelete,
}: {
  noticia: Noticia;
  onEdit: (n: Noticia) => void;
  onDelete: (n: Noticia) => void;
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


  return (
    <tr>
      <td>{noticia.titulo}</td>
      <td>{noticia.descripcion}</td>
      <td>{fmtDate(noticia.fecha)}</td>
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