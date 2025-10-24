import { useParams } from 'react-router';
import { useNavigate } from 'react-router';
import apiAxios from '../helpers/api.tsx';
import { useEffect, useState, useCallback } from 'react';
import type { Partido, Usuario, Participation } from '../types.tsx';
import './Participacion.css';

export default function CrearParticipacion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [partido, setPartido] = useState<Partido | null>(null);
  const [miembrosLocal, setMiembrosLocal] = useState<Usuario[]>([]);
  const [miembrosVisitante, setMiembrosVisitante] = useState<Usuario[]>([]);
  const [participaciones, setParticipaciones] = useState<Participation[]>([]);
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

  const traerPartido = useCallback(async () => {
    try {
      const response = await apiAxios.get(`/partidos/${id}`);
      setPartido(response.data.data);
      setMiembrosLocal(response.data.data.equipoLocal.miembros);
      setMiembrosVisitante(response.data.data.equipoVisitante.miembros);
    } catch (error) {
      console.error('Error al traer el partido:', error);
    }
  }, [id]);

  const equipoid =
    equipoSeleccionado === 'local'
      ? String(partido?.equipoLocal?.id)
      : String(partido?.equipoVisitante?.id);

  const traerParticipaciones = useCallback(async () => {
    if (!id || !equipoid || equipoid === 'undefined') return;
    try {
      const response = await apiAxios.get(
        `/participaciones/participacionesxequipo`,
        {
          params: { partidoId: id, equipoid },
        }
      );
      setParticipaciones(response.data.data);
    } catch (error) {
      console.error('Error al traer las participaciones:', error);
    }
  }, [id, equipoid]);

  useEffect(() => {
    traerPartido();
  }, [traerPartido]);

  useEffect(() => {
    traerParticipaciones();
  }, [traerParticipaciones]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      usuario: form.usuarioId,
      minutosjugados: Number(form.minutosjugados),
      faltas: Number(form.faltas),
      puntos: Number(form.puntos),
      partido: Number(id),
    };

    try {
      await apiAxios.post('/participaciones', payload);
      await traerParticipaciones();
      setForm({ usuarioId: '', minutosjugados: '', faltas: '', puntos: '' });
    } catch (error) {
      console.error('Error al crear la participación:', error);
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
    >
  ) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingId) return;
    const payload = {
      usuario: editForm.usuarioId,
      minutosjugados: Number(editForm.minutosjugados),
      faltas: Number(editForm.faltas),
      puntos: Number(editForm.puntos),
      partido: Number(id),
    };
    try {
      await apiAxios.put(`/participaciones/${editingId}`, payload);
      await traerParticipaciones();
      setShowEditModal(false);
      setEditingId(null);
      setEditForm({
        usuarioId: '',
        minutosjugados: '',
        faltas: '',
        puntos: '',
      });
    } catch (error) {
      console.error('Error al guardar la participación:', error);
    }
  };

  const askDelete = (p: Participation) => {
    setParticipacionAEliminar(p);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!participacionAEliminar) return;
    const participacionId = participacionAEliminar.id;
    try {
      await apiAxios.delete(`/participaciones/${participacionId}`);
      setParticipaciones((prev) =>
        prev.filter((p) => p.id !== participacionId)
      );
      if (editingId === participacionId) handleCancelEdit();
      setShowDeleteModal(false);
      await traerParticipaciones();
    } catch (error) {
      console.error('Error al eliminar la participación:', error);
    }
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
                        !participaciones.some((p) => p.usuario.id === miembro.id)
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
              <button type="submit" className="btn-primary-participacion">
                Agregar Participación
              </button>
            </div>
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
        <div
          className="modal-overlay-participacion"
          onClick={handleCancelEdit}
        >
          <div
            className="modal-content-participacion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-participacion">
              <h3 className="modal-title-participacion">
                Editar Participación
              </h3>
              <button
                className="modal-close-btn"
                onClick={handleCancelEdit}
              >
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
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save-custom">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div
          className="modal-overlay-participacion"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="modal-content-participacion"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-participacion">
              <h3 className="modal-title-participacion">
                Eliminar Participación
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="modal-body-participacion">
              <p>
                ¿Estás seguro de eliminar la participación de{' '}
                <strong>
                  {participacionAEliminar?.usuario?.nombre ?? ''}{' '}
                  {participacionAEliminar?.usuario?.apellido ?? ''}
                </strong>
                ?
              </p>
            </div>
            <div className="modal-footer-participacion">
              <button
                className="btn-cancel-custom"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn-action btn-delete"
                onClick={handleConfirmDelete}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useParams } from 'react-router';
// import { useNavigate } from 'react-router';
// import apiAxios from '../helpers/api.tsx';
// import { useEffect, useState, useCallback } from 'react';
// import {
//   Card,
//   Nav,
//   Form,
//   Button,
//   Row,
//   Col,
//   Modal,
//   Table,
// } from 'react-bootstrap';
// import type { Partido, Usuario, Participation } from '../types.tsx';

// export default function CrearParticipacion() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const [partido, setPartido] = useState<Partido | null>(null);
//   const [miembrosLocal, setMiembrosLocal] = useState<Usuario[]>([]);
//   const [miembrosVisitante, setMiembrosVisitante] = useState<Usuario[]>([]);
//   const [participaciones, setParticipaciones] = useState<Participation[]>([]);
//   const [equipoSeleccionado, setEquipoSeleccionado] = useState<
//     'local' | 'visitante'
//   >('local');
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [showEditModal, setShowEditModal] = useState<boolean>(false);
//   const [editForm, setEditForm] = useState({
//     usuarioId: '',
//     minutosjugados: '',
//     faltas: '',
//     puntos: '',
//   });
//   const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
//   const [participacionAEliminar, setParticipacionAEliminar] =
//     useState<Participation | null>(null);
//   const [form, setForm] = useState({
//     usuarioId: '',
//     minutosjugados: '',
//     faltas: '',
//     puntos: '',
//   });

//   const traerPartido = useCallback(async () => {
//     try {
//       const response = await apiAxios.get(`/partidos/${id}`);
//       setPartido(response.data.data);
//       setMiembrosLocal(response.data.data.equipoLocal.miembros);
//       setMiembrosVisitante(response.data.data.equipoVisitante.miembros);
//     } catch (error) {
//       console.error('Error al traer el partido:', error);
//     }
//   }, [id]);

//   const equipoid =
//     equipoSeleccionado === 'local'
//       ? String(partido?.equipoLocal?.id)
//       : String(partido?.equipoVisitante?.id);

//   const traerParticipaciones = useCallback(async () => {
//     if (!id || !equipoid || equipoid === 'undefined') return;
//     try {
//       const response = await apiAxios.get(
//         `/participaciones/participacionesxequipo`,
//         {
//           params: { partidoId: id, equipoid },
//         }
//       );
//       setParticipaciones(response.data.data);
//     } catch (error) {
//       console.error('Error al traer las participaciones:', error);
//     }
//   }, [id, equipoid]);

//   useEffect(() => {
//     traerPartido();
//   }, [traerPartido]);

//   useEffect(() => {
//     traerParticipaciones();
//   }, [traerParticipaciones]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const payload = {
//       usuario: form.usuarioId,
//       minutosjugados: Number(form.minutosjugados),
//       faltas: Number(form.faltas),
//       puntos: Number(form.puntos),
//       partido: Number(id),
//     };

//     try {
//       await apiAxios.post('/participaciones', payload);
//       await traerParticipaciones();
//       setForm({ usuarioId: '', minutosjugados: '', faltas: '', puntos: '' });
//     } catch (error) {
//       console.error('Error al crear la participación:', error);
//     }
//   };

//   const handleEdit = (p: Participation) => {
//     setEditingId(p.id);
//     setEditForm({
//       usuarioId: String(p.usuario.id),
//       minutosjugados: String(p.minutosjugados ?? ''),
//       faltas: String(p.faltas ?? ''),
//       puntos: String(p.puntos ?? ''),
//     });
//     setShowEditModal(true);
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditForm({ usuarioId: '', minutosjugados: '', faltas: '', puntos: '' });
//     setShowEditModal(false);
//   };

//   const handleEditChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setEditForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!editingId) return;
//     const payload = {
//       usuario: editForm.usuarioId,
//       minutosjugados: Number(editForm.minutosjugados),
//       faltas: Number(editForm.faltas),
//       puntos: Number(editForm.puntos),
//       partido: Number(id),
//     };
//     try {
//       await apiAxios.put(`/participaciones/${editingId}`, payload);
//       await traerParticipaciones();
//       setShowEditModal(false);
//       setEditingId(null);
//       setEditForm({
//         usuarioId: '',
//         minutosjugados: '',
//         faltas: '',
//         puntos: '',
//       });
//     } catch (error) {
//       console.error('Error al guardar la participación:', error);
//     }
//   };

//   const askDelete = (p: Participation) => {
//     setParticipacionAEliminar(p);
//     setShowDeleteModal(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!participacionAEliminar) return;
//     const participacionId = participacionAEliminar.id;
//     try {
//       await apiAxios.delete(`/participaciones/${participacionId}`);
//       setParticipaciones((prev) =>
//         prev.filter((p) => p.id !== participacionId)
//       );
//       if (editingId === participacionId) handleCancelEdit();
//       setShowDeleteModal(false);
//       await traerParticipaciones();
//     } catch (error) {
//       console.error('Error al eliminar la participación:', error);
//     }
//   };

//   if (!partido || !partido.equipoLocal || !partido.equipoVisitante) {
//     return <div>Cargando...</div>;
//   }

//   const miembros =
//     equipoSeleccionado === 'local' ? miembrosLocal : miembrosVisitante;
//   const equipo =
//     equipoSeleccionado === 'local'
//       ? partido.equipoLocal
//       : partido.equipoVisitante;

//   return (
//     <div className="text-bg-dark container">
//       <Row className="text-center p-3">
//         <Col>
//           <Nav
//             variant="tabs"
//             activeKey={equipoSeleccionado}
//             onSelect={(selectedKey) =>
//               setEquipoSeleccionado(selectedKey as 'local' | 'visitante')
//             }
//           >
//             <Nav.Item>
//               <Nav.Link eventKey="local">
//                 {partido.equipoLocal?.nombre || 'Equipo Local'}
//               </Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey="visitante">
//                 {partido.equipoVisitante?.nombre || 'Equipo Visitante'}
//               </Nav.Link>
//             </Nav.Item>
//           </Nav>
//         </Col>
//       </Row>

//       <Card className="bg-bs-dark text-bg-dark border border-primary mt-2">
//         <Card.Body>
//           <Card.Title>Crear Participación para {equipo.nombre}</Card.Title>
//           <Form onSubmit={handleSubmit}>
//             <Form.Group className="mb-3">
//               <Form.Label>Jugador</Form.Label>
//               <Form.Select
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 name="usuarioId"
//                 value={form.usuarioId}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="">Seleccione un jugador</option>
//                 {miembros
//                   ?.filter(
//                     (miembro) =>
//                       !participaciones.some((p) => p.usuario.id === miembro.id)
//                   )
//                   .map((miembro) => (
//                     <option key={miembro.id} value={miembro.id}>
//                       {miembro.nombre}
//                     </option>
//                   ))}
//               </Form.Select>
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Minutos Jugados</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="number"
//                 name="minutosjugados"
//                 value={form.minutosjugados}
//                 onChange={handleChange}
//                 min={0}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Faltas</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="number"
//                 name="faltas"
//                 value={form.faltas}
//                 onChange={handleChange}
//                 min={0}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Puntos</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="number"
//                 name="puntos"
//                 value={form.puntos}
//                 onChange={handleChange}
//                 min={0}
//               />
//             </Form.Group>
//             <div className="d-flex gap-2">
//               <Button variant="primary" type="submit">
//                 Crear Participación
//               </Button>
//             </div>
//           </Form>
//         </Card.Body>
//       </Card>

//       <Card className="bg-bs-dark text-bg-dark border border-primary mt-3">
//         <Card.Body>
//           <Card.Title>Participaciones de {equipo.nombre}</Card.Title>
//           <Table
//             striped
//             bordered
//             hover
//             responsive
//             size="sm"
//             className="mb-0 table-dark align-middle"
//           >
//             <thead>
//               <tr>
//                 <th>Nombre</th>
//                 <th>Apellido</th>
//                 <th>Puntos</th>
//                 <th>Minutos</th>
//                 <th>Faltas</th>
//                 <th style={{ width: 170 }}>Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {participaciones?.map((participacion) => (
//                 <tr key={participacion.id}>
//                   <td>{participacion.usuario?.nombre ?? ''}</td>
//                   <td>{participacion.usuario?.apellido ?? ''}</td>
//                   <td>{participacion.puntos}</td>
//                   <td>{participacion.minutosjugados}</td>
//                   <td>{participacion.faltas}</td>
//                   <td>
//                     <div className="d-flex gap-2">
//                       <Button
//                         size="sm"
//                         variant="outline-warning"
//                         onClick={() => handleEdit(participacion)}
//                       >
//                         Modificar
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline-danger"
//                         onClick={() => askDelete(participacion)}
//                       >
//                         Eliminar
//                       </Button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </Card.Body>
//       </Card>

//       <Modal
//         show={showEditModal}
//         onHide={handleCancelEdit}
//         centered
//         contentClassName="bg-bs-dark text-bg-dark border border-primary"
//       >
//         <Form onSubmit={handleEditSubmit}>
//           <Modal.Header
//             data-bs-theme="dark"
//             closeButton
//             className="border-primary"
//           >
//             <Modal.Title>Editar participación</Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <div className="mb-2" style={{ opacity: 0.85 }}>
//               Jugador:{' '}
//               <strong>
//                 {participaciones.find((p) => p.id === editingId)?.usuario
//                   ?.nombre ?? ''}
//               </strong>
//             </div>
//             <Row>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Puntos</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="puntos"
//                     value={editForm.puntos}
//                     onChange={handleEditChange}
//                     min={0}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Minutos</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="minutosjugados"
//                     value={editForm.minutosjugados}
//                     onChange={handleEditChange}
//                     min={0}
//                   />
//                 </Form.Group>
//               </Col>
//               <Col md={4}>
//                 <Form.Group className="mb-3">
//                   <Form.Label>Faltas</Form.Label>
//                   <Form.Control
//                     type="number"
//                     name="faltas"
//                     value={editForm.faltas}
//                     onChange={handleEditChange}
//                     min={0}
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>
//           </Modal.Body>
//           <Modal.Footer className="border-primary">
//             <Button variant="secondary" onClick={handleCancelEdit}>
//               Cancelar
//             </Button>
//             <Button variant="primary" type="submit">
//               Guardar cambios
//             </Button>
//           </Modal.Footer>
//         </Form>
//       </Modal>

//       {/* Modal Confirmación Eliminar */}
//       <Modal
//         show={showDeleteModal}
//         onHide={() => setShowDeleteModal(false)}
//         centered
//         contentClassName="bg-bs-dark text-bg-dark border border-primary"
//       >
//         <Modal.Header closeButton className="border-primary">
//           <Modal.Title>Eliminar participación</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           ¿Estás seguro de eliminar la participación de
//           {` ${participacionAEliminar?.usuario?.nombre ?? ''}`}?
//         </Modal.Body>
//         <Modal.Footer className="border-primary">
//           <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
//             Cancelar
//           </Button>
//           <Button variant="danger" onClick={handleConfirmDelete}>
//             Eliminar
//           </Button>
//         </Modal.Footer>
//       </Modal>
//       <Button
//         className="mb-3 mt-3"
//         variant="primary"
//         onClick={() => navigate(`/home/torneos/${partido.evento.id}`)}
//       >
//         volver
//       </Button>
//     </div>
//   );
// }
