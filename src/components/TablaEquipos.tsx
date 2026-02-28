import { useNavigate } from "react-router-dom";
import type { Equipo } from "../types";
import type { Torneo } from "../contexts/torneo";
import { estaAbiertoPeriodo } from "../helpers/convertirFechas.tsx";

export default function TablaEquipos({
  torneo,
  isMember,
  userIsMember,
  isCaptain,
  setSelectedTeam,
  setEnrollPassword,
  setEnrollError,
  setShowEnrollModal,
  handleDeleteTeam,
  setAbandono,
}: {
  torneo: Torneo;
  isMember: (equipo: Equipo) => boolean;
  userIsMember: () => boolean;
  isCaptain: (equipo: Equipo) => boolean;
  setSelectedTeam: (equipo: Equipo | null) => void;
  setEnrollPassword: (password: string) => void;
  setEnrollError: (error: string | null) => void;
  setShowEnrollModal: (show: boolean) => void;
  handleDeleteTeam: (equipoId: number) => void;
  setAbandono: (abandono: boolean) => void;
}) {

  const navigate = useNavigate();

  return (
    <div className="section-container">
      <h2 className="section-title">Equipos Participantes</h2>

      {/* Versión Desktop - Tabla */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Equipo</th>
              <th>Jugadores</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {torneo.equipos && torneo.equipos.length > 0 ? (
              torneo.equipos.map((equipo: Equipo, idx: number) => (
                <tr key={equipo.id}>
                  <td>{idx + 1}</td>
                  <td className="team-name-cell">{equipo.nombre}</td>
                  <td>
                    <span className="jugadores-badge">
                      {equipo.miembros?.length ?? 0}/
                      {torneo.deporte?.cantMaxJugadores ?? '-'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge-custom ${
                        equipo.esPublico
                          ? 'badge-equipo'
                          : 'badge-individual'
                      }`}
                    >
                      {equipo.esPublico ? 'Público' : 'Privado'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      {!userIsMember() ? (
                        estaAbiertoPeriodo(
                          torneo.fechaInicioInscripcion,
                          torneo.fechaFinInscripcion
                        ) ? (
                        <button
                          className="btn-action"
                          onClick={() => {
                            setSelectedTeam(equipo);
                            setEnrollPassword('');
                            setEnrollError(null);
                            setShowEnrollModal(true);
                          }}
                        >
                          Unirse
                        </button>
                        ) : ( 
                          <button className="btn-action btn-disabled" disabled>
                            Unirse
                          </button>
                        )
                      ) : isCaptain(equipo) ? (
                        <>
                          {estaAbiertoPeriodo(
                          torneo.fechaInicioInscripcion,
                          torneo.fechaFinInscripcion
                          ) ? (
                          <button
                            className="btn-action btn-delete"
                            onClick={() => handleDeleteTeam(equipo.id)}
                          >
                            Eliminar
                          </button>
                          ) : (
                            <button className="btn-action btn-disabled" disabled>
                              Eliminar
                            </button>
                          )}
                          <button
                            className="btn-action"
                            onClick={() =>
                              navigate(`/home/equipos/${equipo.id}`)
                            }
                          >
                            Ver equipo
                          </button>
                        </>
                      ) : isMember(equipo) ? (
                        <>
                          <button
                            className="btn-action"
                            onClick={() =>
                              navigate(`/home/equipos/${equipo.id}`)
                            }
                          >
                            Ver equipo
                          </button>
                          {estaAbiertoPeriodo(
                          torneo.fechaInicioInscripcion,
                          torneo.fechaFinInscripcion) && (
                          <button className="btn-action" onClick={() => {
                              setSelectedTeam(equipo);
                              setAbandono(true);
                            }}>
                              Abandonar
                          </button>)}
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state-cell">
                  No hay equipos inscritos aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Versión Mobile - Cards */}
      <div className="equipos-mobile-list">
        {torneo.equipos && torneo.equipos.length > 0 ? (
          torneo.equipos.map((equipo: Equipo, idx: number) => (
            <div key={equipo.id} className="equipo-mobile-card">
              <div className="equipo-mobile-header">
                <div className="equipo-mobile-number">{idx + 1}</div>
                <div className="equipo-mobile-name">{equipo.nombre}</div>
              </div>
              <div className="equipo-mobile-info">
                <div className="equipo-info-row">
                  <span className="equipo-info-label">Jugadores</span>
                  <span className="jugadores-badge">
                    {equipo.miembros?.length ?? 0}/
                    {torneo.deporte?.cantMaxJugadores ?? '-'}
                  </span>
                </div>
                <div className="equipo-info-row">
                  <span className="equipo-info-label">Tipo</span>
                  <span
                    className={`badge-custom ${
                      equipo.esPublico ? 'badge-equipo' : 'badge-individual'
                    }`}
                  >
                    {equipo.esPublico ? 'Público' : 'Privado'}
                  </span>
                </div>
              </div>
              <div className="equipo-mobile-actions">
                {!userIsMember() ? (
                  estaAbiertoPeriodo(
                    torneo.fechaInicioInscripcion,
                    torneo.fechaFinInscripcion
                  ) ? (
                  <button
                    className="btn-action"
                    onClick={() => {
                      setSelectedTeam(equipo);
                      setEnrollPassword('');
                      setEnrollError(null);
                      setShowEnrollModal(true);
                    }}
                  >
                    Unirse
                  </button>
                  ) : (
                    <button className="btn-action btn-disabled" disabled>
                      Unirse
                    </button>
                  )
                ) : isCaptain(equipo) ? (
                  <>
                    <button
                      className="btn-action"
                      onClick={() =>
                        navigate(`/home/equipos/${equipo.id}/editar`)
                      }
                    >
                      Editar
                    </button>
                    <button
                      className="btn-action"
                      onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                    >
                      Ver equipo
                    </button>
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDeleteTeam(equipo.id)}
                    >
                      Eliminar
                    </button>
                  </>
                ) : isMember(equipo) ? (
                  <button
                    className="btn-action"
                    onClick={() => navigate(`/home/equipos/${equipo.id}`)}
                  >
                    Ver equipo
                  </button>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-text">No hay equipos inscritos aún</p>
          </div>
        )}
      </div>
    </div>
  );
}