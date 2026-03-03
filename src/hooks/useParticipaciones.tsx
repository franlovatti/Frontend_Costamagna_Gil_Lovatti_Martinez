import { useContext } from 'react';
import { ParticipacionContext } from '../contexts/participacion.tsx';

export const useParticipacion = () => {
  const context = useContext(ParticipacionContext);
  if (!context) {
    throw new Error(
      'useParticipacion must be used within a ParticipacionProvider',
    );
  }
  return context;
};
