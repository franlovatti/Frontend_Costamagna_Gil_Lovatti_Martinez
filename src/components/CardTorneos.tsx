import { Button, Card, ListGroup } from 'react-bootstrap';
import './cssComponentes/CardTorneos.css';

import type { Torneo } from '../types';
interface CardTorneosProps {
  torneo: Torneo;
  handleClick: (id: number) => void;
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
  const fechaInicioEvento = new Date(
    torneo.fechaInicioEvento
  ).toLocaleDateString('es-AR');
  const fechaFinEvento = new Date(torneo.fechaFinEvento).toLocaleDateString(
    'es-AR'
  );
  const deporteNombre = torneo.deporte?.nombre ?? 'Sin deporte';
  const localidadNombre = torneo.localidad?.nombre ?? 'Sin localidad';
  return (
    <div className="torneos-card-styles">
      <Card
        bg="dark"
        border="secondary"
        text="white"
        onClick={() => (canAccess ? handleClick(torneo.id) : undefined)}
        role={canAccess ? 'button' : undefined}
        aria-disabled={!canAccess}
        style={{ cursor: canAccess ? 'pointer' : 'default' }}
      >
        <Card.Img variant="top" src={torneo.img} />
        <Card.Body>
          <Card.Title>{torneo.nombre}</Card.Title>
          <Card.Text
            style={{
              minHeight: '100px',
              maxHeight: '100px',
              overflow: 'hidden',
            }}
          >
            {torneo.descripcion}
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item className="bg-dark text-white border-primary">
              {deporteNombre}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary">
              {fechaInicioEvento} - {fechaFinEvento}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary">
              {localidadNombre}
            </ListGroup.Item>
            <ListGroup.Item className="bg-dark text-white border-primary"></ListGroup.Item>
          </ListGroup>
          <div className="d-flex justify-content-center">
            {canAccess ? (
              <Button variant="outline-primary" disabled>
                Inscribirse
              </Button>
            ) : (
              <Button
                variant="outline-primary"
                onClick={() =>
                  onEnroll ? onEnroll(torneo) : handleClick(torneo.id)
                }
              >
                Inscribirse
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

// import type { Torneo } from '../types';

// interface CardTorneosProps {
//   torneo: Torneo;
//   handleClick: (id: number) => void;
//   isMember?: boolean;
//   onEnroll?: (torneo: Torneo) => void;
// }

// export default function CardTorneos({
//   torneo,
//   handleClick,
//   isMember = false,
//   onEnroll,
// }: CardTorneosProps) {
//   const fechaInicioEvento = new Date(torneo.fechaInicioEvento).toLocaleDateString('es-AR', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });
  
//   const fechaFinEvento = new Date(torneo.fechaFinEvento).toLocaleDateString('es-AR', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric'
//   });

//   const deporteNombre = torneo.deporte?.nombre ?? 'Sin deporte';
//   const localidadNombre = torneo.localidad?.nombre ?? 'Sin localidad';

//   const handleCardClick = (e: React.MouseEvent) => {
//     // Si se hace click en el botón de inscribirse, no navegar
//     if ((e.target as HTMLElement).closest('.btn-inscribirse')) {
//       return;
//     }
//     handleClick(torneo.id);
//   };

//   const handleEnrollClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (onEnroll && !isMember) {
//       onEnroll(torneo);
//     } else if (!isMember) {
//       handleClick(torneo.id);
//     }
//   };

//   return (
//     <div className="torneo-card" onClick={handleCardClick}>
//       {torneo.img && (
//         <img 
//           src={torneo.img} 
//           alt={torneo.nombre}
//           className="torneo-card-image"
//         />
//       )}
      
//       <div className="torneo-card-body">
//         <h3 className="torneo-card-title">{torneo.nombre}</h3>
        
//         {torneo.descripcion && (
//           <p className="torneo-card-description">
//             {torneo.descripcion}
//           </p>
//         )}

//         <div className="my-4">
//           <div className="torneo-info-item">
//             {deporteNombre}
//           </div>
          
//           <div className="torneo-info-item">
//               {fechaInicioEvento} - {fechaFinEvento}
//           </div>
          
//           <div className="torneo-info-item">
//             {localidadNombre}
//           </div>

//           {!torneo.esPublico && (
//             <div className="torneo-info-item">
//               Torneo privado
//             </div>
//           )}
//         </div>

//         <div className="torneo-card-footer">
//           <button
//             className="btn-inscribirse"
//             onClick={handleEnrollClick}
//             disabled={isMember}
//           >
//             {isMember ? 'Ya inscripto' : 'Inscribirse'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }