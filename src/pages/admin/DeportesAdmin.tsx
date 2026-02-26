import { useEffect, useState } from 'react';
import { useDeporte } from '../../hooks/useDeporte.tsx';
import './DeportesAdmin.css';
import type { Deporte } from '../../contexts/deporte.tsx';
import SearchBar from '../../components/SearchBar.tsx';
import DeportesTable from '../../components/admin/DeporteTable.tsx';
import DeporteFormModal from '../../components/admin/DeporteFormModal.tsx';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import Filtros from '../../components/filtros/Filtros.tsx';
import FiltroRango from '../../components/filtros/FiltroRango.tsx';

const DeportesAdmin = () => {
  const { deportes, borrarDeporte, modificarDeporte, crearDeporte, filtrarDeportes, getDeportes } = useDeporte();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDeporte, setEditingDeporte] = useState<Deporte | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getDeportes();
  }, [getDeportes]);

  // Filtrar deportes
  const deportesFiltrados = deportes.filter((deporte) =>
    deporte.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingDeporte(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (deporte: Deporte) => {
    setEditingDeporte(deporte);
    setShowModal(true);
  };

  // Guardar (crear o editar)
  const handleSave = (deporteData: Partial<Deporte>) => {
    if (editingDeporte) {
      // Editar
      modificarDeporte({ ...deporteData, id: editingDeporte.id } as Deporte);
    } else {
      // Crear
      crearDeporte(deporteData as Deporte);
    }

    setShowModal(false);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [deporteAEliminar, setDeporteAEliminar] = useState<Deporte | null>(
    null
  );

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

    const [filtros, setFiltros] = useState({
    cantMaxJug: 0,
    cantMinJug: 0,
    minDesde: 0,
    minHasta: 0
  });

  const handleFiltros = () => {
    filtrarDeportes(filtros.cantMaxJug, filtros.cantMinJug, filtros.minDesde, filtros.minHasta);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      cantMaxJug: 0,
      cantMinJug: 0,
      minDesde: 0,
      minHasta: 0
    });
    getDeportes();
  };

  return (
    <div className="deportes-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Deportes</h1>
        <p className="text-muted-custom mb-0">
          Administra los deportes disponibles en la plataforma
        </p>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        hayBoton={true}
        onCreate={handleCreate}
        crear="Deporte"
      />

      <Filtros
        onAplicar={handleFiltros}
        onLimpiar={handleLimpiarFiltros}
      >
        <FiltroRango
          title="Cantidad de Jugadores"
          min={1}
          max={100}
          valueMin={filtros.cantMinJug}
          valueMax={filtros.cantMaxJug}
          onMinChange={(value) => setFiltros({ ...filtros, cantMinJug: value })}
          onMaxChange={(value) => setFiltros({ ...filtros, cantMaxJug: value })}
        />
        <FiltroRango
          title="Minutos de Juego"
          min={0}
          max={240}
          valueMin={filtros.minDesde}
          valueMax={filtros.minHasta}
          onMinChange={(value) => setFiltros({ ...filtros, minDesde: value })}
          onMaxChange={(value) => setFiltros({ ...filtros, minHasta: value })}
        />

      </Filtros>

      <DeportesTable
        deportes={deportesFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <DeporteFormModal
          setShowModal={setShowModal}
          editingDeporte={editingDeporte}
          onSave={handleSave}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          objeto={"eliminar el deporte " + deporteAEliminar?.nombre}
          setShowConfirm={setShowConfirm}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default DeportesAdmin;
