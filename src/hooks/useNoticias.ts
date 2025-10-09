import { useState, useCallback, useEffect } from 'react';

type noticia = {
  id: number;
  titulo: string;
  descripcion: string;
};

export default function useNoticias() {
  const [noticias, setNoticias] = useState<noticia[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getNoticias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3000/api/noticias');
      const json = await response.json();
      console.log('Respuesta de la API:', json);
      const mapped = json.data?.map((n: noticia) => ({
        id: n.id,
        titulo: n.titulo,
        descripcion: n.descripcion,
      }));

      setNoticias(mapped || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar noticias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getNoticias();
  }, [getNoticias]);

  return { noticias, loading, error, setNoticias };
}
