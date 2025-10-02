import { useState } from 'react';
import './TorneosAdmin.css';
import { Button } from '../components/ButtonField.tsx';

const TorneosAdmin = () => {
  const [deportes, setDeportes] = useState([
    { id: 1, nombre: 'Fútbol', tipo: 'Equipo', jugadoresPorEquipo: 11, descripcion: 'Deporte de equipo con balón' },
    { id: 2, nombre: 'Básquetbol', tipo: 'Equipo', jugadoresPorEquipo: 5, descripcion: 'Deporte de canasta' },
    { id: 3, nombre: 'Tenis', tipo: 'Individual', jugadoresPorEquipo: 1, descripcion: 'Deporte de raqueta' },
    { id: 4, nombre: 'Voleibol', tipo: 'Equipo', jugadoresPorEquipo: 6, descripcion: 'Deporte de red' },
    { id: 5, nombre: 'Padel', tipo: 'Individual', jugadoresPorEquipo: 2, descripcion: 'Deporte de raqueta en parejas' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeporte, setEditingDeporte] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'Equipo',
    jugadoresPorEquipo: 1,
    descripcion: ''
  });

  // Filtrar deportes
  const deportesFiltrados = deportes.filter(deporte =>
    deporte.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deporte.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Abrir modal para crear
  const handleCreate = () => {
    setEditingDeporte(null);
    setFormData({
      nombre: '',
      tipo: 'Equipo',
      jugadoresPorEquipo: 1,
      descripcion: ''
    });
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (deporte) => {
    setEditingDeporte(deporte);
    setFormData({
      nombre: deporte.nombre,
      tipo: deporte.tipo,
      jugadoresPorEquipo: deporte.jugadoresPorEquipo,
      descripcion: deporte.descripcion
    });
    setShowModal(true);
  };

  // Guardar (crear o editar)
  const handleSave = () => {
    if (!formData.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }

    if (editingDeporte) {
      // Editar
      setDeportes(deportes.map(d =>
        d.id === editingDeporte.id
          ? { ...d, ...formData }
          : d
      ));
    } else {
      // Crear
      const newDeporte = {
        id: Math.max(...deportes.map(d => d.id)) + 1,
        ...formData
      };
      setDeportes([...deportes, newDeporte]);
    }

    setShowModal(false);
  };

  // Eliminar
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este deporte?')) {
      setDeportes(deportes.filter(d => d.id !== id));
    }
  };

  return (
    <div className="torneos-page">
      <div className="page-header mb-4 pb-3">
        <h1 className="mb-2">Gestión de Torneos</h1>
        <p className="text-muted-custom mb-0">Administra los torneos disponibles en la plataforma</p>
      </div>

      <div className="d-flex gap-3 mb-4 align-items-center search-bar-row">
        <input
          type="text"
          className="form-control search-input flex-grow-1"
          placeholder="Buscar torneos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button className="btn btn-primary-custom d-flex align-items-center gap-2 mt-2 mt-sm-0" onClick={handleCreate}>
          <span>➕</span>
          Crear Torneo
        </Button>
      </div>

      <div className="row g-3">
        {deportesFiltrados.length === 0 ? (
          <div className="col-12">
            <div className="empty-state text-center py-5">
              <p className="text-muted-custom mb-0">No se encontraron deportes</p>
            </div>
          </div>
        ) : (
          deportesFiltrados.map((deporte) => (
            <div key={deporte.id} className="col-12 col-md-6 col-lg-4">
              <div className="deporte-card h-100">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h3 className="deporte-nombre mb-0">{deporte.nombre}</h3>
                  <span className={`badge-custom ${deporte.tipo === 'Equipo' ? 'badge-equipo' : 'badge-individual'}`}>
                    {deporte.tipo}
                  </span>
                </div>
                
                <div className="deporte-info mb-3">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="info-icon">👥</span>
                    <span className="info-text">{deporte.jugadoresPorEquipo} jugadores</span>
                  </div>
                  <p className="deporte-descripcion mb-0">{deporte.descripcion}</p>
                </div>
                
                <div className="d-flex gap-2 mt-auto">
                  <button className="btn-action flex-grow-1" onClick={() => handleEdit(deporte)}>
                    ✏️ Editar
                  </button>
                  <button className="btn-action btn-delete flex-grow-1" onClick={() => handleDelete(deporte.id)}>
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title mb-4">
              {editingDeporte ? 'Editar Deporte' : 'Crear Nuevo Deporte'}
            </h2>

            <div className="mb-3">
              <label className="form-label">Nombre *</label>
              <input
                type="text"
                className="form-control custom-input"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                placeholder="Ej: Fútbol"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tipo *</label>
              <select
                className="form-select custom-input"
                value={formData.tipo}
                onChange={(e) => setFormData({...formData, tipo: e.target.value})}
              >
                <option value="Equipo">Equipo</option>
                <option value="Individual">Individual</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Jugadores por equipo *</label>
              <input
                type="number"
                className="form-control custom-input"
                value={formData.jugadoresPorEquipo}
                onChange={(e) => setFormData({...formData, jugadoresPorEquipo: parseInt(e.target.value) || 1})}
                min="1"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Descripción</label>
              <input
                type="text"
                className="form-control custom-input"
                value={formData.descripcion}
                onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                placeholder="Breve descripción del deporte"
              />
            </div>

            <div className="d-flex gap-3">
              <button className="btn btn-cancel-custom flex-grow-1" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-save-custom flex-grow-1" onClick={handleSave}>
                {editingDeporte ? 'Guardar Cambios' : 'Crear Deporte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TorneosAdmin;