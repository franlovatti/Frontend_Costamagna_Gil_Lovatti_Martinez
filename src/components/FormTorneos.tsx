import { useEffect, useState } from 'react';
import apiAxios from '../helpers/api';
import type { Localidad, Deporte } from '../types';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './cssComponentes/FormTorneos.css';

export default function FormTorneos() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    deporte: 0,
    descripcion: '',
    fechaInicioInscripcion: '',
    fechaFinInscripcion: '',
    fechaInicioTorneo: '',
    fechaFinTorneo: '',
    localidad: 0,
    esPublico: true,
    contraseña: '',
    cantidadEquipos: 2,
  });
  const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
  const [dataLocalidades, setDataLocalidades] = useState<Localidad[]>([]);
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string>('');
  const [errorConexion, setErrorConexion] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = !!id;

  useEffect(() => {
    Promise.all([
      apiAxios.get('/deportes'),
      apiAxios.get('/localidades')
    ])
      .then(([deportesRes, localidadesRes]) => {
        setDataDeportes(deportesRes.data.data);
        setDataLocalidades(localidadesRes.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setErrorConexion(true);
      });
  }, []);

  useEffect(() => {
    if (!id) return;
    apiAxios.get(`/eventos/${id}`).then((res) => {
      const torneo = res.data.data;
      setForm({
        nombre: torneo.nombre,
        deporte: torneo.deporte.id,
        descripcion: torneo.descripcion,
        fechaInicioInscripcion: torneo.fechaInicioInscripcion.split('T')[0],
        fechaFinInscripcion: torneo.fechaFinInscripcion.split('T')[0],
        fechaInicioTorneo: torneo.fechaInicioEvento.split('T')[0],
        fechaFinTorneo: torneo.fechaFinEvento.split('T')[0],
        localidad: torneo.localidad.id,
        esPublico: torneo.esPublico,
        contraseña: torneo.esPublico ? '' : torneo.contraseña,
        cantidadEquipos: torneo.cantEquiposMax,
      });
    });
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name === 'esPublico' && type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        esPublico: isChecked,
        contraseña: isChecked ? '' : prev.contraseña,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    if (error) setError('');
  };

  const validateForm = (): string | null => {
    if (form.nombre.trim().length < 3) {
      return 'El nombre del torneo debe tener al menos 3 caracteres';
    }
    if (!form.deporte || form.deporte === 0) {
      return 'Debes seleccionar un deporte';
    }
    if (!form.localidad || form.localidad === 0) {
      return 'Debes seleccionar una localidad';
    }
    if (form.descripcion.trim().length < 10) {
      return 'La descripción debe tener al menos 10 caracteres';
    }
    if (new Date(form.fechaFinInscripcion) < new Date(form.fechaInicioInscripcion)) {
      return 'La fecha de fin de inscripción debe ser posterior al inicio';
    }
    if (new Date(form.fechaFinTorneo) < new Date(form.fechaInicioTorneo)) {
      return 'La fecha de fin del torneo debe ser posterior al inicio';
    }
    if (new Date(form.fechaInicioTorneo) < new Date(form.fechaFinInscripcion)) {
      return 'El torneo debe comenzar después de finalizar las inscripciones';
    }
    if (!form.esPublico && !form.contraseña.trim()) {
      return 'La contraseña es obligatoria para torneos privados';
    }
    if (!form.cantidadEquipos || form.cantidadEquipos < 2 || form.cantidadEquipos > 64) {
      return 'La cantidad de equipos debe ser entre 2 y 64';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      deporte: Number(form.deporte),
      localidad: Number(form.localidad),
      esPublico: form.esPublico,
      cantEquiposMax: form.cantidadEquipos,
      fechaInicioInscripcion: new Date(form.fechaInicioInscripcion).toISOString(),
      fechaFinInscripcion: new Date(form.fechaFinInscripcion).toISOString(),
      fechaInicioEvento: new Date(form.fechaInicioTorneo).toISOString(),
      fechaFinEvento: new Date(form.fechaFinTorneo).toISOString(),
      contraseña: form.esPublico ? null : form.contraseña || '',
    };

    try {
      if (id !== undefined) {
        await apiAxios.put(`/eventos/${id}`, payload);
        navigate(`/home/torneos/${id}`);
      } else {
        const response = await apiAxios.post('/eventos', payload);
        navigate(`/home/torneos/${response.data.data.id}`);
      }
    } catch (error: unknown) {
      console.error('Error al procesar el formulario:', error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error al procesar el formulario');
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-torneos-container">
      <div className="form-torneos-inner">
        {/* Header */}
        <div className="form-header">
          <button 
            className="btn-back"
            onClick={() => navigate('/home/torneos')}
            type="button"
          >
            ← Volver a torneos
          </button>
          <h1 className="form-title">
            {isEditing ? 'Editar Torneo' : 'Crear Nuevo Torneo'}
          </h1>
          <p className="form-subtitle">
            {isEditing 
              ? 'Modifica la información de tu torneo' 
              : 'Completa la información para crear tu torneo deportivo'}
          </p>
        </div>

        {/* Errores */}
        {errorConexion && (
          <div className="alert-danger-custom">
            ⚠️ Error al cargar los datos. Por favor, recarga la página.
          </div>
        )}

        {error && (
          <div className="alert-danger-custom">
            ⚠️ {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="torneo-form">
          {/* Información Básica */}
          <div className="form-section">
            <h2 className="section-title-form">Información Básica</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Torneo
                    <span className="required">*</span>
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    className="form-input"
                    placeholder="Ej: Copa de Verano 2024"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                    minLength={3}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="deporte" className="form-label">
                    Deporte
                    <span className="required">*</span>
                  </label>
                  <select
                    id="deporte"
                    name="deporte"
                    className="form-select"
                    value={form.deporte}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione el deporte</option>
                    {dataDeportes.map((deporte) => (
                      <option key={deporte.id} value={deporte.id}>
                        {deporte.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="descripcion" className="form-label">
                  Descripción
                  <span className="required">*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  className="form-textarea"
                  rows={4}
                  placeholder="Describe el torneo, reglas especiales, premios, etc."
                  value={form.descripcion}
                  onChange={handleChange}
                  required
                  minLength={10}
                />
                <span className="form-hint">Mínimo 10 caracteres</span>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="form-section">
            <h2 className="section-title-form">Fechas Importantes</h2>
            <div className="form-card">
              <div className="dates-section">
                <div className="dates-group">
                  <h3 className="dates-group-title">Período de Inscripciones</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fechaInicioInscripcion" className="form-label">
                        Inicio
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaInicioInscripcion"
                        type="date"
                        name="fechaInicioInscripcion"
                        className="form-input"
                        value={form.fechaInicioInscripcion}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaFinInscripcion" className="form-label">
                        Fin
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaFinInscripcion"
                        type="date"
                        name="fechaFinInscripcion"
                        className="form-input"
                        value={form.fechaFinInscripcion}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="dates-divider"></div>

                <div className="dates-group">
                  <h3 className="dates-group-title">Período del Torneo</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fechaInicioTorneo" className="form-label">
                        Inicio
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaInicioTorneo"
                        type="date"
                        name="fechaInicioTorneo"
                        className="form-input"
                        value={form.fechaInicioTorneo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="fechaFinTorneo" className="form-label">
                        Fin
                        <span className="required">*</span>
                      </label>
                      <input
                        id="fechaFinTorneo"
                        type="date"
                        name="fechaFinTorneo"
                        className="form-input"
                        value={form.fechaFinTorneo}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuración */}
          <div className="form-section">
            <h2 className="section-title-form">Configuración</h2>
            <div className="form-card">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="localidad" className="form-label">
                    Localidad
                    <span className="required">*</span>
                  </label>
                  <select
                    id="localidad"
                    name="localidad"
                    className="form-select"
                    value={form.localidad}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione la localidad</option>
                    {dataLocalidades.map((localidad) => (
                      <option key={localidad.id} value={localidad.id}>
                        {localidad.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Cantidad de Equipos
                    <span className="required">*</span>
                  </label>
                  <input
                    id="cantidadEquipos"
                    type="number"
                    name="cantidadEquipos"
                    className="form-input"
                    min={2}
                    max={64}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Visibilidad */}
              <div className="form-group">
                <label className="form-label">Visibilidad del Torneo</label>
                <div className="visibility-options">
                  <label className="radio-card">
                    <input
                      type="radio"
                      name="visibilidad"
                      checked={form.esPublico === true}
                      onChange={() => setForm(prev => ({ ...prev, esPublico: true, contraseña: '' }))}
                    />
                    <div className="radio-content">
                      <div className="radio-icon">🌍</div>
                      <div className="radio-text">
                        <div className="radio-title">Público</div>
                        <div className="radio-description">
                          Visible para todos los usuarios
                        </div>
                      </div>
                    </div>
                  </label>

                  <label className="radio-card">
                    <input
                      type="radio"
                      name="visibilidad"
                      checked={form.esPublico === false}
                      onChange={() => setForm(prev => ({ ...prev, esPublico: false }))}
                    />
                    <div className="radio-content">
                      <div className="radio-icon">🔒</div>
                      <div className="radio-text">
                        <div className="radio-title">Privado</div>
                        <div className="radio-description">
                          Requiere código o contraseña
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Contraseña si es privado */}
              {!form.esPublico && (
                <div className="form-group password-group">
                  <label htmlFor="contraseña" className="form-label">
                    Contraseña del Torneo
                    <span className="required">*</span>
                  </label>
                  <input
                    id="contraseña"
                    type="password"
                    name="contraseña"
                    className="form-input"
                    placeholder="Ingrese una contraseña"
                    value={form.contraseña}
                    onChange={handleChange}
                    required={!form.esPublico}
                    minLength={4}
                  />
                  <span className="form-hint">
                    Los usuarios necesitarán esta contraseña para acceder al torneo
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel-form"
              onClick={() => navigate(isEditing ? `/home/torneos/${id}` : '/home/torneos')}
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
                  {isEditing ? 'Guardando...' : 'Creando...'}
                </>
              ) : (
                <>
                  {isEditing ? '✓ Guardar Cambios' : '✓ Crear Torneo'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// import { useEffect, useState } from 'react';
// import { Form, Button, Row, Col } from 'react-bootstrap';
// import apiAxios from '../helpers/api';
// import type { Localidad, Deporte } from '../types';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';

// export default function FormTorneos() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     nombre: '',
//     deporte: 0,
//     descripcion: '',
//     fechaInicioInscripcion: '',
//     fechaFinInscripcion: '',
//     fechaInicioTorneo: '',
//     fechaFinTorneo: '',
//     localidad: 0,
//     esPublico: true,
//     contraseña: '',
//   });
//   const [cantidadEquipos, setCantidadEquipos] = useState<number>(32);
//   const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
//   const [dataLocalidades, setDataLocalidades] = useState<Localidad[]>([]);
//   const { id } = useParams<{ id: string }>();
//   const [error, setError] = useState<boolean>(false);
//   const [errorMsg, setErrorMsg] = useState<string>('');
//   const [errorConexion, setErrorConexion] = useState<boolean>(false);

//   useEffect(() => {
//     apiAxios
//       .get('/deportes')
//       .then((response) => {
//         {
//           setDataDeportes(response.data.data);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching deportes:', error);
//         setErrorConexion(true);
//       });
//     apiAxios
//       .get('/localidades')
//       .then((response) => {
//         {
//           setDataLocalidades(response.data.data);
//         }
//       })
//       .catch((error) => {
//         console.error('Error fetching localidades:', error);
//         setErrorConexion(true);
//       });
//   }, []);

//   useEffect(() => {
//     if (!id) return;
//     apiAxios.get(`/eventos/${id}`).then((res) => {
//       const torneo = res.data.data;
//       console.log(torneo);
//       setForm({
//         nombre: torneo.nombre,
//         deporte: torneo.deporte.id,
//         descripcion: torneo.descripcion,
//         fechaInicioInscripcion: torneo.fechaInicioInscripcion.split('T')[0],
//         fechaFinInscripcion: torneo.fechaFinInscripcion.split('T')[0],
//         fechaInicioTorneo: torneo.fechaInicioEvento.split('T')[0],
//         fechaFinTorneo: torneo.fechaFinEvento.split('T')[0],
//         localidad: torneo.localidad.id,
//         esPublico: torneo.esPublico,
//         contraseña: torneo.esPublico ? '' : torneo.contraseña,
//       });
//       setCantidadEquipos(torneo.cantEquiposMax);
//     });
//   }, [id]);

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value, type } = e.target;
//     if (name === 'esPublico' && type === 'checkbox') {
//       const isChecked = (e.target as HTMLInputElement).checked;
//       setForm((prev) => ({
//         ...prev,
//         esPublico: isChecked,
//         contraseña: isChecked ? '' : prev.contraseña,
//       }));
//     } else {
//       setForm((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const payload = {
//       nombre: form.nombre,
//       descripcion: form.descripcion,
//       deporte: Number(form.deporte),
//       localidad: Number(form.localidad),
//       esPublico: form.esPublico,
//       cantEquiposMax: cantidadEquipos,
//       fechaInicioInscripcion: new Date(
//         form.fechaInicioInscripcion
//       ).toISOString(),
//       fechaFinInscripcion: new Date(form.fechaFinInscripcion).toISOString(),
//       fechaInicioEvento: new Date(form.fechaInicioTorneo).toISOString(),
//       fechaFinEvento: new Date(form.fechaFinTorneo).toISOString(),
//       contraseña: form.esPublico ? null : form.contraseña || '', // Contraseña solo si es privado
//     };

//     try {
//       if (id !== undefined) {
//         await apiAxios.put(`/eventos/${id}`, payload);
//         navigate(`/home/torneos/${id}`);
//       } else {
//         const response = await apiAxios.post('/eventos', payload);
//         console.log('Torneo creado:', response.data);
//         navigate(`/home/torneos/${response.data.data.id}`);
//       }
//     } catch (error: unknown) {
//       console.error('Error al procesar el formulario:', error);

//       if (axios.isAxiosError(error)) {
//         setErrorMsg(error.response?.data?.message || '');
//       } else {
//         setErrorMsg('Ocurrió un error inesperado');
//       }

//       setError(true);
//     }
//   };
//   return (
//     <div className="text-bg-dark container">
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           Ocurrió un error al procesar el formulario. Por favor, inténtelo de
//           nuevo. {errorMsg}
//         </div>
//       )}
//       {errorConexion && (
//         <div className="alert alert-danger" role="alert">
//           Ocurrió un error al recuperar los datos. Por favor, inténtelo de
//           nuevo.
//         </div>
//       )}

//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col md={6}>
//             <Form.Group className="mb-3" controlId="formTournamentName">
//               <Form.Label>Nombre del Torneo</Form.Label>
//               <Form.Control
//                 type="text"
//                 placeholder="Ingrese el nombre del torneo"
//                 name="nombre"
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 value={form.nombre}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Label>Deporte</Form.Label>
//             <Form.Select
//               aria-label="Deporte"
//               name="deporte"
//               className="bg-bs-dark text-bg-dark border border-primary"
//               value={form.deporte}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Seleccione el deporte</option>
//               {dataDeportes.map((deporte) => (
//                 <option key={deporte.id} value={deporte.id}>
//                   {deporte.nombre}
//                 </option>
//               ))}
//             </Form.Select>
//           </Col>
//         </Row>
//         <Form.Group className="mb-3" controlId="formTournamentDescription">
//           <Form.Label>Descripción</Form.Label>
//           <Form.Control
//             className="bg-bs-dark text-bg-dark border border-primary"
//             as="textarea"
//             rows={3}
//             placeholder="Ingrese una descripción del torneo"
//             name="descripcion"
//             value={form.descripcion}
//             onChange={handleChange}
//             required
//           />
//         </Form.Group>

//         <Row>
//           <Col md={6}>
//             <Form.Group className="mb-3" controlId={`fechaInicioInscripcion`}>
//               <Form.Label>Inicio Inscripcion</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="date"
//                 name="fechaInicioInscripcion"
//                 value={form.fechaInicioInscripcion}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className="mb-3" controlId={`fechaFinInscripcion`}>
//               <Form.Label>Fin Inscripcion</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="date"
//                 name="fechaFinInscripcion"
//                 value={form.fechaFinInscripcion}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className="mb-3" controlId={`fechaInicioTorneo`}>
//               <Form.Label>Inicio del Torneo</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="date"
//                 name="fechaInicioTorneo"
//                 value={form.fechaInicioTorneo}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//           <Col md={6}>
//             <Form.Group className="mb-3" controlId={`fechaFinTorneo`}>
//               <Form.Label>Fin del Torneo</Form.Label>
//               <Form.Control
//                 className="bg-bs-dark text-bg-dark border border-primary"
//                 type="date"
//                 name="fechaFinTorneo"
//                 value={form.fechaFinTorneo}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//           </Col>
//         </Row>
//         <Row>
//           <Col md={6} className="mb-3">
//             <Form.Label>Localidad</Form.Label>
//             <Form.Select
//               className="bg-bs-dark text-bg-dark border border-primary"
//               aria-label="Localidad"
//               name="localidad"
//               value={form.localidad}
//               onChange={handleChange}
//               required
//             >
//               <option value="">Seleccione la localidad</option>
//               {dataLocalidades.map((localidad) => (
//                 <option key={localidad.id} value={localidad.id}>
//                   {localidad.nombre}
//                 </option>
//               ))}
//             </Form.Select>
//           </Col>
//           <Col md={6}>
//             <Form.Label>Cantidad de Equipos: {cantidadEquipos}</Form.Label>
//             <Form.Range
//               min={2}
//               max={64}
//               step={Math.pow(2, 1)}
//               value={cantidadEquipos}
//               onChange={(e) => setCantidadEquipos(Number(e.target.value))}
//             />
//           </Col>
//         </Row>
//         <Form.Group className="mb-3" controlId="formBasicCheckbox">
//           <Form.Check
//             type="checkbox"
//             label="Público"
//             name="esPublico"
//             checked={form.esPublico}
//             onChange={handleChange}
//           />
//         </Form.Group>
//         {!form.esPublico && (
//           <Form.Group className="mb-3" controlId="contraseña">
//             <Form.Label>Contraseña</Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Ingrese la contraseña"
//               name="contraseña"
//               value={form.contraseña}
//               onChange={handleChange}
//               className="bg-bs-dark text-bg-dark border border-primary"
//             />
//           </Form.Group>
//         )}
//         <Button variant="primary" type="submit">
//           {id ? 'Editar' : 'Crear'} Torneo
//         </Button>
//       </Form>
//     </div>
//   );
// }
