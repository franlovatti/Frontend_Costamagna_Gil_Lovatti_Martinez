import { useContext } from 'react';
import { TorneoContext } from '../contexts/torneo.tsx';

export const useTorneo = () => {
  const context = useContext(TorneoContext);
  if (!context) {
    throw new Error('useTorneo must be used within a TorneoProvider');
  }
  return context;
}; 
