import { useState } from 'react';
import './TorneosAdmin.css';
import SearchBar from '../../components/SearchBar.tsx';
import type { Torneo } from '../../contexts/torneo.tsx';
// import type { Deporte } from '../contexts/deporte.tsx';
import { useTorneo } from '../../hooks/useTorneo.tsx';
import { useDeporte } from '../../hooks/useDeporte.tsx';
import TorneoCard from '../../components/TorneoCard.tsx';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import TorneoFormModal from '../../components/admin/TorneoFormModal.tsx';
import FiltroFecha from '../../components/filtros/FiltroFecha.tsx';
import FiltroSelect from '../../components/filtros/FiltroSelect.tsx';
import FiltroRango from '../../components/filtros/FiltroRango.tsx';
import Filtros from '../../components/filtros/Filtros.tsx';

const TorneosAdmin = () => {
  const { torneos, borrarTorneo, modificarTorneo, crearTorneo, filtrarTorneos, getTorneos, error } = useTorneo();
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

  const { deportes } = useDeporte();

  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
    deporte: '',
    modalidad: '',
    equiposDesde: 1,
    equiposHasta: 64,
  });

  const handleFiltros = () => {
    filtrarTorneos(filtros.fechaDesde, filtros.fechaHasta, filtros.deporte, filtros.modalidad, filtros.equiposDesde, filtros.equiposHasta);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
      deporte: '',
      modalidad: '',
      equiposDesde: 1,
      equiposHasta: 64,
    });
    getTorneos();
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

      <Filtros
        onAplicar={handleFiltros}
        onLimpiar={handleLimpiarFiltros}
      >
        <FiltroFecha
          fechaDesde={filtros.fechaDesde}
          fechaHasta={filtros.fechaHasta}
          onFechaDesdeChange={(fecha) => setFiltros({...filtros, fechaDesde: fecha})}
          onFechaHastaChange={(fecha) => setFiltros({...filtros, fechaHasta: fecha})}
          label="Fecha del evento"
        />
        <FiltroSelect
          title="Deporte del torneo"
          label="Deporte"
          value={filtros.deporte}
          onChange={(value) => setFiltros({...filtros, deporte: value})}
          options={deportes.map(d => ({ value: d.id, label: d.nombre }))}
          placeholder="Todos los deportes"
        />
        <FiltroRango
          title="Cantidad de Equipos"
          min={1}
          max={64}
          valueMin={filtros.equiposDesde}
          valueMax={filtros.equiposHasta}
          onMinChange={(value) => setFiltros({...filtros, equiposDesde: value})}
          onMaxChange={(value) => setFiltros({...filtros, equiposHasta: value})}
        />
      </Filtros>

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

      {error && (
        <div className="alert alert-danger mt-4" role="alert">
          {error}
        </div>
      )}
      
    </div>
  );
};
export default TorneosAdmin;