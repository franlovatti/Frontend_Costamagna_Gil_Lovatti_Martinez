// import { useState, useEffect } from 'react';
// import CardTorneos from '../components/CardTorneos';
// import { useNavigate } from 'react-router-dom';
// import apiAxios from '../helpers/api';
// import type { Torneo, Deporte, Localidad, Usuario, Equipo } from '../types';
// import { useAuth } from '../hooks/useAuth';
// import './Torneos.css';

// export default function Torneos() {
//   const [dataTorneos, setDataTorneos] = useState<Torneo[]>([]);
//   const [selectedSport, setSelectedSport] = useState<string>('');
//   const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');
//   const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
//   const [dataLocalidades, setDataLocalidades] = useState<Localidad[]>([]);
//   const [errorConexion, setErrorConexion] = useState<boolean>(false);
  
//   // Modal de código
//   const [showCodeModal, setShowCodeModal] = useState(false);
//   const [code, setCode] = useState('');
//   const [codeError, setCodeError] = useState<string | null>(null);
//   const [resolving, setResolving] = useState(false);
  
//   // Modal de inscripción a evento
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [selectedEvent, setSelectedEvent] = useState<Torneo | null>(null);
//   const [eventPwd, setEventPwd] = useState('');
//   const [eventError, setEventError] = useState<string | null>(null);
//   const [eventSubmitting, setEventSubmitting] = useState(false);
  
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   useEffect(() => {
//     Promise.all([
//       apiAxios.get('/eventos'),
//       apiAxios.get('/deportes'),
//       apiAxios.get('/localidades'),
//     ])
//       .then(([torneosRes, deportesRes, localidadesRes]) => {
//         setDataTorneos(torneosRes.data.data);
//         setDataDeportes(deportesRes.data.data);
//         setDataLocalidades(localidadesRes.data.data);
//       })
//       .catch((error) => {
//         console.error('Error fetching data:', error);
//         setErrorConexion(true);
//       });
//   }, []);

//   const handleClick = (id: number) => {
//     navigate(`/home/torneos/${id}`);
//   };

//   const handleEnrollFromCard = async (evt: Torneo) => {
//     setSelectedEvent(evt);
//     setEventPwd('');
//     setEventError(null);
//     setShowEventModal(true);
//   };

//   const handleSubmitEventEnroll = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     if (!selectedEvent) return;
//     setEventError(null);
//     setEventSubmitting(true);
//     try {
//       if (selectedEvent.esPublico === false) {
//         const requiredPwd = selectedEvent.contraseña;
//         if (!eventPwd.trim()) {
//           setEventError('Ingrese la contraseña');
//           return;
//         }
//         if (eventPwd !== requiredPwd) {
//           setEventError('Contraseña incorrecta');
//           return;
//         }
//       }
//       setShowEventModal(false);
//       navigate(`/home/torneos/${selectedEvent.id}`);
//     } catch (err) {
//       console.error('Error preparando inscripción:', err);
//       setEventError('No se pudo validar el torneo. Intente nuevamente.');
//     } finally {
//       setEventSubmitting(false);
//     }
//   };

//   const userIsMemberOf = (torneo: Torneo): boolean => {
//     if (!user || !torneo?.equipos) return false;
//     const userIdStr = String(user.id);
//     return torneo.equipos.some((e: Equipo) => {
//       const miembros = (e.miembros as Usuario[]) ?? [];
//       return miembros.some((m) => String(m.id) === userIdStr);
//     });
//   };

//   const openCodeModal = () => {
//     setCode('');
//     setCodeError(null);
//     setShowCodeModal(true);
//   };

//   const handleResolveCode = async (e?: React.FormEvent) => {
//     e?.preventDefault();
//     const trimmed = code.trim();
//     if (!trimmed) {
//       setCodeError('Ingrese un código');
//       return;
//     }
//     setResolving(true);
//     try {
//       const res = await apiAxios.get(
//         `/eventos/codigo/${encodeURIComponent(trimmed)}`
//       );
//       const evento = res.data?.data ?? res.data;
//       if (evento && typeof evento.id === 'number') {
//         setShowCodeModal(false);
//         handleEnrollFromCard(evento as Torneo);
//       } else {
//         setCodeError('Código inválido');
//       }
//     } catch {
//       setCodeError('No se encontró un torneo con ese código');
//     } finally {
//       setResolving(false);
//     }
//   };

//   const torneosFiltrados = dataTorneos.filter(
//     (torneo) =>
//       (!selectedSport || String(torneo.deporte.nombre) === selectedSport) &&
//       (!selectedLocalidad || String(torneo.localidad.nombre) === selectedLocalidad)
//   );

//   return (
//     <div className="torneos-page-container">
//       <div className="torneos-inner-container">
//         {/* Header */}
//         <div className="torneos-header">
//           <h1>Torneos</h1>
//           <p className="torneos-subtitle">
//             Explora y únete a los torneos deportivos disponibles
//           </p>
//         </div>

//         {/* Error de conexión */}
//         {errorConexion && (
//           <div className="alert-danger-custom">
//             Ocurrió un error al recuperar los datos. Por favor, inténtelo de nuevo.
//           </div>
//         )}

//         {/* Toolbar */}
//         <div className="torneos-toolbar">
//           <div className="toolbar-actions">
//             <button className="btn-toolbar" onClick={openCodeModal}>
//               Ingresar código
//             </button>
//             <button className="btn-save-custom" onClick={() => navigate('crear-torneo')}>
//               Crear Torneo
//             </button>
//             <select
//               className="filtro-select-toolbar"
//               value={selectedSport}
//               onChange={(e) => setSelectedSport(e.target.value)}
//             >
//               <option value="">Todos los deportes</option>
//               {dataDeportes.map((sport) => (
//                 <option key={sport.id} value={sport.nombre}>
//                   {sport.nombre}
//                 </option>
//               ))}
//             </select>
//             <select
//               className="filtro-select-toolbar"
//               value={selectedLocalidad}
//               onChange={(e) => setSelectedLocalidad(e.target.value)}
//             >
//               <option value="">Todas las localidades</option>
//               {dataLocalidades.map((localidad) => (
//                 <option key={localidad.id} value={localidad.nombre}>
//                   {localidad.nombre}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* Grid de torneos */}
//         {torneosFiltrados.length === 0 ? (
//           <div className="torneos-empty-state">
//             <div className="empty-state-icon">🏆</div>
//             <p className="empty-state-text">No se encontraron torneos</p>
//           </div>
//         ) : (
//           <div className="torneos-grid">
//             {torneosFiltrados.map((torneo) => (
//               <CardTorneos
//                 key={torneo.id}
//                 torneo={torneo}
//                 handleClick={handleClick}
//                 isMember={userIsMemberOf(torneo)}
//                 onEnroll={handleEnrollFromCard}
//               />
//             ))}
//           </div>
//         )}

//         {/* Modal de código */}
//         {showCodeModal && (
//           <div className="modal-custom-overlay" onClick={() => setShowCodeModal(false)}>
//             <div className="modal-custom-content" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-custom-header">
//                 <h2 className="modal-custom-title">Ingresar código de torneo</h2>
//                 <button className="modal-custom-close" onClick={() => setShowCodeModal(false)}>
//                   ✕
//                 </button>
//               </div>
//               <form onSubmit={handleResolveCode}>
//                 <div className="modal-custom-body">
//                   <div className="modal-form-group">
//                     <label className="modal-form-label">Código</label>
//                     <input
//                       type="text"
//                       className="modal-form-input"
//                       placeholder="p. ej. ABC123"
//                       value={code}
//                       onChange={(e) => {
//                         setCode(e.target.value.toUpperCase());
//                         if (codeError) setCodeError(null);
//                       }}
//                       autoFocus
//                     />
//                     {codeError && <div className="modal-error-text">{codeError}</div>}
//                   </div>
//                 </div>
//                 <div className="modal-custom-footer">
//                   <button
//                     type="button"
//                     className="modal-btn modal-btn-secondary"
//                     onClick={() => setShowCodeModal(false)}
//                     disabled={resolving}
//                   >
//                     Cancelar
//                   </button>
//                   <button
//                     type="submit"
//                     className="modal-btn modal-btn-primary"
//                     disabled={resolving}
//                   >
//                     {resolving ? 'Buscando...' : 'Ir al torneo'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Modal de inscripción al evento */}
//         {showEventModal && selectedEvent && (
//           <div className="modal-custom-overlay" onClick={() => setShowEventModal(false)}>
//             <div className="modal-custom-content" onClick={(e) => e.stopPropagation()}>
//               <div className="modal-custom-header">
//                 <h2 className="modal-custom-title">
//                   {selectedEvent.esPublico === false
//                     ? 'Inscribirse a torneo privado'
//                     : 'Inscribirse al torneo'}
//                 </h2>
//                 <button className="modal-custom-close" onClick={() => setShowEventModal(false)}>
//                   ✕
//                 </button>
//               </div>
//               <form onSubmit={handleSubmitEventEnroll}>
//                 <div className="modal-custom-body">
//                   <p className="modal-info-text">
//                     Torneo: <strong>{selectedEvent.nombre}</strong>
//                   </p>
//                   {selectedEvent.esPublico === false ? (
//                     <div className="modal-form-group">
//                       <label className="modal-form-label">Contraseña del torneo</label>
//                       <input
//                         type="password"
//                         className="modal-form-input"
//                         placeholder="Ingrese la contraseña"
//                         value={eventPwd}
//                         onChange={(e) => {
//                           setEventPwd(e.target.value);
//                           if (eventError) setEventError(null);
//                         }}
//                         autoFocus
//                       />
//                     </div>
//                   ) : (
//                     <p className="modal-info-text">
//                       Este torneo es público. ¿Desea continuar y ver los detalles para
//                       inscribirse?
//                     </p>
//                   )}
//                   {eventError && <div className="modal-error-text">{eventError}</div>}
//                 </div>
//                 <div className="modal-custom-footer">
//                   <button
//                     type="button"
//                     className="modal-btn modal-btn-secondary"
//                     onClick={() => setShowEventModal(false)}
//                     disabled={eventSubmitting}
//                   >
//                     Cancelar
//                   </button>
//                   <button
//                     type="submit"
//                     className="modal-btn modal-btn-primary"
//                     disabled={eventSubmitting}
//                   >
//                     {eventSubmitting ? 'Validando...' : 'Continuar'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
