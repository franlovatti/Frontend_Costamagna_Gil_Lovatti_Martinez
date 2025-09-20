import { useEffect, useState } from 'react';

export default function useNoticia(id: BigInteger) {
  const [noticia, setNoticia] = useState<{
    id: number;
    titulo: string;
    descripcion: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3000/api/noticias/${id}`
        );
        const json = await response.json();
        console.log('Respuesta de la API:', json);

        if (json.data) {
          const noticia = {
            id: json.data.id,
            titulo: json.data.titulo,
            descripcion: json.data.descripcion,
          };
          setNoticia(noticia);
        } else {
          setError('No se encontró la noticia');
        }
      } catch (err) {
        console.error(err);
        setError('Error al cargar la noticia');
      } finally {
        setLoading(false);
      }
    };

    fetchNoticia();
  }, [id]);

  return { noticia, loading, error };
}
