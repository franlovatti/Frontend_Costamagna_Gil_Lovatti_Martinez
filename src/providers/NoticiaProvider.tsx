import { useEffect, useState, useCallback } from 'react';
import { NoticiaContext } from '../contexts/noticia.tsx';
import apiAxios from '../helpers/api';
import type { Noticia } from '../contexts/noticia.tsx';

const NoticiasProvider = ({ children }: { children: React.ReactNode }) => {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getNoticias = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/noticias', {
        params: { order: 'asc' },
      });
      setNoticias(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setNoticias([]);
      setError('No se pudieron cargar las noticias' + error);
    }
    setLoading(false);
  }, []);

  const filtrarNoticias = useCallback(async (fechaDesde?: string, fechaHasta?: string) => {
    setLoading(true);
    try {
      const res = await apiAxios.get('/noticias/filter', {
        params: { fechaDesde, fechaHasta },
      });
      setNoticias(Array.isArray(res.data.data) ? res.data.data : []);
      setError(null);
    } catch (error) {
      setNoticias([]);
      setError('No se pudieron cargar las noticias filtradas' + error);
    }
    setLoading(false);
  }, []);

  const borrarNoticia = useCallback(async (id: number) => {
    try {
      await apiAxios.delete(`/noticias/${id}`);
      await getNoticias();
    } catch (error) {
      setError('Error al borrar la noticia:' + error);
    }
  }, [getNoticias]);

  const modificarNoticia = useCallback(async (noticia: Noticia) => {
    try {
      await apiAxios.put(`/noticias/${noticia.id}`, noticia);
      await getNoticias();
    } catch (error) {
      setError('Error al modificar la noticia:' + error);
    }
  }, [getNoticias]);

  const crearNoticia = useCallback(async (noticia: Noticia) => {
    try {
      await apiAxios.post('/noticias', noticia);
      await getNoticias();
    } catch (error) {
      setError('Error al crear la noticia:' + error);
    }
  }, [getNoticias]);

  useEffect(() => {
    getNoticias();
  }, [getNoticias]);

  return (
    <NoticiaContext.Provider
      value={{
        noticias,
        loading,
        error,
        getNoticias,
        filtrarNoticias,
        borrarNoticia,
        modificarNoticia,
        crearNoticia,
      }}
    >
      {children}
    </NoticiaContext.Provider>
  );
};

export default NoticiasProvider;