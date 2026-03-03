import { useContext } from 'react';
import { PartidoContext } from '../contexts/partido';

export const usePartidos = () => {
  const context = useContext(PartidoContext);
  if (!context) {
    throw new Error('usePartido must be used within PartidoProvider');
  }
  return context;
};
