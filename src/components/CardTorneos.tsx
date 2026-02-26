import type { Torneo } from '../contexts/torneo';

interface CardTorneosProps {
  torneo: Torneo;
  handleClick: (id: number | undefined) => void;
  isMember?: boolean;
  onEnroll?: (torneo: Torneo) => void;
  isCreador?: boolean;
}

export default function CardTorneos({
  torneo,
  handleClick,
  isMember,
  onEnroll,
  isCreador,
}: CardTorneosProps) {
  const canAccess = Boolean(isMember || isCreador);
  const fechaInicioEvento = torneo.fechaInicioEvento ?
  new Date(torneo.fechaInicioEvento).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : 'Fecha no definida';
  
  const fechaFinEvento = torneo.fechaFinEvento ?
  new Date(torneo.fechaFinEvento).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }) : 'Fecha no definida';

  const deporteNombre = torneo.deporte?.nombre ?? 'Sin deporte';
  const localidadDesc = torneo.localidad?.descripcion ?? 'Sin localidad';

  const handleCardClick = (e: React.MouseEvent) => {
    if (!torneo.esPublico && !canAccess) return;
    // Si se hace click en el botón de inscribirse, no navegar
    if ((e.target as HTMLElement).closest('.btn-inscribirse')) {
      return;
    }
    handleClick(torneo.id);
  };

  const handleEnrollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEnroll && !isMember) {
      onEnroll(torneo);
    } else if (!isMember) {
      handleClick(torneo.id);
    }
  };

  return (
    <div className="torneo-card" onClick={handleCardClick}>
      {torneo.img && (
        <img 
          src={torneo.img} 
          alt={torneo.nombre}
          className="torneo-card-image"
        />
      )}
      
      <div className="torneo-card-body">
        <h3 className="torneo-card-title">{torneo.nombre}</h3>
        
        {torneo.descripcion && (
          <p className="torneo-card-description">
            {torneo.descripcion}
          </p>
        )}

        <div className="my-4">
          <div className="torneo-info-item">
            {deporteNombre}
          </div>
          
          <div className="torneo-info-item">
              {fechaInicioEvento} - {fechaFinEvento}
          </div>
          
          <div className="torneo-info-item">
            {localidadDesc}
          </div>

          {!torneo.esPublico && (
            <div className="torneo-info-item">
              Torneo privado
            </div>
          )}
        </div>

        <div className="torneo-card-footer">
          <button
            className="btn-inscribirse"
            onClick={handleEnrollClick}
            disabled={isMember}
          >
            {isMember ? 'Ya inscripto' : 'Inscribirse'}
          </button>
        </div>
      </div>
    </div>
  );
}