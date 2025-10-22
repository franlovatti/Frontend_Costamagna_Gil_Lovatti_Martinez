import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Submit } from '../components/ButtonField.tsx';
import { useOneEstablecimiento } from '../hooks/useEstablecimientos.tsx';
import alert from '../components/Alert.tsx';

export default function EditarEstablecimiento() {
  const navigate = useNavigate();
  const { id, establecimientoId } = useParams();
  const [message, setMessage] = useState<string>();
  const [success, setSuccess] = useState(false);
  const { establecimiento, errorEstablecimiento } =
    useOneEstablecimiento(establecimientoId);

  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    evento: id ?? 0,
    id: Number(establecimientoId),
  });

  useEffect(() => {
    if (establecimiento) {
      setForm({
        nombre: establecimiento.nombre,
        direccion: establecimiento.direccion,
        id: establecimiento.id,
        evento: establecimiento.evento,
      });
    }
  }, [establecimiento]);

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
      }, 1000);
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
      {errorEstablecimiento &&
        alert({
          message:
            'Error al cargar el establecimiento: ' +
            errorEstablecimiento.message,
          success: false,
        })}

      {alert({ message, success })}

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
