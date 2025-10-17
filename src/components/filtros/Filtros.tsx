// FiltrosContainer.tsx
import { useState } from 'react';
import type { ReactNode } from 'react';
import '../cssComponentes/Filtros.css';

interface FiltrosContainerProps {
  children: ReactNode;
  onAplicar: () => void;
  onLimpiar: () => void;
  mostrarAcciones?: boolean;
}

const Filtros = ({ 
  children, 
  onAplicar, 
  onLimpiar,
  mostrarAcciones = true 
}: FiltrosContainerProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="filtros-container mb-4">
      <button 
        className="filtros-toggle"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <span className="filtros-icon">🔍</span>
        <span>Filtros avanzados</span>
        <span className="filtros-arrow">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="filtros-content">
          <div className="filtros-grid">
            {children}
          </div>

          {mostrarAcciones && (
            <div className="filtros-actions mx-4 my-3">
              <button 
                type="button" 
                className="btn-filtro-limpiar"
                onClick={onLimpiar}
              >
                Limpiar
              </button>
              <button 
                type="button" 
                className="btn-filtro-aplicar"
                onClick={onAplicar}
              >
                Aplicar Filtros
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Filtros;