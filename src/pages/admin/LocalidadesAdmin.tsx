import { useEffect, useState } from 'react';
import { useLocalidad } from '../../hooks/useLocalidad.tsx';
import type { Localidad } from '../../contexts/localidad.tsx';
import './DeportesAdmin.css';
import ConfirmModal from '../../components/ConfirmModal';
import SearchBar from '../../components/SearchBar';
import LocalidadFormModal from '../../components/admin/LocalidadFormModal.tsx';


export default function LocalidadesAdmin() {
  const { localidades, loading, error, borrarLocalidad, crearLocalidad, getLocalidades } = useLocalidad();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getLocalidades();
  }, [getLocalidades]);

  const localidadesFiltradas = localidades.filter((localidad) =>
    localidad.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    localidad.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setShowModal(true);
  };
  const handleSave = (localidadData: Partial<Localidad>) => {
    crearLocalidad(localidadData as Localidad);
    setShowModal(false);
    if (error) {
      console.error("Error al crear la localidad:", error);
    }
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [localidadAEliminar, setLocalidadAEliminar] = useState<Localidad | null>(null);
  
  const handleDelete = (localidad: Localidad) => {
    setLocalidadAEliminar(localidad);
    setShowConfirm(true);
  };
  const handleConfirmDelete = () => {
    if (localidadAEliminar) {
      borrarLocalidad(localidadAEliminar.id);
      if (error) {
        console.error("Error al eliminar la localidad:", error);
      }
    }
    setShowConfirm(false);
    setLocalidadAEliminar(null);
  };
  const handleCancelDelete = () => {
    setShowConfirm(false);
    setLocalidadAEliminar(null);
  };

  return (
    <div className="deportes-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Localidads</h1>
        <p className="text-muted-custom mb-0">
          Administra los localidads disponibles en la plataforma
        </p>
      </div>
      
      <SearchBar
        value={searchTerm}
        hayBoton={true}
        onChange={setSearchTerm}
        onCreate={handleCreate}
        crear="Localidad"
      />

      {/* Error de conexión */}
      {error && !loading && (
        <div className="alert-danger-custom">
          ⚠️ {error}
        </div>
      )}

      <div className="table-responsive custom-table-container no-mobile-hide">
        <table className="table custom-table mb-0">
          <thead>
            <tr>
              <th>Detalle</th>
              <th>Latitud</th>
              <th>Longitud</th>
              <th>Codigo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
          {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted-custom">
                  <div className="spinner-border text-primary" role="status"></div>
                </td>
              </tr>
            ) : (
          localidadesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted-custom">
                  No se encontraron localidades
                </td>
              </tr>
            ) : (
              localidadesFiltradas.map((n) => (
              <tr>
                <td>{n.descripcion}</td>
                <td>{n.lat}</td>
                <td>{n.lng}</td>
                <td>{n.codigo}</td>
                <td>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(n)}
                  >
                    🗑️ Eliminar
                  </button>
                </td>
              </tr>
              )))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <LocalidadFormModal setShowModal={setShowModal} onSave={handleSave} />
      )}

      {showConfirm && (
        <ConfirmModal
          objeto={"eliminar la localidad" + (localidadAEliminar ? ` "${localidadAEliminar.descripcion}"` : '')}
          setShowConfirm={setShowConfirm}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}