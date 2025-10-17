import { useContext } from 'react';
import { NoticiaContext } from '../contexts/noticia.tsx';

export const useNoticia = () => {
  const context = useContext(NoticiaContext);
  if (!context) {
    throw new Error('useNoticia must be used within a NoticiaProvider');
  }
  return context;
};