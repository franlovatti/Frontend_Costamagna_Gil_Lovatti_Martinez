import { useEffect } from 'react';
import type { Noticia } from '../types';
import './cssComponentes/DeporteFormModal.css';
import './cssComponentes/ConfirmModal.css';

export default function NoticiaFormModal({
  setShowModal,
  editingNoticia,
  formData,
  setFormData,
  handleSave,
}: {
  setShowModal: (show: boolean) => void;
  editingNoticia: Noticia | null;
  formData: { titulo: string; descripcion: string; fecha: string };

  setFormData: (data: {
    titulo: string;
    descripcion: string;
    fecha: string;
  }) => void;
  handleSave: () => void;
}) {
  useEffect(() => {
    if (editingNoticia) {
      // Populate form with existing noticia data when editing
      setFormData({
        titulo: editingNoticia.titulo,
        descripcion: editingNoticia.descripcion,
        fecha: editingNoticia.fecha,
      });
    } else {
      // Set default date to today when creating a new noticia
      const today = new Date().toISOString().split('T')[0];
      setFormData({ titulo: '', descripcion: '', fecha: today });
    }
  }, [editingNoticia, setFormData]);

  const handleSaveWithDateUpdate = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: today,
    });
    handleSave();
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title mb-4">
          {editingNoticia ? 'Editar Noticia' : 'Crear Nueva Noticia'}
        </h2>

        <div className="mb-3">
          <label className="form-label">Título *</label>
          <input
            type="text"
            className="form-control custom-input"
            value={formData.titulo}
            onChange={(e) =>
              setFormData({ ...formData, titulo: e.target.value })
            }
            placeholder="Ej: Torneo de fútbol regional"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea
            className="form-control custom-input"
            value={formData.descripcion}
            onChange={(e) =>
              setFormData({ ...formData, descripcion: e.target.value })
            }
            placeholder="Descripción breve de la noticia"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de Publicación</label>
          <input
            type="date"
            className="form-control custom-input"
            value={formData.fecha}
            onChange={(e) =>
              setFormData({ ...formData, fecha: e.target.value })
            }
            required
          />
        </div>

        <div className="d-flex gap-3">
          <button
            className="btn btn-cancel-custom flex-grow-1"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button
            className="btn btn-save-custom flex-grow-1"
            onClick={handleSaveWithDateUpdate}
          >
            {editingNoticia ? 'Guardar Cambios' : 'Crear Noticia'}
          </button>
        </div>
      </div>
    </div>
  );
}
