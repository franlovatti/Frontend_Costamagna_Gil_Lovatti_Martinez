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
      crearTorneo(torneoData as Torneo);
    }
  };

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
              hayBoton={true}
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
                objeto={"eliminar el torneo " + torneoAEliminar?.nombre}
                setShowConfirm={setShowConfirm}
                handleConfirmDelete={handleConfirmDelete}
                handleCancelDelete={handleCancelDelete}
              />
            )}
    </div>
  );
};
export default TorneosAdmin;