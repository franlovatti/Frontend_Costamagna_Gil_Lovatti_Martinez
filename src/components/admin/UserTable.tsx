import type { User } from "../../contexts/auth.tsx";
import UserRow from "./UserRow";
import "../cssComponentes/DeporteTable.css";

export default function UserTable({
  usuarios,
  onEdit,
  onDelete,
}: {
  usuarios: User[];
  onEdit: (u: User) => void;
  onDelete: (u: User) => void;
}) {
  return (
    <div className="table-responsive custom-table-container">
      <table className="table custom-table mb-0">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-5 text-muted-custom">
                No se encontraron usuarios
              </td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <UserRow key={u.id} user={u} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}