import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { Usuario, Participation } from '../types.tsx';
import type {
  ParticipacionPayload,
  ParticipacionEditPayload,
} from '../DTOs/participacionesDTO.tsx';
import type { Partido } from '../contexts/partido.tsx';
import './Participacion.css';
import { useParticipacion } from '../hooks/useParticipaciones.tsx';
import { usePartidos } from '../hooks/usePartidos.tsx';
import ConfirmModal from '../components/ConfirmModal.tsx';

export default function CrearParticipacion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [partido, setPartido] = useState<Partido | null>(null);
  const {
    crearParticipacion,
    editarParticipacion,
    borrarParticipacion,
    getParticipacionesPartidoEquipo,
    loading,
    error,
    participaciones,
  } = useParticipacion();

  const { getOnePartido } = usePartidos();

  useEffect(() => {
    const fetchPartido = async () => {
      if (!id) return;

      const data = await getOnePartido(Number(id));
      setPartido(data);
    };
    fetchPartido();
  }, [id, getOnePartido]);

  const [miembrosLocal, setMiembrosLocal] = useState<Usuario[]>([]);
  const [miembrosVisitante, setMiembrosVisitante] = useState<Usuario[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<
    'local' | 'visitante'
  >('local');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editForm, setEditForm] = useState({
    usuarioId: '',
    minutosjugados: '',
    faltas: '',
    puntos: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [participacionAEliminar, setParticipacionAEliminar] =
    useState<Participation | null>(null);
  const [form, setForm] = useState({
    usuarioId: '',
    minutosjugados: '',
    faltas: '',
    puntos: '',
  });

  const equipoid =
    equipoSeleccionado === 'local'
      ? (partido?.equipoLocal?.id ?? 0)
      : (partido?.equipoVisitante?.id ?? 0);

  useEffect(() => {
    setMiembrosLocal(partido?.equipoLocal?.miembros ?? []);
    setMiembrosVisitante(partido?.equipoVisitante?.miembros ?? []);
  }, [partido]);

  useEffect(() => {
    if (id && equipoid && equipoid > 0) {
      getParticipacionesPartidoEquipo(Number(id), Number(equipoid));
    }
  }, [getParticipacionesPartidoEquipo, id, equipoid]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: ParticipacionPayload = {
      usuario: Number(form.usuarioId),
      minutosjugados: Number(form.minutosjugados),
      faltas: Number(form.faltas),
      puntos: Number(form.puntos),
      partido: Number(id),
    };

    const success = await crearParticipacion(payload);
    if (success) {
      await getParticipacionesPartidoEquipo(Number(id), Number(equipoid));
      setForm({ usuarioId: '', minutosjugados: '', faltas: '', puntos: '' });
    }
  };

  const handleEdit = (p: Participation) => {
    setEditingId(p.id);
    setEditForm({
      usuarioId: String(p.usuario.id),
      minutosjugados: String(p.minutosjugados ?? ''),
      faltas: String(p.faltas ?? ''),
      puntos: String(p.puntos ?? ''),
    });
    setShowEditModal(true);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ usuarioId: '', minutosjugados: '', faltas: '', puntos: '' });
    setShowEditModal(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    const payload = {
      id: editingId,
      usuario: Number(editForm.usuarioId),
      minutosjugados: Number(editForm.minutosjugados),
      faltas: Number(editForm.faltas),
      puntos: Number(editForm.puntos),
      partido: Number(id),
    };
    const success = await editarParticipacion(
      payload as ParticipacionEditPayload,
    );
    if (success) {
      await getParticipacionesPartidoEquipo(Number(id), Number(equipoid));
      setShowEditModal(false);
      setEditingId(null);
      setEditForm({
        usuarioId: '',
        minutosjugados: '',
        faltas: '',
        puntos: '',
      });
    }
  };

  const askDelete = (p: Participation) => {
    setParticipacionAEliminar(p);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!participacionAEliminar) return;
    const participacionId = participacionAEliminar.id;
    const success = await borrarParticipacion(participacionId);
    if (success) {
      if (editingId === participacionId) handleCancelEdit();
      setShowDeleteModal(false);
      await getParticipacionesPartidoEquipo(Number(id), Number(equipoid));
      setParticipacionAEliminar(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setParticipacionAEliminar(null);
  };

  if (!partido || !partido.equipoLocal || !partido.equipoVisitante) {
    return (
      <div className="participacion-container">
        <div className="loading-state">Cargando partido...</div>
      </div>
    );
  }

  const miembros =
    equipoSeleccionado === 'local' ? miembrosLocal : miembrosVisitante;
  const equipo =
    equipoSeleccionado === 'local'
      ? partido.equipoLocal
      : partido.equipoVisitante;

  return (
    <div className="participacion-container">
      <div className="participacion-inner">
        {/* Botón volver */}
        <div className="volver-section">
          <button
            className="btn-volver"
            onClick={() => navigate(`/home/torneos/${partido.evento.id}`)}
          >
            ← Volver al Torneo
          </button>
        </div>
        {/* Header con tabs de equipos */}
        <div className="participacion-header">
          <div className="equipos-tabs">
            <button
              className={`equipo-tab ${
                equipoSeleccionado === 'local' ? 'active' : ''
              }`}
              onClick={() => setEquipoSeleccionado('local')}
            >
              {partido.equipoLocal?.nombre || 'Equipo Local'}
            </button>
            <button
              className={`equipo-tab ${
                equipoSeleccionado === 'visitante' ? 'active' : ''
              }`}
              onClick={() => setEquipoSeleccionado('visitante')}
            >
              {partido.equipoVisitante?.nombre || 'Equipo Visitante'}
            </button>
          </div>
          <div className="header-info">
            <div className="equipo-info-section">
              <h2>{equipo.nombre}</h2>
              <p className="partido-info-text">
                Partido: {partido.equipoLocal.nombre} vs{' '}
                {partido.equipoVisitante.nombre} •{' '}
                {new Date(partido.fecha).toLocaleDateString()} • {partido.hora}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de crear participación */}
        <div className="crear-participacion-card">
          <h3 className="card-title-participacion">Agregar Participación</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-participacion">
              <div className="form-group-custom">
                <label className="form-label-custom">Jugador</label>
                <select
                  className="form-select-custom"
                  name="usuarioId"
                  value={form.usuarioId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione un jugador</option>
                  {miembros
                    ?.filter(
                      (miembro) =>
                        !participaciones.some(
                          (p) => p.usuario.id === miembro.id,
                        ),
                    )
                    .map((miembro) => (
                      <option key={miembro.id} value={miembro.id}>
                        {miembro.nombre} {miembro.apellido}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group-custom">
                <label className="form-label-custom">Minutos Jugados</label>
                <input
                  className="form-input-custom"
                  type="number"
                  name="minutosjugados"
                  value={form.minutosjugados}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                />
              </div>
              <div className="form-group-custom">
                <label className="form-label-custom">Faltas</label>
                <input
                  className="form-input-custom"
                  type="number"
                  name="faltas"
                  value={form.faltas}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                />
              </div>
              <div className="form-group-custom">
                <label className="form-label-custom">Puntos</label>
                <input
                  className="form-input-custom"
                  type="number"
                  name="puntos"
                  value={form.puntos}
                  onChange={handleChange}
                  min={0}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="form-actions">
              <button
                type="submit"
                className="btn-primary-participacion"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Agregar Participación'}
              </button>
            </div>
            {error && (
              <p
                className="error-message"
                style={{ color: 'red', marginTop: '8px' }}
              >
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Lista de participaciones */}
        <div className="participaciones-card">
          <div className="participaciones-header">
            <h3 className="participaciones-title">
              Participaciones de {equipo.nombre}
            </h3>
          </div>
          <div className="participaciones-table-container">
            <table className="participaciones-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Jugador</th>
                  <th>Puntos</th>
                  <th>Minutos</th>
                  <th>Faltas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {participaciones && participaciones.length > 0 ? (
                  participaciones.map((participacion, idx) => (
                    <tr key={participacion.id}>
                      <td>{idx + 1}</td>
                      <td className="nombre-jugador">
                        {participacion.usuario?.nombre ?? ''}{' '}
                        {participacion.usuario?.apellido ?? ''}
                      </td>
                      <td>
                        <span className="stat-badge">
                          {participacion.puntos}
                        </span>
                      </td>
                      <td>{participacion.minutosjugados}'</td>
                      <td>{participacion.faltas}</td>
                      <td>
                        <div className="table-actions-participacion">
                          <button
                            className="btn-action"
                            onClick={() => handleEdit(participacion)}
                          >
                            Editar
                          </button>
                          <button
                            className="btn-action btn-delete"
                            onClick={() => askDelete(participacion)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="empty-participaciones">
                      <div className="empty-icon">📋</div>
                      <p>No hay participaciones registradas aún</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {showEditModal && (
        <div className="modal-overlay-participacion" onClick={handleCancelEdit}>
          <div
            className="modal-content-participacion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-participacion">
              <h3 className="modal-title-participacion">
                Editar Participación
              </h3>
              <button className="modal-close-btn" onClick={handleCancelEdit}>
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body-participacion">
                <div className="jugador-info">
                  <div className="jugador-label">Jugador</div>
                  <div className="jugador-nombre">
                    {participaciones.find((p) => p.id === editingId)?.usuario
                      ?.nombre ?? ''}{' '}
                    {participaciones.find((p) => p.id === editingId)?.usuario
                      ?.apellido ?? ''}
                  </div>
                </div>
                <div className="modal-form-grid">
                  <div className="form-group-custom">
                    <label className="form-label-custom">Puntos</label>
                    <input
                      className="form-input-custom"
                      type="number"
                      name="puntos"
                      value={editForm.puntos}
                      onChange={handleEditChange}
                      min={0}
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom">Minutos</label>
                    <input
                      className="form-input-custom"
                      type="number"
                      name="minutosjugados"
                      value={editForm.minutosjugados}
                      onChange={handleEditChange}
                      min={0}
                    />
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom">Faltas</label>
                    <input
                      className="form-input-custom"
                      type="number"
                      name="faltas"
                      value={editForm.faltas}
                      onChange={handleEditChange}
                      min={0}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer-participacion">
                <button
                  type="button"
                  className="btn-cancel-custom"
                  onClick={handleCancelEdit}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-save-custom"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
              {error && (
                <p
                  className="error-message"
                  style={{ color: 'red', marginTop: '8px' }}
                >
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <ConfirmModal
          objeto="eliminar la participación"
          asunto={`de ${participacionAEliminar?.usuario.nombre} ${participacionAEliminar?.usuario.apellido}`}
          setShowConfirm={setShowDeleteModal}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}
