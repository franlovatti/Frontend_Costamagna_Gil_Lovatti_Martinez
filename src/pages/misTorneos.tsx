import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import CardTorneos from '../components/CardTorneos.tsx';
import { useNavigate } from 'react-router';
import apiAxios from '../helpers/api.tsx';
import { useEffect, useState } from 'react';
import type { Torneo } from '../types.tsx';
import { useAuth } from '../hooks/useAuth.tsx';

export default function MisTorneos() {
  const [dataTorneosCreador, setDataTorneosCreador] = useState<Torneo[]>([]);
  const [dataTorneosInscripto, setDataTorneosInscripto] = useState<Torneo[]>(
    []
  );
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (id: number) => {
    navigate(`/home/torneos/${id}`);
  };

  /*Esto esta mal hecho, deberia crear 2 nuevos endpoints en el back q devuevan directamente todos 
  los torneos creados por un user y otro de todos los torneos que participa, 
  lo hice asi con get all para hacerlo rapido */
  useEffect(() => {
    apiAxios
      .get('/eventos/creador/' + user?.id)
      .then((response) => {
        setDataTorneosCreador(response.data.data);
        console.log('Torneos creados:', response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching torneos:', error);
      });
  }, [user?.id]);

  useEffect(() => {
    apiAxios
      .get('/eventos/participacion/' + user?.id)
      .then((response) => {
        setDataTorneosInscripto(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching torneos:', error);
      });
  }, [user?.id]);

  return (
    <div className="torneos-page-container">
      <div className="torneos-inner-container">
        <div className="torneos-header">
          <h1>Mis Torneos</h1>
          <p className="torneos-subtitle">
            Explora tus propios torneos creados y aquellos en los que estás inscripto.
          </p>
        </div>
        <Tabs
          defaultActiveKey="created"
          id="uncontrolled-tab-example"
          className="mb-3 tabs-header"
        >
          <Tab eventKey="created" title="Torneos Creados">
            <Row>
              {dataTorneosCreador.map((torneo) => (
                <Col
                  key={torneo.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-4"
                >
                  <CardTorneos
                    torneo={torneo}
                    handleClick={handleClick}
                    isCreador={true}
                  />
                </Col>
              ))}
            </Row>
          </Tab>
          <Tab eventKey="inscript" title="Torneos Inscripto">
            <Row>
              {dataTorneosInscripto.map((torneo) => (
                <Col
                  key={torneo.id}
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}
                  className="mb-4"
                >
                  <CardTorneos
                    torneo={torneo}
                    handleClick={handleClick}
                    isMember={true}
                  />
                </Col>
              ))}
            </Row>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
