import { Button, Col, Row, Form } from 'react-bootstrap';
import { useState } from 'react';
import CardTorneos from '../components/layout/CardTorneos';

/* CONSTANTES DE DESARROLLO */
//Cambiar por fetch a la api cuando este lista
const dataDeportes = [
  { id: 1, name: 'Futbol' },
  { id: 2, name: 'Basquet' },
  { id: 3, name: 'Tenis' },
];
const dataTorneos = [
  {
    id: 1,
    nombre: 'Torneo de Futbol 1',
    descripcion:
      'Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 Descripcion del torneo de futbol 1 ',
    deporte: 'Futbol',
    fechaInicioTorneo: '2025/01/01',
    fechaFinTorneo: '2026/12/12',
    ubicacion: 'Rosario',
    img: 'https://placehold.co/600x400',
    fechaInicioInscripcion: '2025/01/01',
    fechaFinInscripcion: '2026/12/12',
    privado: false,
    cantidadEquipos: 16,
  },
  {
    id: 2,
    nombre: 'Torneo de Basquet 1',
    descripcion: 'Descripcion del torneo de basquet 1',
    deporte: 'Basquet',
    fechaInicioTorneo: '2025/01/01',
    fechaFinTorneo: '2026/12/12',
    ubicacion: 'Rosario',
    img: 'https://placehold.co/600x400',
    fechaInicioInscripcion: '2025/01/01',
    fechaFinInscripcion: '2026/12/12',
    privado: false,
    cantidadEquipos: 16,
  },
  {
    id: 3,
    nombre: 'Torneo de Tenis 1',
    descripcion: 'Descripcion del torneo de tenis 1',
    deporte: 'Tenis',
    fechaInicioTorneo: '2025/01/01',
    fechaFinTorneo: '2026/12/12',
    ubicacion: 'Rosario',
    img: 'https://placehold.co/600x400',
    fechaInicioInscripcion: '2025/01/01',
    fechaFinInscripcion: '2026/12/12',
    privado: false,
    cantidadEquipos: 16,
  },
  {
    id: 4,
    nombre: 'Torneo de Futbol 2',
    descripcion: 'Descripcion del torneo de futbol 2',
    deporte: 'Futbol',
    fechaInicioTorneo: '2025/01/01',
    fechaFinTorneo: '2026/12/12',
    ubicacion: 'Rosario',
    img: 'https://placehold.co/600x400',
    fechaInicioInscripcion: '2025/01/01',
    fechaFinInscripcion: '2026/12/12',
    privado: false,
    cantidadEquipos: 16,
  },
  {
    id: 5,
    nombre: 'Torneo de Basquet 2',
    descripcion: 'Descripcion del torneo de basquet 2',
    deporte: 'Basquet',
    fechaInicioTorneo: '2025/01/01',
    fechaFinTorneo: '2026/12/12',
    ubicacion: 'Rosario',
    img: 'https://placehold.co/600x400',
    fechaInicioInscripcion: '2025/01/01',
    fechaFinInscripcion: '2026/12/12',
    privado: false,
    cantidadEquipos: 16,
  },
  {
    id: 6,
    nombre: 'Torneo de Tenis 2',
    descripcion: 'Descripcion del torneo de tenis 2',
    deporte: 'Tenis',
    fechaInicioTorneo: '2025/01/01',
    fechaFinTorneo: '2026/12/12',
    ubicacion: 'Rosario',
    img: 'https://placehold.co/600x400',
    fechaInicioInscripcion: '2025/01/01',
    fechaFinInscripcion: '2026/12/12',
    privado: false,
    cantidadEquipos: 16,
  },
];

export default function Torneos() {
  const [selectedSport, setSelectedSport] = useState<string>('');

  return (
    <div className="text-bg-dark container">
      <Row className="text-center p-3">
        <Col>
          <Button variant="outline-primary">Ingresar codigo</Button>
        </Col>
        <Col>
          <Button href="crear-torneo">Crear torneo</Button>
        </Col>
        <Col>
          <Form.Select
            aria-label="seleccionar deporte"
            className="bg-bs-dark text-bg-dark border border-primary"
            value={selectedSport}
            onChange={(e) => setSelectedSport(e.target.value)}
          >
            <option value="">Filtrar por deporte</option>
            {dataDeportes.map((sport) => (
              <option key={sport.id} value={sport.name}>
                {sport.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {dataTorneos
          .filter(
            (torneo) => !selectedSport || torneo.deporte === selectedSport
          )
          .map((torneo) => (
            <Col key={torneo.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <CardTorneos {...torneo} />
            </Col>
          ))}
      </Row>
    </div>
  );
}
