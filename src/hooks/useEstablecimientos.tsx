import {useContext } from 'react';
import { EstablecimientoContext } from '../contexts/establecimiento';

export const useEstablecimientos = () =>{
  const context = useContext(EstablecimientoContext);
  if (!context) {
    throw new Error('useEstablecimientos must be used within an EstablecimientoProvider');
  }
  return context;
}