import { useState } from 'react';
import { useDeporte } from '../hooks/useDeporte.tsx';
import './DeportesAdmin.css';
import type { Deporte } from '../contexts/deporte.tsx';
import SearchBar from '../components/SearchBar.tsx';
import DeportesTable from '../components/DeporteTable.tsx';
import DeporteFormModal from '../components/DeporteFormModal.tsx';
import ConfirmModal from '../components/ConfirmModal.tsx';

const DeportesAdmin = () => {
  const { deportes, borrarDeporte, modificarDeporte, crearDeporte } = useDeporte();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDeporte, setEditingDeporte] = useState<Deporte | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    cantMinJugadores: 0,
    cantMaxJugadores: 0,
    duracion: 0
  });

  // Filtrar deportes
  const deportesFiltrados = deportes.filter(deporte =>
    deporte.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  
  // Abrir modal para crear
  const handleCreate = () => {
    setEditingDeporte(null);
    setFormData({
      nombre: '',
      cantMinJugadores: 0,
      cantMaxJugadores: 0,
      duracion: 0
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (deporte: Deporte) => {
    setEditingDeporte(deporte);
    setFormData({
      nombre: deporte.nombre,
      cantMinJugadores: deporte.cantMinJugadores,
      cantMaxJugadores: deporte.cantMaxJugadores,
      duracion: deporte.duracion
    });
    setShowModal(true);
  };

  // Guardar (crear o editar)
  const handleSave = () => {
    if (editingDeporte) {
      // Editar
      const deporte: Deporte = {
        id: editingDeporte.id,
        nombre: formData.nombre,
        cantMinJugadores: formData.cantMinJugadores,
        cantMaxJugadores: formData.cantMaxJugadores,
        duracion: formData.duracion
      };
      modificarDeporte(deporte);
    } else {
      // Crear
      const newDeporte = {
        nombre: formData.nombre,
        cantMinJugadores: formData.cantMinJugadores,
        cantMaxJugadores: formData.cantMaxJugadores,
        duracion: formData.duracion
      };
      crearDeporte(newDeporte as Deporte);
    }

    setShowModal(false);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [deporteAEliminar, setDeporteAEliminar] = useState<Deporte | null>(null);

  const handleDelete = (deporte: Deporte) => {
    setDeporteAEliminar(deporte);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deporteAEliminar !== null) {
      borrarDeporte(deporteAEliminar.id);
    }
    setShowConfirm(false);
    setDeporteAEliminar(null);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeporteAEliminar(null);
  };


  return (
    <div className="deportes-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Deportes</h1>
        <p className="text-muted-custom mb-0">Administra los deportes disponibles en la plataforma</p>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        onCreate={handleCreate}
        crear="Deporte"
      />

      <DeportesTable
        deportes={deportesFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <DeporteFormModal
          setShowModal={setShowModal}
          editingDeporte={editingDeporte}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          objeto="deporte"
          setShowConfirm={setShowConfirm}
          objetoAEliminar={deporteAEliminar}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default DeportesAdmin;