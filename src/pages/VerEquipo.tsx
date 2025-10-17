import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, Button as RBButton } from 'react-bootstrap';

import apiAxios from '../helpers/api';
import { useAuth } from '../hooks/useAuth';

import type { Equipo, Usuario } from '../types';
import { Button } from '../components/ButtonField.tsx';

export default function VerEquipo() {
  const { id } = useParams<{ id: string }>();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const idtorneo = equipo
    ? typeof equipo.evento === 'number'
      ? (equipo.evento as number)
      : (equipo.evento as { id: number }).id
    : undefined;

  const fetchEquipo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiAxios.get(`/equipos/${id}`);
      const payload =
        response.data && response.data.data
          ? response.data.data
          : response.data;
      setEquipo(payload as Equipo);
    } catch (e) {
      console.error('Error fetching equipo:', e);
      setError('Error al cargar el equipo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEquipo();
  }, [fetchEquipo]);

  async function handleLeave() {
    setLeaving(true);
    try {
      const usuarioIdToRemove = user?.id;
      const payload = usuarioIdToRemove ? { usuarioId: usuarioIdToRemove } : {};

      const res = await apiAxios.patch(`/equipos/${id}/miembros`, payload);
      setEquipo(res.data.data);
      navigate(`/home/torneos/${idtorneo}`);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ??
          error?.message ??
          'Error al eliminar usuario.'
      );
    } finally {
      setLeaving(false);
      setShowLeaveModal(false);
    }
  }

  async function handleDeleteTeam(equipoId: string | number) {
    setDeleting(true);
    try {
      await apiAxios.delete(`/equipos/${equipoId}`);
      navigate('/home/torneos');
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ??
          error?.message ??
          'Error al eliminar el equipo.'
      );
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  }
  // Guardas tempranas mientras cargamos o si hay error
  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!equipo) return <div>Equipo no encontrado.</div>;

  // Con equipo no nulo, podemos calcular estados derivados
  const userIdStr = user ? String(user.id) : undefined;
  const capId = equipo.capitan.id;
  const isMember =
    Array.isArray(equipo.miembros) &&
    equipo.miembros.some((m) => String(m.id) === userIdStr);
  const isCaptain = userIdStr ? String(capId) === userIdStr : false;
  const canLeave = isMember && !isCaptain;
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card bg-dark text-white shadow">
            <div className="card-body">
              <h2 className="card-title">{equipo.nombre}</h2>
              <p className="card-subtitle mb-2 text-muted">
                Capitán: {equipo.nombreCapitan}
              </p>
              <p className="mb-3">Puntos: {equipo.puntos}</p>

              <h5>Miembros</h5>
              {Array.isArray(equipo.miembros) && equipo.miembros.length > 0 ? (
                <ul className="list-group list-group-flush mb-3">
                  {(equipo.miembros as Usuario[]).map((miembro) => (
                    <li
                      key={miembro.id}
                      className="list-group-item bg-dark text-white border-primary"
                    >
                      {miembro.nombre ?? miembro.usuario ?? miembro.id}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-secondary">
                  No hay miembros listados.
                </div>
              )}

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  className="btn-outline-light"
                  onClick={() => navigate(`/home/torneos/${idtorneo}`)}
                  disabled={typeof idtorneo === 'undefined'}
                >
                  Volver
                </Button>

                {user && canLeave && (
                  <Button
                    className="btn-outline-danger"
                    onClick={() => setShowLeaveModal(true)}
                  >
                    Darse de baja
                  </Button>
                )}

                {isCaptain && (
                  <>
                    <Button
                      className="btn-outline-light"
                      onClick={() =>
                        navigate(`/home/equipos/${equipo.id}/editar`)
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      className="btn-danger"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modales de confirmación */}
      <Modal
        show={showLeaveModal}
        onHide={() => setShowLeaveModal(false)}
        centered
      >
        <Modal.Header
          data-bs-theme="dark"
          closeButton
          className="text-bg-dark border-primary"
        >
          <Modal.Title>Confirmar baja</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-dark">
          ¿Querés darte de baja de este equipo?
        </Modal.Body>
        <Modal.Footer className="text-bg-dark border-primary">
          <RBButton
            variant="secondary"
            onClick={() => setShowLeaveModal(false)}
            disabled={leaving}
          >
            Cancelar
          </RBButton>
          <RBButton
            variant="danger"
            onClick={() => handleLeave()}
            disabled={leaving}
          >
            {leaving ? 'Procesando...' : 'Confirmar baja'}
          </RBButton>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header
          data-bs-theme="dark"
          closeButton
          className="text-bg-dark border-primary"
        >
          <Modal.Title>Eliminar equipo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-bg-dark">
          Esta acción no se puede deshacer. ¿Eliminar el equipo?
        </Modal.Body>
        <Modal.Footer className="text-bg-dark border-primary">
          <RBButton
            variant="secondary"
            onClick={() => setShowDeleteModal(false)}
            disabled={deleting}
          >
            Cancelar
          </RBButton>
          <RBButton
            variant="danger"
            onClick={() => handleDeleteTeam(equipo.id)}
            disabled={deleting}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </RBButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
