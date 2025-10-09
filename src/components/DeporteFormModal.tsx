import type { Deporte } from "../contexts/deporte";
import "./cssComponentes/DeporteFormModal.css";
import "./cssComponentes/ConfirmModal.css";

export default function DeporteFormModal({
  setShowModal,
  editingDeporte,
  formData,
  setFormData,
  handleSave
}: {
  setShowModal: (show: boolean) => void;
  editingDeporte: Deporte | null;
  formData: {
    nombre: string;
    cantMinJugadores: number;
    cantMaxJugadores: number;
    duracion: number;
  };
  setFormData: (data: {
    nombre: string;
    cantMinJugadores: number;
    cantMaxJugadores: number;
    duracion: number;
  }) => void;
  handleSave: () => void;
}) {

  return (
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
  );
}