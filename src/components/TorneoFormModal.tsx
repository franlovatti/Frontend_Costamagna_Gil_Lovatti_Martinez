import type { Torneo } from "../contexts/torneo";
import type { Deporte } from "../contexts/deporte";
import "./cssComponentes/DeporteFormModal.css";
import "./cssComponentes/ConfirmModal.css";
import { useDeporte } from "../hooks/useDeporte.tsx";
import { useEffect } from "react";

export default function TorneoFormModal({
  setShowModal,
  editingTorneo,
  formData,
  setFormData,
  handleSave
}: {
  setShowModal: (show: boolean) => void;
  editingTorneo: Torneo | null;
  formData: {
    nombre: string,
    esPublico: boolean,
    contraseña: string,
    cantEquiposMax: number,
    fechaInicioInscripcion: string,
    fechaFinInscripcion: string,
    fechaInicioEvento: string,
    fechaFinEvento: string,
    deporte: Deporte,
  };
  setFormData: (data: {
    nombre: string,
    esPublico: boolean,
    contraseña: string,
    cantEquiposMax: number,
    fechaInicioInscripcion: string,
    fechaFinInscripcion: string,
    fechaInicioEvento: string,
    fechaFinEvento: string,
    deporte: Deporte,
  }) => void;
  handleSave: () => void;
}) {

  const { deportes, getDeportes } = useDeporte();

  useEffect(() => {
    getDeportes();
  }, [getDeportes]);

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title mb-4">
          {editingTorneo ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
        </h2>

        <div className="mb-3">
          <label className="form-label">Nombre *</label>
          <input
            type="text"
            className="form-control custom-input"
            value={formData.nombre}
            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            placeholder="Ej: Liga de Verano"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad maxima de equipos *</label>
          <input
            type="number"
            className="form-control custom-input"
            value={formData.cantEquiposMax}
            onChange={(e) => setFormData({...formData, cantEquiposMax: parseInt(e.target.value) || 0})}
            min="0"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Deporte *</label>
          <select
            className="form-select"
            value={formData.deporte?.id ?? ''}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const id = Number(e.target.value);
              const seleccionado = Array.isArray(deportes) ? deportes.find(d => d.id === id) ?? null : null;
              setFormData({ ...formData, deporte: seleccionado ?? (formData.deporte ?? null) });
            }}
            required
          >
            <option value="">-- Seleccione deporte --</option>
            {Array.isArray(deportes) && deportes.map(d => (
              <option key={d.id} value={d.id}>{d.nombre}</option>
            ))}
          </select>
        </div>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            checked={formData.esPublico}
            onChange={(e) => setFormData({...formData, esPublico: e.target.checked})}
          />
          <label className="form-check-label">
            ¿Es público?
          </label>
        </div>
        {!formData.esPublico && (
          <div className="mb-3">
            <label className="form-label">Contraseña *</label>
            <input
              type="password"
              className="form-control custom-input"
              value={formData.contraseña}
              onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
              placeholder="Ingrese una contraseña"
              required
            />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Fecha y hora de inicio de inscripción *</label>
          <input
            type="datetime-local"
            className="form-control custom-input"
            value={formData.fechaInicioInscripcion}
            onChange={(e) => setFormData({...formData, fechaInicioInscripcion: e.target.value})}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y hora de fin de inscripción *</label>
          <input
            type="datetime-local"
            className="form-control custom-input"
            value={formData.fechaFinInscripcion}
            onChange={(e) => setFormData({...formData, fechaFinInscripcion: e.target.value})}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y hora de inicio del evento *</label>
          <input
            type="datetime-local"
            className="form-control custom-input"
            value={formData.fechaInicioEvento}
            onChange={(e) => setFormData({...formData, fechaInicioEvento: e.target.value})}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha y hora de fin del evento *</label>
          <input
            type="datetime-local"
            className="form-control custom-input"
            value={formData.fechaFinEvento}
            onChange={(e) => setFormData({...formData, fechaFinEvento: e.target.value})}
          />
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-cancel-custom flex-grow-1" onClick={() => setShowModal(false)}>
            Cancelar
          </button>
          <button className="btn btn-save-custom flex-grow-1" onClick={handleSave}>
            {editingTorneo ? 'Guardar Cambios' : 'Crear Torneo'}
          </button>
        </div>
      </div>
    </div>
  );
}