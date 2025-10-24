import { useContext } from 'react';
import { LocalidadContext } from '../contexts/localidad.tsx';

export const useLocalidad = () => {
  const context = useContext(LocalidadContext);
  if (!context) {
    throw new Error('useLocalidad must be used within a LocalidadProvider');
  }
  return context;
}; 