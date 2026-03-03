import type { Equipo } from '../contexts/equipo.tsx';
import type { Participacion } from '../contexts/participacion.tsx';
import type { Usuario } from '../contexts/usuario.tsx';

export default function TablaParticipantes({
  participantes,
  setOrdenarParticipanteCriterio,
  calcularStats,
}: {
  participantes: Usuario[];
  setOrdenarParticipanteCriterio: (criterio: string) => void;
  calcularStats: (
    participations: Participacion[],
  ) => { faltas: number; minutosjugados: number; puntos: number } | null;
}) {
  return (
    <div className="section-container">
      <h2 className="section-title">Tabla de Participantes</h2>

      <div className="filtros-tabla-partcipantes">
        <select
          id="criterioOrdenamiento"
          defaultValue=""
          onChange={(e) => setOrdenarParticipanteCriterio(e.target.value)}
        >
          <option value="" disabled hidden>
            Ordenar Participantes
          </option>
          <option value="faltas">Faltas</option>
          <option value="minutosjugados">Minutos Jugados</option>
          <option value="puntos">Puntos</option>
          <option value="equipo">Equipo</option>
        </select>
      </div>

      {/* Versión Desktop - Tabla */}
      <div className="custom-table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th
                className="table-column-header"
                onClick={() => setOrdenarParticipanteCriterio('equipo')}
              >
                Equipo
              </th>
              <th
                className="table-column-header"
                onClick={() => setOrdenarParticipanteCriterio('faltas')}
              >
                Faltas
              </th>
              <th
                className="table-column-header"
                onClick={() => setOrdenarParticipanteCriterio('minutosjugados')}
              >
                Minutos Jugados
              </th>
              <th
                className="table-column-header"
                onClick={() => setOrdenarParticipanteCriterio('puntos')}
              >
                Puntos
              </th>
            </tr>
          </thead>
          <tbody>
            {participantes && participantes.length > 0 ? (
              participantes.map((participante: Usuario) => (
                <tr key={participante.id}>
                  <td>{participante.nombre + ' ' + participante.apellido}</td>
                  <td>
                    {participante.equipos.map((equipo) => (
                      <span key={equipo.id}>{equipo.nombre}</span>
                    ))}
                  </td>
                  <td>{calcularStats(participante.participations)?.faltas}</td>
                  <td>
                    {calcularStats(participante.participations)?.minutosjugados}
                  </td>
                  <td>{calcularStats(participante.participations)?.puntos}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="empty-state-cell">
                  No hay participantes registrados aún
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Versión Mobile - Cards */}
      <div className="equipos-mobile-list">
        {participantes && participantes.length > 0 ? (
          participantes.map((participante: Usuario) => (
            <div key={participante.id} className="equipo-mobile-card">
              <div className="equipo-mobile-header">
                <div className="equipo-mobile-name">
                  {participante.nombre + ' ' + participante.apellido}
                </div>
              </div>
              <div className="equipo-mobile-info">
                <div className="equipo-info-row">
                  <span className="equipo-info-label">Equipo</span>
                  {participante.equipos.map((equipo: Equipo) => (
                    <span key={equipo.id}>{equipo.nombre}</span>
                  ))}
                </div>
                <div className="equipo-info-row">
                  <span className="equipo-info-label">Faltas</span>
                  <span>
                    {calcularStats(participante.participations)?.faltas}
                  </span>
                </div>
                <div className="equipo-info-row">
                  <span className="equipo-info-label">Minutos Jugados</span>
                  <span>
                    {calcularStats(participante.participations)?.minutosjugados}
                  </span>
                </div>
                <div className="equipo-info-row">
                  <span className="equipo-info-label">Puntos</span>
                  <span>
                    {calcularStats(participante.participations)?.puntos}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <p className="empty-state-text">No hay Participantes aún</p>
          </div>
        )}
      </div>
    </div>
  );
}
