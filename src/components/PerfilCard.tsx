import type { User } from "../contexts/auth.tsx"
import './cssComponentes/PerfilCard.css';

export default function PerfilCard(
  { usuario, onEdit }: 
  { usuario: User, onEdit: (d: User) => void }) {
  return (
    <div className="col-12 col-lg-4">
      <div className="perfil-card h-100">
        <div className="perfil-avatar-section">
          <div className="perfil-avatar">
              <span className="avatar-placeholder">
                {usuario.nombre? usuario.nombre[0] : ''}{usuario.apellido? usuario.apellido[0] : ''}
              </span>
          </div>
          <h2 className="perfil-nombre">{usuario.nombre} {usuario.apellido}</h2>
          <p className="perfil-usuario">@{usuario.usuario}</p>
        </div>

        <div className="perfil-info-section">
          <div className="info-item">
            <span className="info-icon">📧</span>
            <div className="info-content">
              <span className="info-label">Email</span>
              <span className="info-value">{usuario.email}</span>
            </div>
          </div>

          <div className="info-item">
            <span className="info-icon">🎂</span>
            <div className="info-content">
              <span className="info-label">Fecha de nacimiento</span>
              <span className="info-value">
                {usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toLocaleDateString() : "No disponible"}
              </span>
            </div>
          </div>
        </div>

        <button className="btn-action btn-primary-action w-100" onClick={() => onEdit(usuario)}>
          ✏️ Editar Perfil
        </button>
      </div>
    </div>
  )
};