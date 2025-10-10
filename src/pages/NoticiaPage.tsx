import { useState } from 'react';

import { useNoticia } from '../hooks/useNoticia';
import './DeportesAdmin.css';
import ConfirmModal from '../components/ConfirmModal';
import SearchBar from '../components/SearchBar';
import './NoticiaPage.css';
import type { Noticia } from '../contexts/noticia.tsx';
import NoticiasTable from '../components/NoticiaTable.tsx';
import NoticiaFormModal from '../components/NoticiaFormModal.tsx';

export default function NoticiaPage() {
  const { noticias, borrarNoticia, modificarNoticia, crearNoticia } =
    useNoticia();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNoticia, setEditingNoticia] = useState<Noticia | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
  });
  const noticiasFiltradas = noticias.filter((noticia) =>
    noticia.titulo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    setEditingNoticia(null);
    setFormData({
      titulo: '',
      descripcion: '',
      fecha: '',
    });
    setShowModal(true);
  };
  const handleEdit = (noticia: Noticia) => {
    setEditingNoticia(noticia);
    setFormData({
      titulo: noticia.titulo,
      descripcion: noticia.descripcion,
      fecha: noticia.fecha,
    });
    setShowModal(true);
  };
  const handleSave = () => {
    if (editingNoticia) {
      // Editar
      const noticia: Noticia = {
        id: editingNoticia.id,
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
      };
      modificarNoticia(noticia);
    } else {
      // Crear
      const newNoticia = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
      };
      crearNoticia(newNoticia as Noticia);
    }

    setShowModal(false);
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const [noticiaAEliminar, setNoticiaAEliminar] = useState<Noticia | null>(
    null
  );
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
        onChange={setSearchTerm}
        onCreate={handleCreate}
        crear="Noticia"
      />

      <NoticiasTable
        noticias={noticiasFiltradas}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showModal && (
        <NoticiaFormModal
          setShowModal={setShowModal}
          editingNoticia={editingNoticia}
          formData={formData}
          setFormData={setFormData}
          handleSave={handleSave}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          objeto="noticia"
          setShowConfirm={setShowConfirm}
          objetoAEliminar={noticiaAEliminar}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
}
