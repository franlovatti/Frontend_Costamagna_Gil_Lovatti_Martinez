import { useEffect, useState } from 'react';
import { useNoticia } from '../../hooks/useNoticia';
import './DeportesAdmin.css';
import ConfirmModal from '../../components/ConfirmModal';
import SearchBar from '../../components/SearchBar';
import type { Noticia } from '../../contexts/noticia.tsx';
import NoticiasTable from '../../components/admin/NoticiaTable.tsx';
import NoticiaFormModal from '../../components/admin/NoticiaFormModal.tsx';
import FiltroFecha from '../../components/filtros/FiltroFecha.tsx';
import Filtros from '../../components/filtros/Filtros.tsx';

export default function NoticiaPage() {
  const { noticias, borrarNoticia, modificarNoticia, crearNoticia, filtrarNoticias, getNoticias } = useNoticia();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    getNoticias();
  }, [getNoticias]);

  const noticiasFiltradas = noticias.filter((noticia) =>
    noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    noticia.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingNoticia(null);
    setShowModal(true);
  };
  const handleEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia);
    setShowModal(true);
  };
  const handleSave = (noticiaData: Partial<Noticia>) => {
    if (editingNoticia) {
      modificarNoticia({ ...noticiaData, id: editingNoticia.id } as Noticia);
    } else {
      // Crear
      crearNoticia(noticiaData as Noticia);
    }

    setShowModal(false);
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<Noticia | null>(null);
  
  const handleDelete = (noticia: Noticia) => {
    setNoticiaAEliminar(noticia);
    setShowConfirm(true);
  };
  const handleConfirmDelete = () => {
    if (noticiaAEliminar) {
      borrarNoticia(noticiaAEliminar.id);
    }
    setShowConfirm(false);
    setNoticiaAEliminar(null);
  };
  const handleCancelDelete = () => {
    setShowConfirm(false);
    setNoticiaAEliminar(null);
  };

  const [filtros, setFiltros] = useState({
    fechaDesde: '',
    fechaHasta: '',
  });

  const handleFiltros = () => {
    filtrarNoticias(filtros.fechaDesde, filtros.fechaHasta);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaDesde: '',
      fechaHasta: '',
    });
    getNoticias();
  };

  return (
    <div className="deportes-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Noticias</h1>
        <p className="text-muted-custom mb-0">
          Administra los noticias disponibles en la plataforma
        </p>
      </div>

      <SearchBar
        value={searchTerm}
        hayBoton={true}
        onChange={setSearchTerm}
        onCreate={handleCreate}
        crear="Noticia"
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
          label="Fecha de publicación"
        />
      </Filtros>

      <NoticiasTable
        noticias={noticiasFiltradas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <NoticiaFormModal
          setShowModal={setShowModal}
          editingNoticia={editingNoticia}
          onSave={handleSave}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          objeto={"eliminar la noticia" + (noticiaAEliminar ? ` "${noticiaAEliminar.titulo}"` : '')}
          setShowConfirm={setShowConfirm}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}