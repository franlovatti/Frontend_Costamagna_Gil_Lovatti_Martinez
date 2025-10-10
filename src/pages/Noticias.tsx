import apiAxios from '../helpers/api.tsx';
import { useEffect, useState } from 'react';
import type { Noticia } from '../contexts/noticia.tsx';
import './Noticias.css';

export default function Noticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await apiAxios.get('/noticias');
        console.log('API Response:', response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setNoticias(response.data.data);
        } else {
          console.error('Unexpected API response format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching noticias:', error);
      }
    };

    fetchNoticias();
  }, []);

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
    } else {
      setEndDate(value);
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      setError('La fecha de inicio no puede ser mayor que la fecha de fin.');
    } else {
      setError('');
    }
  };

  const filteredNoticias = noticias.filter((noticia) => {
    const noticiaDate = new Date(noticia.fecha);
    const isAfterStartDate = startDate
      ? noticiaDate >= new Date(startDate)
      : true;
    const isBeforeEndDate = endDate ? noticiaDate <= new Date(endDate) : true;
    return isAfterStartDate && isBeforeEndDate;
  });

  return (
    <div className="noticias-container">
      <h1 className="noticias-title">Noticias</h1>

      <div className="filter-container">
        <label>
          Fecha Inicio:
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleDateChange('start', e.target.value)}
          />
        </label>
        <label>
          Fecha Fin:
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleDateChange('end', e.target.value)}
          />
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}

      <ul className="noticias-list">
        {filteredNoticias.map((noticia) => (
          <li key={noticia.id} className="noticia-item">
            <h2 className="noticia-title">{noticia.titulo}</h2>
            <p className="noticia-date">
              {new Date(noticia.fecha).toLocaleDateString()}
            </p>
            <p className="noticia-description">{noticia.descripcion}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
