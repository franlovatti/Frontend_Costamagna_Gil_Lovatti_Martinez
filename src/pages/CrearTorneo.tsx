import { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const dataDeportes = ['Fútbol', 'Básquet', 'Vóley', 'Tenis'];

export default function CrearTorneo() {
  const [form, setForm] = useState({
    nombre: '',
    deporte: '',
    descripcion: '',
    fechaInicioInscripcion: '',
    fechaFinInscripcion: '',
    fechaInicioTorneo: '',
    fechaFinTorneo: '',
    ubicacion: '',
    privado: false,
    img: '',
  });
  const [cantidadEquipos, setCantidadEquipos] = useState<number>(32);
  const [imagen, setImagen] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (
      e.target instanceof HTMLInputElement &&
      e.target.type === 'file' &&
      e.target.files &&
      e.target.files[0]
    ) {
      setImagen(e.target.files[0]);
    }
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' && 'checked' in e.target
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //Enviar form a la api
    e.preventDefault(); // Eliminar cuando se implemente API, deberia redirigirte a la pagina del torneo creado
    console.log({ ...form, cantidadEquipos, imagen });
  };

  return (
    <div className="text-bg-dark container">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formTournamentName">
              <Form.Label>Nombre del Torneo</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del torneo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Label>Deporte</Form.Label>
            <Form.Select
              aria-label="Deporte"
              name="deporte"
              value={form.deporte}
              onChange={handleChange}
            >
              <option value="">Seleccione el deporte</option>
              {dataDeportes.map((deporte, index) => (
                <option key={index} value={deporte}>
                  {deporte}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formTournamentDescription">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Ingrese una descripción del torneo"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaInicioInscripcion`}>
              <Form.Label>Inicio Inscripcion</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicioInscripcion"
                value={form.fechaInicioInscripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaFinInscripcion`}>
              <Form.Label>Fin Inscripcion</Form.Label>
              <Form.Control
                type="date"
                name="fechaFinInscripcion"
                value={form.fechaFinInscripcion}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaInicioTorneo`}>
              <Form.Label>Inicio del Torneo</Form.Label>
              <Form.Control
                type="date"
                name="fechaInicioTorneo"
                value={form.fechaInicioTorneo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3" controlId={`fechaFinTorneo`}>
              <Form.Label>Fin del Torneo</Form.Label>
              <Form.Control
                type="date"
                name="fechaFinTorneo"
                value={form.fechaFinTorneo}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formTournamentLocation">
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese la ubicación del torneo"
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Label>Cantidad de Equipos: {cantidadEquipos}</Form.Label>
            <Form.Range
              min={0}
              max={64}
              step={2}
              value={cantidadEquipos}
              onChange={(e) => setCantidadEquipos(Number(e.target.value))}
            />
          </Col>
        </Row>
        <Form.Group className="mb-3" controlId="formTournamentImage">
          <Form.Label>Imagen del Torneo</Form.Label>
          <Form.Control
            type="file"
            name="img"
            accept="image/"
            value={form.img}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="checkbox"
            label="Privado"
            name="privado"
            checked={form.privado}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Crear Torneo
        </Button>
      </Form>
    </div>
  );
}
