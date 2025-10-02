import { useState } from 'react';
import { Button } from '../components/ButtonField.tsx';
import { useDeporte } from '../hooks/useDeporte.tsx';
import './DeportesAdmin.css';
import type { Deporte } from '../contexts/deporte.tsx';

const DeportesAdmin = () => {
  const { deportes, borrarDeporte, modificarDeporte, crearDeporte } = useDeporte();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDeporte, setEditingDeporte] = useState<Deporte | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cantMinJugadores: 0,
    cantMaxJugadores: 0,
    duracion: 0
  });

  // Filtrar deportes
  const deportesFiltrados = deportes.filter(deporte =>
    deporte.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  // Abrir modal para crear
  const handleCreate = () => {
    setEditingDeporte(null);
    setFormData({
      nombre: '',
      cantMinJugadores: 0,
      cantMaxJugadores: 0,
      duracion: 0
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (deporte: Deporte) => {
    setEditingDeporte(deporte);
    setFormData({
      nombre: deporte.nombre,
      cantMinJugadores: deporte.cantMinJugadores,
      cantMaxJugadores: deporte.cantMaxJugadores,
      duracion: deporte.duracion
    });
    setShowModal(true);
  };

  // Guardar (crear o editar)
  const handleSave = () => {
    if (editingDeporte) {
      // Editar
      const deporte: Deporte = {
        id: editingDeporte.id,
        nombre: formData.nombre,
        cantMinJugadores: formData.cantMinJugadores,
        cantMaxJugadores: formData.cantMaxJugadores,
        duracion: formData.duracion
      };
      modificarDeporte(deporte);
    } else {
      // Crear
      const newDeporte = {
        nombre: formData.nombre,
        cantMinJugadores: formData.cantMinJugadores,
        cantMaxJugadores: formData.cantMaxJugadores,
        duracion: formData.duracion
      };
      crearDeporte(newDeporte as Deporte);
    }

    setShowModal(false);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [deporteAEliminar, setDeporteAEliminar] = useState<Deporte | null>(null);

  const handleDelete = (deporte: Deporte) => {
    setDeporteAEliminar(deporte);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deporteAEliminar !== null) {
      borrarDeporte(deporteAEliminar.id);
    }
    setShowConfirm(false);
    setDeporteAEliminar(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeporteAEliminar(null);
  };


  return (
    <div className="deportes-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Deportes</h1>
        <p className="text-muted-custom mb-0">Administra los deportes disponibles en la plataforma</p>
      </div>

      <div className="d-flex gap-3 mb-4 align-items-center search-bar-row">
        <input
          type="text"
          className="form-control search-input flex-grow-1"
          placeholder="Buscar deportes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="btn btn-primary-custom d-flex align-items-center gap-2 mt-2 mt-sm-0" onClick={handleCreate}>
          <span>➕</span>
          Crear Deporte
        </Button>
      </div>

      <div className="table-responsive custom-table-container">
        <table className="table custom-table mb-0">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Mínimo de jugadores</th>
              <th>Máximo de jugadores</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {deportesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-5 text-muted-custom">
                  No se encontraron deportes
                </td>
              </tr>
            ) : (
              deportesFiltrados.map((deporte) => (
                <tr key={deporte.id}>
                  <td>{deporte.nombre}</td>
                  <td>
                    <span className={`badge-custom ${deporte.cantMaxJugadores === 1 ? 'badge-equipo' : 'badge-individual'}`}>
                      {deporte.cantMaxJugadores === 1 ? 'Individual' : 'Equipo'}
                    </span>
                  </td>
                  <td>{deporte.cantMinJugadores}</td>
                  <td>{deporte.cantMaxJugadores}</td>
                  <td>{deporte.duracion}</td>
                  <td>
                    <button className="btn-action me-2" onClick={() => handleEdit(deporte)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-action btn-delete" onClick={() => handleDelete(deporte)}>
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      


      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title mb-4">
              {editingDeporte ? 'Editar Deporte' : 'Crear Nuevo Deporte'}
            </h2>

            <div className="mb-3">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-control custom-input"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Fútbol"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Jugadores minimos por equipo *</label>
              <input
                type="number"
                className="form-control custom-input"
                value={formData.cantMinJugadores}
                onChange={(e) => setFormData({...formData, cantMinJugadores: parseInt(e.target.value) || 0})}
                min="0"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Jugadores maximos por equipo *</label>
              <input
                type="number"
                className="form-control custom-input"
                value={formData.cantMaxJugadores}
                onChange={(e) => setFormData({...formData, cantMaxJugadores: parseInt(e.target.value) || 0})}
                min="0"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Duración</label>
              <input
                type="text"
                className="form-control custom-input"
                value={formData.duracion}
                onChange={(e) => setFormData({...formData, duracion: parseInt(e.target.value) || 0})}
                placeholder="Duración en minutos"
                required
              />
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-cancel-custom flex-grow-1" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-save-custom flex-grow-1" onClick={handleSave}>
                {editingDeporte ? 'Guardar Cambios' : 'Crear Deporte'}
              </button>
            </div>
          </div>
        </div>
      )}


      {showConfirm && (
        <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h5 className="modal-title">Confirmar eliminación</h5>
                <button type="button" className="btn-close" onClick={handleCancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas eliminar el deporte {deporteAEliminar?.nombre}?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-action mx-2" onClick={handleCancelDelete}>
                  Cancelar
                </button>
                <button className="btn btn-action btn-delete mx-2" onClick={handleConfirmDelete}>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default DeportesAdmin;