import { useState } from 'react';
import './TorneosAdmin.css';
import SearchBar from '../components/SearchBar.tsx';
import type { Torneo } from '../contexts/torneo.tsx';
// import type { Deporte } from '../contexts/deporte.tsx';
import { useTorneo } from '../hooks/useTorneo.tsx';
import TorneoCard from '../components/TorneoCard.tsx';
import ConfirmModal from '../components/ConfirmModal.tsx';
import TorneoFormModal from '../components/TorneoFormModal.tsx';

const TorneosAdmin = () => {
  const { torneos, borrarTorneo, modificarTorneo, crearTorneo } = useTorneo();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTorneo, setEditingTorneo] = useState<Torneo | null>(null);
  const [showModal, setShowModal] = useState(false);
  // const [formData, setFormData] = useState({
  //   nombre: '',
  //   esPublico: true,
  //   contraseña: '',
  //   cantEquiposMax: 0,
  //   fechaInicioInscripcion: '',
  //   fechaFinInscripcion: '',
  //   fechaInicioEvento: '',
  //   fechaFinEvento: '',
  //   deporte: '' as unknown as Deporte,
  // });

  // Filtrar torneos
  const torneosFiltrados = torneos.filter(torneo =>
    torneo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
   const handleCreate = () => {
    setEditingTorneo(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (torneo: Torneo) => {
    setEditingTorneo(torneo);
    setShowModal(true);
  };

  // Guardar (crear o editar)
  const handleSave = (torneoData: Partial<Torneo>) => {
    if (editingTorneo) {
      modificarTorneo({ ...torneoData, id: editingTorneo.id } as Torneo);
    } else {
      console.log("Se esta creando el torneo: ", torneoData);
      crearTorneo(torneoData as Torneo);
    }
  };

  // // Abrir modal para crear
  // const handleCreate = () => {
  //   setEditingTorneo(null);
  //   setFormData({
  //     nombre: '',
  //     esPublico: true,
  //     contraseña: '',
  //     cantEquiposMax: 0,
  //     fechaInicioInscripcion: '',
  //     fechaFinInscripcion: '',
  //     fechaInicioEvento: '',
  //     fechaFinEvento: '',
  //     deporte: '' as unknown as Deporte,
  //   });
  //   setShowModal(true);
  // };

  // // Abrir modal para editar
  // const handleEdit = (torneo: Torneo) => {
  //   setEditingTorneo(torneo);
  //   setFormData({
  //     nombre: torneo.nombre,
  //     esPublico: torneo.esPublico,
  //     contraseña: torneo.contraseña || '',
  //     cantEquiposMax: torneo.cantEquiposMax,
  //     fechaInicioInscripcion: toDatetimeLocal(torneo.fechaInicioInscripcion),
  //     fechaFinInscripcion: toDatetimeLocal(torneo.fechaFinInscripcion),
  //     fechaInicioEvento: toDatetimeLocal(torneo.fechaInicioEvento),
  //     fechaFinEvento: toDatetimeLocal(torneo.fechaFinEvento),
  //     deporte: torneo.deporte,
  //   });
  //   setShowModal(true);
  // };

  // // Guardar (crear o editar)
  // const handleSave = () => {
  //   if (editingTorneo) {
  //     // Editar
  //     const torneo: Torneo = {
  //       ...editingTorneo,
  //       nombre: formData.nombre,
  //       esPublico: formData.esPublico,
  //       contraseña: formData.contraseña || undefined,
  //       cantEquiposMax: formData.cantEquiposMax,
  //       fechaInicioInscripcion: parseDatetimeLocal(formData.fechaInicioInscripcion)!,
  //       fechaFinInscripcion: parseDatetimeLocal(formData.fechaFinInscripcion)!,
  //       fechaInicioEvento: parseDatetimeLocal(formData.fechaInicioEvento)!,
  //       fechaFinEvento: parseDatetimeLocal(formData.fechaFinEvento)!,
  //       deporte: formData.deporte,
  //     };
  //     modificarTorneo(torneo);
  //   } else {
  //     const newTorneo: Torneo = {
  //       nombre: formData.nombre,
  //       esPublico: formData.esPublico,
  //       contraseña: formData.contraseña || undefined,
  //       cantEquiposMax: formData.cantEquiposMax,
  //       fechaInicioInscripcion: parseDatetimeLocal(formData.fechaInicioInscripcion)!,
  //       fechaFinInscripcion: parseDatetimeLocal(formData.fechaFinInscripcion)!,
  //       fechaInicioEvento: parseDatetimeLocal(formData.fechaInicioEvento)!,
  //       fechaFinEvento: parseDatetimeLocal(formData.fechaFinEvento)!,
  //       deporte: formData.deporte,
  //     };
  //     crearTorneo(newTorneo);
  //   }

  //   setShowModal(false);
  // };

  const [showConfirm, setShowConfirm] = useState(false);
  const [torneoAEliminar, setTorneoAEliminar] = useState<Torneo | null>(null);

  const handleDelete = (torneo: Torneo) => {
    setTorneoAEliminar(torneo);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (torneoAEliminar !== null) {
      await borrarTorneo(torneoAEliminar.id!);
    }
    setShowConfirm(false);
    setTorneoAEliminar(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setTorneoAEliminar(null);
  };

  return (
    <div className="torneos-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Torneos</h1>
        <p className="text-muted-custom mb-0">Administra los torneos disponibles en la plataforma</p>
      </div>

      <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onCreate={handleCreate}
              crear="Torneo"
      />

      <div className="row g-3">
        {torneosFiltrados.length === 0 ? (
          <div className="col-12">
            <div className="empty-state text-center py-5">
              <p className="text-muted-custom mb-0">No se encontraron torneos</p>
            </div>
          </div>
        ) : (
          torneosFiltrados.map((torneo) => (
            <TorneoCard
            key={torneo.id}
            torneo={torneo} 
            onEdit={handleEdit} 
            onDelete={handleDelete} />
          ))
        )}
      </div>

      {showModal && (
              <TorneoFormModal
                setShowModal={setShowModal}
                editingTorneo={editingTorneo}
                onSave={handleSave}
              />
            )}
      
      {showConfirm && (
              <ConfirmModal
                objeto="torneo"
                setShowConfirm={setShowConfirm}
                objetoAEliminar={torneoAEliminar}
                handleConfirmDelete={handleConfirmDelete}
                handleCancelDelete={handleCancelDelete}
              />
            )}
    </div>
  );
};
export default TorneosAdmin;