import { Col, Row, Tab, Tabs } from 'react-bootstrap';
import CardTorneos from '../components/CardTorneos.tsx';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import type { Torneo } from '../contexts/torneo.tsx';
import type { Equipo } from '../contexts/equipo.tsx';
import type { Usuario } from '../contexts/usuario';
import { useAuth } from '../hooks/useAuth.tsx';
import { useTorneo } from '../hooks/useTorneo.tsx';

export default function MisTorneos() {
  const {
    getTorneosCreadosPorUsuario,
    torneosCreados,
    getTorneosInscriptoPorUsuario,
    torneosInscripto,
    loading,
    error,
  } = useTorneo();
  const [dataTorneosCreador, setDataTorneosCreador] = useState<Torneo[]>([]);
  const [dataTorneosInscripto, setDataTorneosInscripto] = useState<Torneo[]>(
    [],
  );
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClick = (id: number | undefined) => {
    if (id !== undefined) {
      navigate(`/home/torneos/${id}`);
    }
  };

  useEffect(() => {
    if (user?.id) {
      getTorneosCreadosPorUsuario(Number(user.id));
      getTorneosInscriptoPorUsuario(Number(user.id));
    }
  }, [user?.id, getTorneosCreadosPorUsuario, getTorneosInscriptoPorUsuario]);

  useEffect(() => {
    setDataTorneosCreador(torneosCreados);
  }, [torneosCreados]);

  useEffect(() => {
    setDataTorneosInscripto(torneosInscripto);
  }, [torneosInscripto]);

  const userIsMemberOf = (torneo: Torneo): boolean => {
    if (!user || !torneo?.equipos) return false;
    const userIdStr = String(user.id);
    return torneo.equipos.some((e: Equipo) => {
      const miembros = (e.miembros as unknown as Usuario[]) ?? [];
      return miembros.some((m) => String(m.id) === userIdStr);
    });
  };

  return (
    <div className="torneos-page-container">
      <div className="torneos-inner-container">
        <div className="torneos-header">
          <h1>Mis Torneos</h1>
          <p className="torneos-subtitle">
            Explora tus propios torneos creados y aquellos en los que estás
            inscripto.
          </p>
        </div>

        {/* Error de conexión */}
        {error && !loading && (
          <div className="alert-danger-custom">⚠️ {error}</div>
        )}

        <Tabs
          defaultActiveKey="created"
          id="uncontrolled-tab-example"
          className="mb-3 tabs-header"
        >
          <Tab eventKey="created" title="Torneos Creados">
            {loading ? (
              <div className="loading-state">
                <div className="spinner-large"></div>
                <p>Cargando torneos...</p>
              </div>
            ) : dataTorneosCreador.length === 0 ? (
              <div className="torneos-empty-state">
                <div className="empty-state-icon">🏆</div>
                <p className="empty-state-text">No se encontraron torneos</p>
              </div>
            ) : (
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
                    isMember={userIsMemberOf(torneo)}
                  />
                </Col>
              ))}
            </Row>
            )}
          </Tab>
          <Tab eventKey="inscript" title="Torneos Inscripto">
            {loading ? (
              <div className="loading-state">
                <div className="spinner-large"></div>
                <p>Cargando torneos...</p>
              </div>
            ) : dataTorneosInscripto.length === 0 ? (
              <div className="torneos-empty-state">
                <div className="empty-state-icon">🏆</div>
                <p className="empty-state-text">No se encontraron torneos</p>
              </div>
            ) : (
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
            )}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
