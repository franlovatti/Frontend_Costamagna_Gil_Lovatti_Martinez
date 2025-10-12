import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Torneo } from "../contexts/torneo";
import { useDeporte } from "../hooks/useDeporte.tsx";
import { toDatetimeLocal, parseDatetimeLocal } from "../helpers/convertirFechas.tsx";
import "./cssComponentes/DeporteFormModal.css";
import "./cssComponentes/ConfirmModal.css";

type TorneoFormFields = {
  nombre: string;
  esPublico: boolean;
  contraseña: string;
  cantEquiposMax: number;
  fechaInicioInscripcion: string;
  fechaFinInscripcion: string;
  fechaInicioEvento: string;
  fechaFinEvento: string;
  deporteId: number;
};

interface TorneoFormModalProps {
  setShowModal: (show: boolean) => void;
  editingTorneo: Torneo | null;
  onSave: (data: Partial<Torneo>) => void;
}

export default function TorneoFormModal({
  setShowModal,
  editingTorneo,
  onSave
}: TorneoFormModalProps) {
  const { deportes, getDeportes } = useDeporte();

  const {
    register,
    handleSubmit,
    watch,
    // setValue,
    // control,
    formState: { errors, isSubmitting }
  } = useForm<TorneoFormFields>({
    mode: 'onBlur',
    defaultValues: {
      nombre: editingTorneo?.nombre || '',
      esPublico: editingTorneo?.esPublico ?? true,
      contraseña: editingTorneo?.contraseña || '',
      cantEquiposMax: editingTorneo?.cantEquiposMax || 8,
      fechaInicioInscripcion: toDatetimeLocal(editingTorneo?.fechaInicioInscripcion),
      fechaFinInscripcion: toDatetimeLocal(editingTorneo?.fechaFinInscripcion),
      fechaInicioEvento: toDatetimeLocal(editingTorneo?.fechaInicioEvento),
      fechaFinEvento: toDatetimeLocal(editingTorneo?.fechaFinEvento),
      deporteId: editingTorneo?.deporte?.id || 0
    }
  });

  const esPublico = watch('esPublico');
  const fechaInicioInscripcion = watch('fechaInicioInscripcion');
  const fechaFinInscripcion = watch('fechaFinInscripcion');
  const fechaInicioEvento = watch('fechaInicioEvento');

  useEffect(() => {
    getDeportes();
  }, [getDeportes]);

  const onSubmit = (data: TorneoFormFields) => {
    const deporteSeleccionado = deportes?.find(d => d.id === Number(data.deporteId));
    const torneoData: Partial<Torneo> = {
      nombre: data.nombre,
      esPublico: data.esPublico,
      contraseña: data.esPublico ? undefined : data.contraseña,
      cantEquiposMax: data.cantEquiposMax,
      fechaInicioInscripcion: parseDatetimeLocal(data.fechaInicioInscripcion)!,
      fechaFinInscripcion: parseDatetimeLocal(data.fechaFinInscripcion)!,
      fechaInicioEvento: parseDatetimeLocal(data.fechaInicioEvento)!,
      fechaFinEvento: parseDatetimeLocal(data.fechaFinEvento)!,
      deporte: deporteSeleccionado!
    };

    if (editingTorneo) {
      torneoData.id = editingTorneo.id;
    }

    onSave(torneoData);
    setShowModal(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div 
        className="modal-content-custom" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        <h2 className="modal-title mb-4">
          {editingTorneo ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              className={`form-control custom-input ${errors.nombre ? 'is-invalid' : ''}`}
              placeholder="Ej: Liga de Verano"
              {...register("nombre", { 
                required: "El nombre es obligatorio",
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres"
                }
              })}
            />
            {errors.nombre && (
              <span className="auth-error-text">{errors.nombre.message}</span>
            )}
          </div>

          {/* Deporte */}
          <div className="mb-3">
            <label className="form-label">Deporte *</label>
            <select
              className={`form-select custom-input ${errors.deporteId ? 'is-invalid' : ''}`}
              {...register("deporteId", { 
                required: "Debe seleccionar un deporte",
                validate: (value) => value > 0 || "Debe seleccionar un deporte válido"
              })}
            >
              <option value="0">-- Seleccione un deporte --</option>
              {Array.isArray(deportes) && deportes.map(d => (
                <option key={d.id} value={d.id}>{d.nombre}</option>
              ))}
            </select>
            {errors.deporteId && (
              <span className="auth-error-text">{errors.deporteId.message}</span>
            )}
          </div>

          {/* Cantidad máxima de equipos */}
          <div className="mb-3">
            <label className="form-label">Cantidad máxima de equipos *</label>
            <input
              type="number"
              className={`form-control custom-input ${errors.cantEquiposMax ? 'is-invalid' : ''}`}
              {...register("cantEquiposMax", { 
                required: "La cantidad de equipos es obligatoria",
                min: {
                  value: 2,
                  message: "Debe haber al menos 2 equipos"
                },
                max: {
                  value: 64,
                  message: "Máximo 64 equipos permitidos"
                },
                valueAsNumber: true
              })}
            />
            {errors.cantEquiposMax && (
              <span className="auth-error-text">{errors.cantEquiposMax.message}</span>
            )}
          </div>

          {/* Es público */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="esPublico"
              {...register("esPublico")}
            />
            <label className="form-check-label" htmlFor="esPublico">
              ¿Es público?
            </label>
          </div>

          {/* Contraseña (solo si es privado) */}
          {!esPublico && (
            <div className="mb-3">
              <label className="form-label">Contraseña *</label>
              <input
                type="password"
                className={`form-control custom-input ${errors.contraseña ? 'is-invalid' : ''}`}
                placeholder="Ingrese una contraseña"
                {...register("contraseña", { 
                  required: !esPublico ? "La contraseña es obligatoria para torneos privados" : false,
                  minLength: {
                    value: 4,
                    message: "La contraseña debe tener al menos 4 caracteres"
                  }
                })}
              />
              {errors.contraseña && (
                <span className="auth-error-text">{errors.contraseña.message}</span>
              )}
            </div>
          )}

          {/* Fechas de inscripción */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Inicio de inscripción *</label>
              <input
                type="datetime-local"
                className={`form-control custom-input ${errors.fechaInicioInscripcion ? 'is-invalid' : ''}`}
                {...register("fechaInicioInscripcion", { 
                  required: "La fecha de inicio de inscripción es obligatoria"
                })}
              />
              {errors.fechaInicioInscripcion && (
                <span className="auth-error-text">{errors.fechaInicioInscripcion.message}</span>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Fin de inscripción *</label>
              <input
                type="datetime-local"
                className={`form-control custom-input ${errors.fechaFinInscripcion ? 'is-invalid' : ''}`}
                {...register("fechaFinInscripcion", { 
                  required: "La fecha de fin de inscripción es obligatoria",
                  validate: (value) => {
                    if (!fechaInicioInscripcion) return true;
                    return new Date(value) > new Date(fechaInicioInscripcion) || 
                      "Debe ser posterior al inicio de inscripción";
                  }
                })}
              />
              {errors.fechaFinInscripcion && (
                <span className="auth-error-text">{errors.fechaFinInscripcion.message}</span>
              )}
            </div>
          </div>

          {/* Fechas del evento */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label">Inicio del evento *</label>
              <input
                type="datetime-local"
                className={`form-control custom-input ${errors.fechaInicioEvento ? 'is-invalid' : ''}`}
                {...register("fechaInicioEvento", { 
                  required: "La fecha de inicio del evento es obligatoria",
                  validate: (value) => {
                    if (!fechaFinInscripcion) return true;
                    return new Date(value) >= new Date(fechaFinInscripcion) || 
                      "Debe ser posterior o igual al fin de inscripción";
                  }
                })}
              />
              {errors.fechaInicioEvento && (
                <span className="auth-error-text">{errors.fechaInicioEvento.message}</span>
              )}
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Fin del evento *</label>
              <input
                type="datetime-local"
                className={`form-control custom-input ${errors.fechaFinEvento ? 'is-invalid' : ''}`}
                {...register("fechaFinEvento", { 
                  required: "La fecha de fin del evento es obligatoria",
                  validate: (value) => {
                    if (!fechaInicioEvento) return true;
                    return new Date(value) > new Date(fechaInicioEvento) || 
                      "Debe ser posterior al inicio del evento";
                  }
                })}
              />
              {errors.fechaFinEvento && (
                <span className="auth-error-text">{errors.fechaFinEvento.message}</span>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="d-flex gap-3">
            <button 
              type="button"
              className="btn btn-cancel-custom flex-grow-1" 
              onClick={() => setShowModal(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="btn btn-save-custom flex-grow-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Guardando...' : editingTorneo ? 'Guardar Cambios' : 'Crear Torneo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// import type { Torneo } from "../contexts/torneo";
// import type { Deporte } from "../contexts/deporte";
// import "./cssComponentes/DeporteFormModal.css";
// import "./cssComponentes/ConfirmModal.css";
// import { useDeporte } from "../hooks/useDeporte.tsx";
// import { useEffect } from "react";

// export default function TorneoFormModal({
//   setShowModal,
//   editingTorneo,
//   formData,
//   setFormData,
//   handleSave
// }: {
//   setShowModal: (show: boolean) => void;
//   editingTorneo: Torneo | null;
//   formData: {
//     nombre: string,
//     esPublico: boolean,
//     contraseña: string,
//     cantEquiposMax: number,
//     fechaInicioInscripcion: string,
//     fechaFinInscripcion: string,
//     fechaInicioEvento: string,
//     fechaFinEvento: string,
//     deporte: Deporte,
//   };
//   setFormData: (data: {
//     nombre: string,
//     esPublico: boolean,
//     contraseña: string,
//     cantEquiposMax: number,
//     fechaInicioInscripcion: string,
//     fechaFinInscripcion: string,
//     fechaInicioEvento: string,
//     fechaFinEvento: string,
//     deporte: Deporte,
//   }) => void;
//   handleSave: () => void;
// }) {

//   const { deportes, getDeportes } = useDeporte();

//   useEffect(() => {
//     getDeportes();
//   }, [getDeportes]);

//   return (
//     <div className="modal-overlay" onClick={() => setShowModal(false)}>
//       <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
//         <h2 className="modal-title mb-4">
//           {editingTorneo ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
//         </h2>

//         <div className="mb-3">
//           <label className="form-label">Nombre *</label>
//           <input
//             type="text"
//             className="form-control custom-input"
//             value={formData.nombre}
//             onChange={(e) => setFormData({...formData, nombre: e.target.value})}
//             placeholder="Ej: Liga de Verano"
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Cantidad maxima de equipos *</label>
//           <input
//             type="number"
//             className="form-control custom-input"
//             value={formData.cantEquiposMax}
//             onChange={(e) => setFormData({...formData, cantEquiposMax: parseInt(e.target.value) || 0})}
//             min="0"
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Deporte *</label>
//           <select
//             className="form-select"
//             value={formData.deporte?.id ?? ''}
//             onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
//               const id = Number(e.target.value);
//               const seleccionado = Array.isArray(deportes) ? deportes.find(d => d.id === id) ?? null : null;
//               setFormData({ ...formData, deporte: seleccionado ?? (formData.deporte ?? null) });
//             }}
//             required
//           >
//             <option value="">-- Seleccione deporte --</option>
//             {Array.isArray(deportes) && deportes.map(d => (
//               <option key={d.id} value={d.id}>{d.nombre}</option>
//             ))}
//           </select>
//         </div>
//         <div className="form-check mb-3">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             checked={formData.esPublico}
//             onChange={(e) => setFormData({...formData, esPublico: e.target.checked})}
//           />
//           <label className="form-check-label">
//             ¿Es público?
//           </label>
//         </div>
//         {!formData.esPublico && (
//           <div className="mb-3">
//             <label className="form-label">Contraseña *</label>
//             <input
//               type="password"
//               className="form-control custom-input"
//               value={formData.contraseña}
//               onChange={(e) => setFormData({...formData, contraseña: e.target.value})}
//               placeholder="Ingrese una contraseña"
//               required
//             />
//           </div>
//         )}
//         <div className="mb-3">
//           <label className="form-label">Fecha y hora de inicio de inscripción *</label>
//           <input
//             type="datetime-local"
//             className="form-control custom-input"
//             value={formData.fechaInicioInscripcion}
//             onChange={(e) => setFormData({...formData, fechaInicioInscripcion: e.target.value})}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Fecha y hora de fin de inscripción *</label>
//           <input
//             type="datetime-local"
//             className="form-control custom-input"
//             value={formData.fechaFinInscripcion}
//             onChange={(e) => setFormData({...formData, fechaFinInscripcion: e.target.value})}
//             required
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Fecha y hora de inicio del evento *</label>
//           <input
//             type="datetime-local"
//             className="form-control custom-input"
//             value={formData.fechaInicioEvento}
//             onChange={(e) => setFormData({...formData, fechaInicioEvento: e.target.value})}
//           />
//         </div>
//         <div className="mb-3">
//           <label className="form-label">Fecha y hora de fin del evento *</label>
//           <input
//             type="datetime-local"
//             className="form-control custom-input"
//             value={formData.fechaFinEvento}
//             onChange={(e) => setFormData({...formData, fechaFinEvento: e.target.value})}
//           />
//         </div>
//         <div className="d-flex gap-3">
//           <button className="btn btn-cancel-custom flex-grow-1" onClick={() => setShowModal(false)}>
//             Cancelar
//           </button>
//           <button className="btn btn-save-custom flex-grow-1" onClick={handleSave}>
//             {editingTorneo ? 'Guardar Cambios' : 'Crear Torneo'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }