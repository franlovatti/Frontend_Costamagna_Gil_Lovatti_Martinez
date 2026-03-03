import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Usuario } from '../contexts/usuario';
import { useEquipos } from '../hooks/useEquipos';
import type { Equipo } from '../contexts/equipo.tsx';
import { Row, Col } from 'react-bootstrap';
import { InviteModal } from '../components/InviteModal';
import ConfirmModal from '../components/ConfirmModal.tsx';

export default function EditarEquipo() {
  const { id } = useParams() as { id?: string };
  const { user } = useAuth();
  const navigate = useNavigate();

  const [equipo, setEquipo] = useState<Equipo | null>(null);

  const { obtenerEquipo, editarEquipo, removerMiembro, loading, error } =
    useEquipos();

  useEffect(() => {
    const fetchEquipo = async () => {
      const data = await obtenerEquipo(Number(id));
      setEquipo(data);
      setNameInput(data.nombre ?? '');
      setPasswordInput('');
    };
    fetchEquipo();
  }, [obtenerEquipo, id]);

  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | number | null>(
    null,
  );
  const [showInviteModal, setShowInviteModal] = useState(false);

  const userIdStr = user ? String(user.id) : undefined;
  const capId = String(equipo?.capitan.id);

  function handleRemoveMember(memberId: string | number) {
    setMemberToRemove(memberId);
    setShowRemoveModal(true);
  }

  async function confirmRemoveMember() {
    if (!id || memberToRemove == null) return;
    const success = await removerMiembro(Number(id), Number(memberToRemove));
    if (success) {
      setMemberToRemove(null);
      const data = await obtenerEquipo(Number(id));
      setEquipo(data);
    }
    setShowRemoveModal(false);
  }

  async function handleSaveAll(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!id) return;
    const success = await editarEquipo(Number(id), {
      nombre: nameInput,
      contrasenia: passwordInput?.trim() || '',
    });
    if (success) {
      setPasswordInput('');
      const data = await obtenerEquipo(Number(id));
      setEquipo(data);
    }
  }

  if (loading || !equipo) {
    return (
      <div className="torneo-detalle-container">
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Cargando equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="torneo-detalle-container">
      <div className="torneo-detalle-inner">
        {/* Header con información del equipo */}
        <div className="detalle-header">
          <div className="header-content">
            <div className="header-title-section">
              <h1 className="detalle-title">{equipo.nombre}</h1>
              <span
                className={`badge-custom ${
                  equipo.esPublico ? 'badge-equipo' : 'badge-individual'
                }`}
              >
                {equipo.esPublico ? 'Público' : 'Privado'}
              </span>
            </div>
          </div>
          <Row>
            <Col md={6}>
              <p className="detalle-description">
                <strong>Capitán:</strong> {equipo.nombreCapitan}
              </p>
            </Col>
            <Col md={6}>
              <p className="detalle-description">
                <strong>Puntos:</strong> {equipo.puntos}
              </p>
            </Col>
          </Row>
        </div>

        {/* Error de conexión */}
        {error && loading && (
          <div className="alert-danger-custom">⚠️ {error}</div>
        )}

        {/* Formulario de edición (solo si es capitán) */}
        {capId === userIdStr && (
          <div className="crear-participacion-card">
            <h3 className="card-title-participacion">Editar Equipo</h3>
            <form onSubmit={handleSaveAll}>
              <Row>
                <Col md={equipo.esPublico ? 12 : 6}>
                  <div className="form-group-custom">
                    <label className="form-label-custom">
                      Nombre del equipo
                    </label>
                    <input
                      className="form-input-custom"
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      required
                    />
                  </div>
                </Col>
                {!equipo.esPublico && (
                  <Col md={6}>
                    <div className="form-group-custom">
                      <label className="form-label-custom">
                        Nueva contrasenia (opcional)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="form-input-custom"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Dejar vacío para no cambiar"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--text-muted)',
                            fontSize: '1.2rem',
                          }}
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    </div>
                  </Col>
                )}
              </Row>
            </form>
          </div>
        )}

        {/* Lista de miembros */}
        <div className="section-container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}
          >
            <h2 className="section-title">Miembros del Equipo</h2>
            {capId === userIdStr && (
              <button
                className="action-btn btn-primary-action flex-grow-0"
                onClick={() => setShowInviteModal(true)}
                style={{ padding: '8px 16px', fontSize: '0.9rem' }}
              >
                + Invitar Miembro
              </button>
            )}
          </div>
          <div className="custom-table-container no-mobile-hide">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  {capId === userIdStr && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(equipo.miembros) &&
                equipo.miembros.length > 0 ? (
                  (equipo.miembros as Usuario[]).map((miembro, idx) => {
                    const memberId = miembro.id ?? miembro.usuario ?? '';
                    const memberIdStr = String(memberId);
                    const capIdLocal = String(equipo.capitan.id);
                    const isMemberCaptain = capIdLocal === memberIdStr;
                    return (
                      <tr key={memberIdStr}>
                        <td>{idx + 1}</td>
                        <td className="team-name-cell">
                          {miembro.nombre ?? miembro.usuario ?? memberIdStr}
                        </td>
                        <td>
                          {isMemberCaptain && (
                            <span className="jugadores-badge">Capitán</span>
                          )}
                        </td>
                        {capId === userIdStr && (
                          <td>
                            {!isMemberCaptain && (
                              <button
                                className="btn-action btn-delete btn-small"
                                onClick={() => handleRemoveMember(memberId)}
                              >
                                Eliminar
                              </button>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={capId === userIdStr ? 4 : 3}
                      className="empty-state-cell"
                    >
                      No hay miembros listados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="action-buttons-section">
          <button
            className="action-btn btn-secondary-action"
            onClick={() => navigate(-1)}
          >
            ← Volver
          </button>
          {capId === userIdStr && (
            <button
              className="action-btn btn-primary-action"
              onClick={() => handleSaveAll()}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Guardando...
                </>
              ) : (
                <>Guardar Cambios</>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar miembro */}
      {showRemoveModal && (
        <ConfirmModal
          objeto={'eliminar al miembro del equipo'}
          setShowConfirm={setShowRemoveModal}
          handleConfirmDelete={confirmRemoveMember}
          handleCancelDelete={() => {
            setShowRemoveModal(false);
            setMemberToRemove(null);
          }}
        />
      )}

      {/* Modal para invitar miembros */}
      {showInviteModal && id && (
        <InviteModal
          equipoId={Number(id)}
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}
