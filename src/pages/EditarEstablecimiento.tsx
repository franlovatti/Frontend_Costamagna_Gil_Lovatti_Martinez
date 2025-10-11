import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { Submit } from '../components/ButtonField.tsx';
import { useEstablecimientos } from '../hooks/useEstablecimientos.tsx';
import alert from '../components/Alert.tsx';

export default function EditarEstablecimiento() {
  const navigate = useNavigate();
  const { eventoId } = useParams();
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    evento: eventoId ?? 0,
    id: 0,
  });

  const {establecimientos, loadingEstablecimientos, errorEstablecimientos} = useEstablecimientos(eventoId);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement | HTMLSelectElement;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:3000/api/establecimientos/' + form.id,
        form,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('Respuesta del backend:', response.data);
      setMessage('Establecimiento modificado con éxito');
      setSuccess(true);
      setTimeout(() => {
      navigate(-1);
      }, 2000);
    } catch (error: unknown) {
      if (error instanceof Error === false) {
        console.error('Error desconocido:', error);
        setMessage('Ocurrió un error desconocido.');
      } else {
        console.error('Error al modificar establecimiento: ', error.message);
        setMessage('Error al modificar establecimiento: ' + error.message);
      }
    }
  };
  return (
    <div className="container mt-4 text-bg-dark p-4 rounded-3 shadow-lg">
      <h2>Editar Establecimiento</h2>
      {errorEstablecimientos && (
        <div className ="alet alert-danger" role="alert">
          Error al cargar los establecimientos: {errorEstablecimientos.message}
        </div>
        )}

        {alert({message, success})}

      {/* Selección del establecimiento */}
      <div className="mb-3">
        <label htmlFor="selectEstablecimiento" className="form-label">
          Seleccione el establecimiento a modificar
        </label>
        <select
          id="selectEstablecimiento"
          className="form-select"
          value={form.id} 
          onChange={(e) => {
            const selectedId = Number(e.target.value);
            const selected = establecimientos?.find(
              (est) => est.id === selectedId
            );
            if (selected) {
              setForm({
                nombre: selected.nombre,
                direccion: selected.direccion,
                evento: selected.evento,
                id: selected.id,
              });
            }
          }}
        >
          <option value="">Seleccione un establecimiento</option>
          {!loadingEstablecimientos &&
            establecimientos &&
            establecimientos.map((est) => (
              <option key={est.id} value={est.id}>
                {est.nombre} - {est.direccion}
              </option>
            ))}
        </select>
      </div>

      {form.id != 0 && (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">
              Dirección
            </label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <Submit>Guardar cambios</Submit>
        </form>
      )}
    </div>
  );
}
