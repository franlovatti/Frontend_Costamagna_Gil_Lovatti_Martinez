import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiAxios from '../helpers/api';
import { useAuth } from '../hooks/useAuth';
import type { Equipo, Usuario } from '../types';
import { Row, Col } from 'react-bootstrap';

export default function EditarEquipo() {
  const { id } = useParams() as { id?: string };
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | number | null>(
    null
  );
  const [removing, setRemoving] = useState(false);

  const fetchEquipo = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiAxios.get(`/equipos/${id}`);
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setEquipo(payload as Equipo);
    } catch (err) {
      console.error('Error fetching equipo:', err);
      setError('Error al cargar el equipo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEquipo();
  }, [fetchEquipo]);

  useEffect(() => {
    if (equipo) {
      setNameInput(equipo.nombre ?? '');
      setPasswordInput('');
    }
  }, [equipo]);

  const userIdStr = user ? String(user.id) : undefined;
  const capId = String(equipo?.capitan.id);

  function handleRemoveMember(memberId: string | number) {
    setMemberToRemove(memberId);
    setShowRemoveModal(true);
  }

  async function confirmRemoveMember() {
    if (!id || memberToRemove == null) return;
    setRemoving(true);
    try {
      const usuarioId = Number(memberToRemove);
      const res = await apiAxios.patch(`/equipos/${id}/miembros`, {
        usuarioId,
      });
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setEquipo(payload as Equipo);
      setShowRemoveModal(false);
      setMemberToRemove(null);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ??
          (err as Error).message ??
          'Error al eliminar miembro.'
      );
    } finally {
      setRemoving(false);
    }
  }

  async function handleSaveAll(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { nombre: nameInput };
      if (passwordInput && passwordInput.length > 0)
        payload['contraseña'] = passwordInput;
      const res = await apiAxios.patch(`/equipos/${id}`, payload);

      setEquipo(res.data.data);
      setPasswordInput('');
      navigate(`/home/equipos/${id}`);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ??
          (err as Error).message ??
          'Error al guardar cambios.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="torneo-detalle-container">
        <div className="loading-state">Cargando equipo...</div>
      </div>
    );

  if (error)
    return (
      <div className="torneo-detalle-container">
        <div className="torneo-detalle-inner">
          <div className="empty-state">
            <div className="empty-state-icon">⚠️</div>
            <p className="empty-state-text">{error}</p>
          </div>
        </div>
      </div>
    );

  if (!equipo)
    return (
      <div className="torneo-detalle-container">
        <div className="torneo-detalle-inner">
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <p className="empty-state-text">Equipo no encontrado</p>
          </div>
        </div>
      </div>
    );

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
                        Nueva contraseña (opcional)
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
          <h2 className="section-title">Miembros del Equipo</h2>
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
                {Array.isArray(equipo.miembros) && equipo.miembros.length > 0 ? (
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
          <button className="action-btn btn-secondary-action" onClick={() => navigate(-1)}>
            ← Volver
          </button>
          {capId === userIdStr && (
            <button
              className="action-btn btn-primary-action"
              onClick={() => handleSaveAll()}
              disabled={saving}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          )}
        </div>
      </div>

      {/* Modal de confirmación para eliminar miembro */}
      {showRemoveModal && (
        <div
          className="modal-overlay-participacion"
          onClick={() => {
            if (!removing) {
              setShowRemoveModal(false);
              setMemberToRemove(null);
            }
          }}
        >
          <div
            className="modal-content-participacion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-participacion">
              <h3 className="modal-title-participacion">Eliminar miembro</h3>
              <button
                className="modal-close-btn"
                onClick={() => {
                  if (!removing) {
                    setShowRemoveModal(false);
                    setMemberToRemove(null);
                  }
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body-participacion">
              <p>¿Seguro que querés eliminar a este miembro del equipo?</p>
            </div>
            <div className="modal-footer-participacion">
              <button
                className="btn-cancel-custom"
                onClick={() => {
                  setShowRemoveModal(false);
                  setMemberToRemove(null);
                }}
                disabled={removing}
              >
                Cancelar
              </button>
              <button
                className="btn-action btn-delete"
                onClick={confirmRemoveMember}
                disabled={removing}
              >
                {removing ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
