import { useState } from 'react';
import type { Localidad } from '../../contexts/localidad.tsx';
import MapaLocalidad from '../apiMaps/MapaLocalidad.tsx';
import '../cssComponentes/DeporteFormModal.css';
import '../cssComponentes/ConfirmModal.css';

interface LocalidadFormModalProps {
  setShowModal: (show: boolean) => void;
  onSave: (data: Partial<Localidad>) => void;
}

export default function LocalidadFormModal({setShowModal,onSave}: LocalidadFormModalProps) {
  const [formData, setFormData] = useState<Partial<Localidad>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newErrors: { [key: string]: string } = {};
    if (!formData.descripcion || formData.descripcion.trim() === '') {
      newErrors.descripcion = 'La descripción es obligatoria';
    }
    onSave(formData);
    setIsSubmitting(false);
    setShowModal(false);
  }


  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        className="modal-content-custom"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="modal-title mb-4">
          Agregar Nueva Localidad
        </h2>
      
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Descripción *</label>
            <MapaLocalidad onSelect={(place)=>{
              const loc = place.geometry?.location;
              setFormData(
              {...formData, 
              descripcion: place.formatted_address,
              codigo: place.place_id,
              lat: loc ? loc.lat().toString() : ' ',
              lng: loc ? loc.lng().toString() : ' '
            })}}
              className={`modal-content-custom form-control custom-input`}
              placeholder='Ej: Rosario, Santa Fe'
              localidad={true}
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
              type="submit"
              disabled={isSubmitting}
            >
              Agregar Localidad
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}