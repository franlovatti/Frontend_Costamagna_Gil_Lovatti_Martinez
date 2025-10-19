import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';
import './CrearEquipo.css';

export default function CrearEquipo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const [form, setForm] = useState({
    nombre: '',
    esPublico: true,
    contraseña: '',
  });
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdTeamId, setCreatedTeamId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión para crear un equipo.');
      return;
    }

    if (!form.esPublico && !form.contraseña) {
      setError('La contraseña es obligatoria si el equipo es privado.');
      return;
    }
    
    if (form.nombre.trim().length < 3) {
      setError('El nombre del equipo debe tener al menos 3 caracteres.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const nuevoEquipo = {
      nombre: form.nombre,
      nombreCapitan: user.nombre,
      capitan: user.id,
      puntos: 0,
      esPublico: form.esPublico,
      privado: !form.esPublico,
      contraseña: !form.esPublico ? form.contraseña : null,
      miembros: [user.id],
      evento: Number(id),
    };

    try {
      const res = await axios.post(
        'http://localhost:3000/api/equipos',
        nuevoEquipo,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const newTeamId: number | undefined = res?.data?.data?.id ?? res?.data?.id;
      setCreatedTeamId(typeof newTeamId === 'number' ? newTeamId : null);
      setShowSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || 'Error al crear el equipo.';
        setError(message);
      } else {
        setError('Ocurrió un error desconocido.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="crear-equipo-container">
      <div className="crear-equipo-inner">
        {/* Header */}
        <div className="form-header">
          <button 
            className="btn-back"
            onClick={() => navigate(`/home/torneos/${id}`)}
          >
            ← Volver al torneo
          </button>
          <h1 className="form-title">Crear Nuevo Equipo</h1>
          <p className="form-subtitle">
            Completa la información para inscribir tu equipo en el torneo
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="equipo-form">
          <div className="form-card">
            {/* Nombre del equipo */}
            <div className="form-group">
              <label htmlFor="nombre" className="form-label">
                Nombre del Equipo
                <span className="required">*</span>
              </label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                className="form-input"
                placeholder="Ej: Los Campeones"
                value={form.nombre}
                onChange={handleChange}
                required
                minLength={3}
                maxLength={50}
              />
              <span className="form-hint">Mínimo 3 caracteres</span>
            </div>

            {/* Capitán (readonly) */}
            <div className="form-group">
              <label className="form-label">Capitán del Equipo</label>
              <input
                type="text"
                className="form-input form-input-readonly"
                value={user?.nombre || ''}
                readOnly
              />
              <span className="form-hint">Tú serás el capitán de este equipo</span>
            </div>

            {/* Visibilidad */}
            <div className="form-group">
              <label className="form-label">Visibilidad del Equipo</label>
              <div className="visibility-options">
                <label className="radio-card">
                  <input
                    type="radio"
                    name="esPublico"
                    checked={form.esPublico === true}
                    onChange={() => setForm(prev => ({ ...prev, esPublico: true, contraseña: '' }))}
                  />
                  <div className="radio-content">
                    <div className="radio-icon">🌍</div>
                    <div className="radio-text">
                      <div className="radio-title">Público</div>
                      <div className="radio-description">
                        Cualquier usuario puede unirse libremente
                      </div>
                    </div>
                  </div>
                </label>

                <label className="radio-card">
                  <input
                    type="radio"
                    name="esPublico"
                    checked={form.esPublico === false}
                    onChange={() => setForm(prev => ({ ...prev, esPublico: false }))}
                  />
                  <div className="radio-content">
                    <div className="radio-icon">🔒</div>
                    <div className="radio-text">
                      <div className="radio-title">Privado</div>
                      <div className="radio-description">
                        Requiere contraseña para unirse
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Contraseña (solo si es privado) */}
            {!form.esPublico && (
              <div className="form-group password-group">
                <label htmlFor="contraseña" className="form-label">
                  Contraseña del Equipo
                  <span className="required">*</span>
                </label>
                <input
                  id="contraseña"
                  type="password"
                  name="contraseña"
                  className="form-input"
                  placeholder="Ingrese una contraseña segura"
                  value={form.contraseña}
                  onChange={handleChange}
                  required={!form.esPublico}
                  minLength={4}
                />
                <span className="form-hint">
                  Comparte esta contraseña con los miembros que quieras invitar
                </span>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="alert-danger-custom">
                ⚠️ {error}
              </div>
            )}

            {/* Info adicional */}
            <div className="info-box">
              <div className="info-icon">ℹ️</div>
              <div className="info-text">
                <strong>Importante:</strong> Como capitán, podrás gestionar el equipo, 
                agregar o remover jugadores, y editar la información del equipo.
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel-form"
              onClick={() => navigate(`/home/torneos/${id}`)}
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
                <>
                  Crear Equipo
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de éxito */}
      {showSuccess && (
        <div className="modal-custom-overlay" onClick={() => setShowSuccess(false)}>
          <div className="modal-custom-content modal-success" onClick={(e) => e.stopPropagation()}>
            <div className="modal-custom-header">
              <h2 className="modal-custom-title">¡Equipo Creado!</h2>
            </div>
            <div className="modal-custom-body">
              <p className="modal-info-text">
                Tu equipo se ha creado correctamente. ¿Qué deseas hacer ahora?
              </p>
            </div>
            <div className="modal-custom-footer">
              <button
                className="btn-cancel-custom"
                onClick={() => {
                  setShowSuccess(false);
                  navigate(`/home/torneos/${id}`);
                }}
              >
                Ir al torneo
              </button>
              <button
                className="btn-save-custom"
                onClick={() => {
                  setShowSuccess(false);
                  if (createdTeamId) {
                    navigate(`/home/equipos/${createdTeamId}`);
                  } else {
                    navigate(`/home/torneos/${id}`);
                  }
                }}
              >
                Ver equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Form, Row, Col, Modal, Button as RBButton } from 'react-bootstrap';
// import { useAuth } from '../hooks/useAuth';
// import axios from 'axios';
// import { Submit } from '../components/ButtonField';

// export default function CrearEquipo() {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const { user } = useAuth();

//   const [form, setForm] = useState({
//     nombre: '',
//     esPublico: false,
//     contraseña: '',
//   });
//   const [error, setError] = useState('');
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [createdTeamId, setCreatedTeamId] = useState<number | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!user) {
//       alert('Debes iniciar sesión para crear un equipo.');
//       return;
//     }

//     if (!form.esPublico && !form.contraseña) {
//       setError('La contraseña es obligatoria si el equipo es privado.');
//       return;
//     }
//     setError('');

//     const nuevoEquipo = {
//       nombre: form.nombre,
//       nombreCapitan: user.nombre,
//       capitan: user.id,
//       puntos: 0,
//       esPublico: form.esPublico,
//       privado: !form.esPublico,
//       contraseña: !form.esPublico ? form.contraseña : null,
//       miembros: [user.id],
//       evento: Number(id),
//     };

//     console.debug('Payload nuevoEquipo (ids):', nuevoEquipo);

//     try {
//       const res = await axios.post(
//         'http://localhost:3000/api/equipos',
//         nuevoEquipo,
//         {
//           headers: { 'Content-Type': 'application/json' },
//         }
//       );
//       console.log('Equipo creado con éxito', res.data);
//       const newTeamId: number | undefined =
//         res?.data?.data?.id ?? res?.data?.id;
//       setCreatedTeamId(typeof newTeamId === 'number' ? newTeamId : null);
//       setShowSuccess(true);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error('Axios error response data:', err.response?.data);
//         const message =
//           err.response?.data?.message || 'Error al crear el equipo.';
//         console.error('Error al crear equipo:', message);
//         alert('Error al crear equipo: ' + message);
//       } else {
//         console.error('Error desconocido:', err);
//         alert('Ocurrió un error desconocido.');
//       }
//     }
//   };

//   return (
//     <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
//       <h2 className="text-center mb-4">Crear Nuevo Equipo</h2>
//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col md={12}>
//             <Form.Group controlId="formNombre" className="mb-3">
//               <Form.Label>Nombre del Equipo</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="text"
//                 placeholder="Ingrese el nombre del equipo"
//                 name="nombre"
//                 value={form.nombre}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//         </Row>

//         <Row>
//           <Col md={6}>
//             <Form.Group controlId="formPrivado" className="mb-3">
//               <Form.Check
//                 type="checkbox"
//                 label="¿Equipo es público?"
//                 name="esPublico"
//                 checked={form.esPublico}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//           </Col>

//           {!form.esPublico && (
//             <Col md={6}>
//               <Form.Group controlId="formContraseña" className="mb-3">
//                 <Form.Label>Contraseña del Equipo</Form.Label>
//                 <Form.Control
//                   className="bg-bs-dark text-bg-dark border border-primary"
//                   type="password"
//                   placeholder="Ingrese la contraseña"
//                   name="contraseña"
//                   value={form.contraseña}
//                   onChange={handleChange}
//                   required
//                 />
//               </Form.Group>
//             </Col>
//           )}
//         </Row>

//         {error && <p className="text-danger">{error}</p>}

//         <div className="text-center mt-3">
//           <Submit>Crear Equipo</Submit>
//         </div>
//       </Form>

//       <Modal show={showSuccess} onHide={() => setShowSuccess(false)} centered>
//         <Modal.Header
//           data-bs-theme="dark"
//           className="text-bg-dark border-primary"
//         >
//           <Modal.Title>Equipo creado</Modal.Title>
//         </Modal.Header>
//         <Modal.Body className="text-bg-dark">
//           ¡El equipo se creó correctamente!
//         </Modal.Body>
//         <Modal.Footer className="text-bg-dark border-primary">
//           <RBButton
//             variant="secondary"
//             onClick={() => {
//               setShowSuccess(false);
//               navigate(`/home/torneos/${id}`);
//             }}
//           >
//             Ir al torneo
//           </RBButton>
//           <RBButton
//             variant="primary"
//             onClick={() => {
//               setShowSuccess(false);
//               if (createdTeamId) {
//                 navigate(`/home/equipos/${createdTeamId}`);
//               } else {
//                 navigate(`/home/torneos/${id}`);
//               }
//             }}
//           >
//             Ver equipo
//           </RBButton>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }
