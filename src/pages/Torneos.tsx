import { Button, Col, Row, Form } from 'react-bootstrap';
import { useState } from 'react';
import CardTorneos from '../components/CardTorneos';
import { Link, useNavigate } from 'react-router-dom';
import apiAxios from '../helpers/api';
import { useEffect } from 'react';
import type { Torneo, Deporte, Localidad } from '../types';

export default function Torneos() {
  const [dataTorneos, setDataTorneos] = useState<Torneo[]>([]);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');
  const [dataDeportes, setDataDeportes] = useState<Deporte[]>([]);
  const [dataLocalidades, setDataLocalidades] = useState<Localidad[]>([]);
  const [errorConexion, setErrorConexion] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      apiAxios.get('/eventos'),
      apiAxios.get('/deportes'),
      apiAxios.get('/localidades'),
    ])
      .then(([torneosRes, deportesRes, localidadesRes]) => {
        setDataTorneos(torneosRes.data.data);
        setDataDeportes(deportesRes.data.data);
        setDataLocalidades(localidadesRes.data.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setErrorConexion(true);
      });
  }, []);
  const handleClick = (id: number) => {
    navigate(`/home/torneos/${id}`);
  };

  return (
    <div className="text-bg-dark container">
      {errorConexion && (
        <div className="alert alert-danger" role="alert">
          Ocurrió un error al recuperar los datos. Por favor, inténtelo de
          nuevo.
        </div>
      )}
      <Row className="text-center p-3">
        <Col>
          <Button variant="outline-primary">Ingresar codigo</Button>
        </Col>
        <Col>
          <Link to="crear-torneo" className="btn btn-primary">
            Crear Torneo
          </Link>
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
              <option key={sport.id} value={sport.nombre}>
                {sport.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select
            aria-label="seleccionar localidad"
            className="bg-bs-dark text-bg-dark border border-primary"
            value={selectedLocalidad}
            onChange={(e) => setSelectedLocalidad(e.target.value)}
          >
            <option value="">Filtrar por localidad</option>
            {dataLocalidades.map((localidad) => (
              <option key={localidad.id} value={localidad.nombre}>
                {localidad.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row>
        {dataTorneos
          .filter(
            (torneo) =>
              (!selectedSport ||
                String(torneo.deporte.nombre) === selectedSport) &&
              (!selectedLocalidad ||
                String(torneo.localidad.nombre) === selectedLocalidad)
          )
          .map((torneo) => (
            <Col key={torneo.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <CardTorneos torneo={torneo} handleClick={handleClick} />
            </Col>
          ))}
      </Row>
    </div>
  );
}
