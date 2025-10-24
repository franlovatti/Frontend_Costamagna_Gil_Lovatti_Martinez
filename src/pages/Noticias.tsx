import apiAxios from '../helpers/api.tsx';
import { useEffect, useState } from 'react';
import type { Noticia } from '../contexts/noticia.tsx';
import './Noticias.css';

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const response = await apiAxios.get('/noticias');
        if (response.data && Array.isArray(response.data.data)) {
          // Ordenar por fecha más reciente primero
          const sortedNoticias = response.data.data.sort(
            (a: Noticia, b: Noticia) => 
              new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          setNoticias(sortedNoticias);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching noticias:', error);
        setError('Error al cargar las noticias. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    // Validar fechas
    const start = value && type === 'start' ? new Date(value) : new Date(startDate);
    const end = value && type === 'end' ? new Date(value) : new Date(endDate);

    if (startDate && endDate && start > end) {
      setError('La fecha de inicio no puede ser mayor que la fecha de fin.');
    } else {
      setError('');
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setError('');
  };

  const filteredNoticias = noticias.filter((noticia) => {
    const noticiaDate = new Date(noticia.fecha);
    const isAfterStartDate = startDate ? noticiaDate >= new Date(startDate) : true;
    const isBeforeEndDate = endDate ? noticiaDate <= new Date(endDate) : true;
    return isAfterStartDate && isBeforeEndDate;
  });

  // Función para obtener tiempo relativo
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return date.toLocaleDateString();
  };

  return (
    <div className="noticias-page-container">
      <div className="noticias-inner-container">
        {/* Header */}
        <div className="noticias-header">
          <h1>Noticias</h1>
          <p className="noticias-subtitle">
            Mantente informado sobre los últimos eventos y anuncios
          </p>
        </div>

        {/* Filtros */}
        <div className="noticias-toolbar">
          <div className="filter-section">
            <div className="filter-label">Filtrar por fecha:</div>
            <div className="filter-inputs">
              <div className="filter-group">
                <label htmlFor="startDate" className="filter-input-label">
                  Desde
                </label>
                <input
                  id="startDate"
                  type="date"
                  className="filter-input"
                  value={startDate}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label htmlFor="endDate" className="filter-input-label">
                  Hasta
                </label>
                <input
                  id="endDate"
                  type="date"
                  className="filter-input"
                  value={endDate}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                />
              </div>
              {(startDate || endDate) && (
                <button 
                  className="btn-clear-filters"
                  onClick={clearFilters}
                  title="Limpiar filtros"
                >
                  ✕ Limpiar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error de validación */}
        {error && !loading && (
          <div className="alert-danger-custom">
            ⚠️ {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large"></div>
            <p>Cargando noticias...</p>
          </div>
        ) : filteredNoticias.length === 0 ? (
          /* Empty state */
          <div className="noticias-empty-state">
            <div className="empty-state-icon">📭</div>
            <p className="empty-state-text">
              {startDate || endDate 
                ? 'No se encontraron noticias en el rango de fechas seleccionado'
                : 'No hay noticias disponibles en este momento'}
            </p>
            {(startDate || endDate) && (
              <button className="btn-secondary-action" onClick={clearFilters}>
                Ver todas las noticias
              </button>
            )}
          </div>
        ) : (
          /* Lista de noticias */
          <>
            <div className="noticias-count">
              Mostrando <strong>{filteredNoticias.length}</strong> {filteredNoticias.length === 1 ? 'noticia' : 'noticias'}
            </div>
            <div className="noticias-grid">
              {filteredNoticias.map((noticia) => (
                <article key={noticia.id} className="noticia-card">
                  <div className="noticia-header">
                    <div className="noticia-date-badge">
                      {getRelativeTime(noticia.fecha)}
                    </div>
                    <div className="noticia-date-full">
                      {new Date(noticia.fecha).toLocaleDateString('es-AR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <h2 className="noticia-title">{noticia.titulo}</h2>
                  <p className="noticia-description">{noticia.descripcion}</p>
                  <div className="noticia-footer"></div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
