import { useContext } from 'react';
import { EquipoContext } from '../contexts/equipo';

export const useEquipos = () => {
  const context = useContext(EquipoContext);
  if (!context) {
    throw new Error('useEquipos must be used within EquipoProvider');
  }
  return context;
};
