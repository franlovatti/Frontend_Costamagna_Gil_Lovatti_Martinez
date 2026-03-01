import { useEstablecimientosEvento } from '../hooks/useEstablecimientos.tsx';
import { useParams, useNavigate } from 'react-router';
import type { Establecimiento } from '../types.tsx';
import { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal.tsx';
import Alert from '../components/Alert.tsx';
import './TorneoDetalle.css';

export default function ListarEstablecimientos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { establecimientos, errorEstablecimientos, deleteEstablecimiento, loadingEstablecimientos } =
    useEstablecimientosEvento(id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [establecimientoToDelete, setEstablecimientoToDelete] = useState<number | null>(null);

  const handleDelete = (establecimientoId: number) => {
    setShowConfirm(true);
    setEstablecimientoToDelete(establecimientoId);
  };

  const confirmDelete = () => {
    if (establecimientoToDelete !== null) {
      deleteEstablecimiento(establecimientoToDelete);
      setShowConfirm(false);
      setEstablecimientoToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setEstablecimientoToDelete(null);
  };
  
  return (
    <div className="torneo-detalle-container">
      <div className="torneo-detalle-inner">
        
      {errorEstablecimientos &&
        Alert({
          message:
            'Error al cargar los establecimientos: ' +
            errorEstablecimientos.message,
          success: false,
        })}
      <div className="form-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h2 className="section-title">Establecimientos del Torneo</h2>
      </div>
      {/* Versión Desktop - Tabla */}
      <div className="section-container">
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loadingEstablecimientos ? (
                <tr>
                  <td colSpan={6} className="loading-cell">
                    Cargando establecimientos...
                  </td>
                </tr>
              ) : establecimientos.length > 0 ? (
                establecimientos.map((est: Establecimiento, idx: number) => (
                  <tr key={est.id}>
                    <td>{idx + 1}</td>
                    <td>{est.nombre}</td>
                    <td>{est.direccion}</td>
                    <td>
                      <div className="table-actions">
                        <button
                          className="btn-action btn-edit"
                          onClick={() =>
                            navigate(
                              `/home/torneos/${est.evento}/FormEstablecimiento/${est.id}`
                            )
                          }
                        >
                          Editar
                        </button>
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDelete(est.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="empty-state-cell">
                    No hay establecimientos cargados aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="action-buttons-section">
          <button
            className="action-btn btn-primary-action"
            onClick={() => navigate(`/home/torneos/${id}/FormEstablecimiento`)}
          >
            + Agregar Establecimiento
          </button>
        </div>

      </div>
      {/* Versión Mobile - Cards */}
      <div className="equipos-mobile-list">
        { loadingEstablecimientos ? (
          <div className="loading-cell">
            Cargando establecimientos...
          </div>
        ) :
        (establecimientos.length > 0) ? (
          establecimientos.map((est: Establecimiento) => (
            <div key={est.id} className="equipo-mobile-card">
              <div className="equipo-mobile-header">
                <div className="equipo-mobile-name">{est.nombre}</div>
              </div>
              <div className="equipo-mobile-info">
                <div className="equipo-info-row">
                  <span className="equipo-info-value">{est.direccion}</span>
                </div>
              </div>
              <div className="equipo-mobile-actions">
                <button
                  className="btn-action btn-edit"
                  onClick={() =>
                    navigate(
                      `/home/torneos/${est.evento}/FormEstablecimiento/${est.id}`
                    )
                  }
                >
                  Editar
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => handleDelete(est.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏟️</div>
            <p className="empty-state-text">
              No hay establecimientos cargados aún
            </p>
          </div>
        )}
      </div>

      {showConfirm && (
        <ConfirmModal
          objeto={"el establecimiento"}
          setShowConfirm={setShowConfirm}
          handleConfirmDelete={confirmDelete}
          handleCancelDelete={cancelDelete}
        />
        )}
      </div>
    </div>
  );
}
