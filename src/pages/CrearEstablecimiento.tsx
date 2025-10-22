import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// import { Form, Row, Col } from 'react-bootstrap';
// import { Submit } from '../components/ButtonField.tsx';
// import alert from '../components/Alert.tsx';
import axios from 'axios';
import './CrearEquipo.css';

export default function CrearEstablecimiento() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    evento: id,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      nombre: form.nombre,
      direccion: form.direccion,
      evento: id,
    };

    try {
      await axios.post('http://localhost:3000/api/establecimientos', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      setShowSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        // setMessage('Ocurrió un error desconocido.');
      } else {
        console.error('Error al crear establecimiento: ', error.message);
        // setMessage('Error al crear establecimiento: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="crear-equipo-container">
        <div className="crear-equipo-inner">
          {/* Header */}
          <div className="form-header">
            <button className="btn-back" onClick={() => navigate(-1)}>
              ← Volver
            </button>
            <h1 className="form-title">Crear Nuevo Establecimiento</h1>
            <p className="form-subtitle">
              Completa la información para agregar tu establecimiento en el
              torneo
            </p>
          </div>
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="crear-equipo-form">
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre del Establecimiento
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ej: Estadio Unico de la Plata"
                value={form.nombre}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
              <span className="form-hint">Mínimo 3 caracteres</span>
            </div>
            <div className="form-group">
              <label htmlFor="direccion" className="form-label">
                Dirección del Establecimiento
                <span className="required">*</span>
              </label>
              <input
                id="direccion"
                type="text"
                name="direccion"
                className="form-input"
                placeholder="Ej: Av. Siempre Viva 742"
                value={form.direccion}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={100}
              />
              <span className="form-hint">Mínimo 3 caracteres</span>
            </div>
            {/* Botones */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel-form"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn-submit-form"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    Creando equipo...
                  </>
                ) : (
                  <>Crear Equipo</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div
          className="modal-custom-overlay"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="modal-custom-content modal-success"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">Establecimiento Creado!</h2>
            </div>
            <div className="modal-custom-body">
              <p className="modal-info-text">
                Tu Establecimiento se ha creado correctamente.
              </p>
            </div>
            <div className="modal-custom-footer">
              <button
                className="btn-cancel-custom"
                onClick={() => {
                  setShowSuccess(false);
                  navigate(-1);
                }}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // return (
  //   <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
  //     {alert({ message, success })}
  //     <Form onSubmit={handleSubmit}>
  //       <Row>
  //         <Col md={6}>
  //           <Form.Group controlId="formNombre" className="mb-3">
  //             <Form.Label>Nombre</Form.Label>
  //             <Form.Control
  //               className="bg-bs-dark text-bg-dark border border-primary"
  //               type="text"
  //               placeholder="Ingrese el nombre del establecimiento"
  //               name="nombre"
  //               value={form.nombre}
  //               onChange={handleChange}
  //               required
  //             />
  //           </Form.Group>
  //         </Col>

  //         <Col md={6}>
  //           <Form.Group controlId="formDireccion" className="mb-3">
  //             <Form.Label>Dirección</Form.Label>
  //             <Form.Control
  //               className="bg-bs-dark text-bg-dark border border-primary"
  //               type="text"
  //               placeholder="Ingrese la dirección"
  //               name="direccion"
  //               value={form.direccion}
  //               onChange={handleChange}
  //               required
  //             />
  //           </Form.Group>
  //         </Col>
  //       </Row>

  //       <div className="text-center">
  //         <Submit>Guardar Establecimiento</Submit>
  //       </div>
  //     </Form>
  //   </div>
  // );
}
