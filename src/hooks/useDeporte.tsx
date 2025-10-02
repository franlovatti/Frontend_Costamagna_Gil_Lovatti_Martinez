import { useContext } from 'react';
import { DeporteContext } from '../contexts/deporte.tsx';

export const useDeporte = () => {
  const context = useContext(DeporteContext);
  if (!context) {
    throw new Error('useDeporte must be used within an DeporteProvider');
  }
  return context;
}; 
