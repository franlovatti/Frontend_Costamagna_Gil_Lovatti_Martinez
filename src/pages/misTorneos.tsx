import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import CardTorneos from '../components/CardTorneos.tsx';
import { useNavigate } from 'react-router';
import apiAxios from '../helpers/api';
import { useEffect, useState } from 'react';
import type { Torneo, Equipo, Usuario } from '../types';
import { useAuth } from '../hooks/useAuth.tsx';

export default function MisTorneos() {
  const [dataTorneos, setDataTorneos] = useState<Torneo[]>([]);
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
      .get('/eventos')
      .then((response) => {
        setDataTorneos(response.data.data);
      })
      .catch((error) => {
        console.error('Error fetching torneos:', error);
      });
  }, []);
  const userIsMemberOf = (torneo: Torneo): boolean => {
    if (!user || !torneo?.equipos) return false;
    const userIdStr = String(user.id);
    return torneo.equipos.some((e: Equipo) => {
      const miembros = (e.miembros as Usuario[]) ?? [];
      return miembros.some((m) => String(m.id) === userIdStr);
    });
  };
  const userIsCreatorOf = (torneo: Torneo): boolean => {
    if (!user || !torneo) return false;
    return String(torneo.creador) == String(user.id);
  };

  return (
    <div className="text-bg-dark container">
      <Tabs
        defaultActiveKey="created"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="created" title="Torneos Creados">
          <Row>
            {dataTorneos.map((torneo) => (
              <Col
                key={torneo.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4"
              >
                {userIsCreatorOf(torneo) && (
                  <CardTorneos torneo={torneo} handleClick={handleClick} />
                )}
              </Col>
            ))}
          </Row>
        </Tab>
        <Tab eventKey="inscript" title="Torneos Inscripto">
          <Row>
            {dataTorneos.map((torneo) => (
              <Col
                key={torneo.id}
                xs={12}
                sm={6}
                md={4}
                lg={3}
                className="mb-4"
              >
                {userIsMemberOf(torneo) && (
                  <CardTorneos torneo={torneo} handleClick={handleClick} />
                )}
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </div>
  );
}
