import { useState, useEffect } from 'react';
import { useUsuario } from '../../hooks/useUsuario.tsx';
import type { User } from '../../contexts/auth.tsx';
import './DeportesAdmin.css';
import SearchBar from '../../components/SearchBar.tsx';
import ConfirmModal from '../../components/ConfirmModal.tsx';
import UserTable from '../../components/admin/UserTable.tsx';
import { useAuth } from '../../hooks/useAuth.tsx';
import Filtros from '../../components/filtros/Filtros.tsx';
import FiltroSelect from '../../components/filtros/FiltroSelect.tsx';

const UsuariosAdmin = () => {
  const { usuarios, modificarUsuario, getUsuarios, filtrarUsuarios, loading, error } = useUsuario();
  const { bajaUsuario } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [usuarioAEditar, setUsuarioAEditar] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<User | null>(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    getUsuarios();
  }, [getUsuarios]);


  // Filtrar usuarios
  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  // Abrir modal para editar
  const handleEdit = (usuario: User) => {
    setUsuarioAEditar(usuario);
    setShowModal(true);
  };

  const handleConfirmEdit = async () => {
    if (usuarioAEditar) {
      const nuevoRole = usuarioAEditar.role === 'Usuario' ? 'Administrador' : 'Usuario';
      await modificarUsuario({ ...usuarioAEditar, role: nuevoRole });
    }
    setShowModal(false);
    setUsuarioAEditar(null);
    getUsuarios();
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    setUsuarioAEditar(null);
  };

  const handleDelete = (usuario: User) => {
    setUsuarioAEliminar(usuario);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (usuarioAEliminar !== null) {
      await bajaUsuario(usuarioAEliminar.id);
    }
    setShowConfirm(false);
    setUsuarioAEliminar(null);
    getUsuarios();
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setUsuarioAEliminar(null);
  };

  const [filtros, setFiltros] = useState({
    rol: '',
    estado: ''
  });

  const handleFiltros = () => {
    filtrarUsuarios(filtros.rol, filtros.estado);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      rol: '',
      estado: ''
    });
    getUsuarios();
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
        hayBoton={false}
        onCreate={() => {}}
        crear="Usuario"
      />

      <Filtros
        onAplicar={handleFiltros}
        onLimpiar={handleLimpiarFiltros}
      >
        <FiltroSelect
          title="Rol del usuario"
          label='Rol'
          value={filtros.rol}
          onChange={(value) => setFiltros({...filtros, rol: value})}
          options={[
            { value: 'Usuario', label: 'Usuario' },
            { value: 'Administrador', label: 'Administrador' }
          ]}
          placeholder="Todos los roles"
        />
        <FiltroSelect
          title="Estado del usuario"
          label='Estado'
          value={filtros.estado}
          onChange={(value) => setFiltros({...filtros, estado: value})}
          options={[
            { value: 'Activo', label: 'Activo' },
            { value: 'Inactivo', label: 'Inactivo' }
          ]}
          placeholder="Todos los estados"
        />
      </Filtros>

      {/* Error de conexión */}
      {error && !loading && (
        <div className="alert-danger-custom">
          ⚠️ {error}
        </div>
      )}

      <UserTable
        usuarios={usuariosFiltrados}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {showModal && (
        <ConfirmModal
          objeto= {usuarioAEditar?.role === 'Usuario' ? 'convertir en Administrador a ' + usuarioAEditar?.usuario : 'convertir en Usuario a ' + usuarioAEditar?.usuario}
          asunto= 'cambio de rol'
          setShowConfirm={setShowConfirm}
          handleConfirmDelete={handleConfirmEdit}
          handleCancelDelete={handleCancelEdit}
        />
      )}

      {showConfirm && (
        <ConfirmModal
          objeto= {usuarioAEliminar?.estado ? 'dar de baja al usuario ' + usuarioAEliminar?.usuario : 'reactivar al usuario ' + usuarioAEliminar?.usuario}
          asunto= 'baja/reactivación'
          setShowConfirm={setShowConfirm}
          handleConfirmDelete={handleConfirmDelete}
          handleCancelDelete={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default UsuariosAdmin;