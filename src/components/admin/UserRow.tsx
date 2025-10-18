import type { User } from "../../contexts/auth";

export default function UserRow({
  user,
  onEdit,
  onDelete,
}: {
  user: User;
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}) {
  return (
    <tr>
      <td>{user.usuario}</td>
      <td>{user.nombre}</td>
      <td>{user.apellido}</td>
      <td>{user.email}</td>
      <td>
        <span
          className={`badge-custom ${
            user.role === "Administrador" ? "badge-equipo" : "badge-individual"
          }`}
        >
          {user.role === "Administrador" ? "Admin" : "Usuario"}
        </span>
      </td>
      <td>{user.estado ? 'Activo' : 'Inactivo'}</td>
      <td>
        <button className="btn-action me-2" onClick={() => onEdit(user)}>
          ✏️ Cambiar rol
        </button>
        <button className="btn-action btn-delete" onClick={() => onDelete(user)}>
          🗑️ Suspender
        </button>
      </td>
    </tr>
  );
}