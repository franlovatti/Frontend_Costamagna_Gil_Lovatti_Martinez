import type { User } from '../contexts/auth.tsx';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.tsx';
import StatCard from '../components/admin/StatCard.tsx';
import PerfilCard from '../components/PerfilCard.tsx';
import TorneosPerfil from '../components/TorneosPerfil.tsx';
import UsuarioFormModal from '../components/UsuarioFormModal.tsx';
import { useMisEquipos } from '../hooks/useEquipos.tsx';
import { useUsuario } from '../hooks/useUsuario.tsx';
import { useParticipacionesporUsuario } from '../hooks/useParticipaciones';
import './Perfil.css';
import ParticipacionesPerfil from '../components/ParticipacionesPerfil.tsx';
const Perfil = () => {
  const { user, updateUser } = useAuth();
  const { modificarUsuario, error, clearError } = useUsuario();
  const usuario: User = user
    ? user
    : ({
        id: '0',
        nombre: 'Invitado',
        apellido: '',
        usuario: 'invitado',
        email: 'invitado@example.com',
        role: 'Usuario',
        estado: false,
      } as User);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { equipos, loadingEquipos, errorEquipos } = useMisEquipos(usuario.id);
  const {
    participaciones,
    loading: loadingParticipaciones,
    error: errorParticipaciones,
  } = useParticipacionesporUsuario(usuario.id);

  function calcularEstadisticas(e: typeof equipos) {
    const datos = e.map((equip) => {
      const torneo = equip.evento;
      return {
        id: equip.id,
        inicio: torneo.fechaInicioEvento,
        fin: torneo.fechaFinEvento,
        partidosGanados:
          torneo.partidos?.filter((p) => {
            const esLocal = p.equipoLocal.id === equip.id;
            const esVisitante = p.equipoVisitante.id === equip.id;
            if (!esLocal && !esVisitante) return false;
            if (p.resultadoLocal === null || p.resultadoVisitante === null)
              return false;
            if (esLocal) return p.resultadoLocal > p.resultadoVisitante;
            if (esVisitante) return p.resultadoVisitante > p.resultadoLocal;
            return false;
          }).length || 0,
        partidosPendientes:
          torneo.partidos?.filter(
            (p) =>
              (p.equipoLocal.id === equip.id ||
                p.equipoVisitante.id === equip.id) &&
              (p.resultadoLocal === null || p.resultadoVisitante === null),
          ).length || 0,
      };
    });
    const torneosActivos = datos.filter((d) => {
      const ahora = new Date();
      return new Date(d.inicio) <= ahora && new Date(d.fin) >= ahora;
    }).length;
    const torneosTerminados = datos.filter((d) => {
      const ahora = new Date();
      return new Date(d.fin) < ahora;
    }).length;
    const partidosPendientes = datos.reduce(
      (acc, d) => acc + d.partidosPendientes,
      0,
    );
    const victorias = datos.reduce((acc, d) => acc + d.partidosGanados, 0);

    return { torneosActivos, torneosTerminados, partidosPendientes, victorias };
  }

  const handleEdit = (usuario: User) => {
    setEditingUser(usuario);
    setShowModal(true);
  };

  const handleSave = async (updatedData: Partial<User>) => {
    clearError();
    const ok = await modificarUsuario({
      ...updatedData,
      id: usuario.id,
    } as User);
    if (ok) {
      updateUser(updatedData);
      setShowModal(false);
    }
  };

  const { torneosActivos, torneosTerminados, partidosPendientes, victorias } =
    calcularEstadisticas(equipos);
  const stats = [
    { icon: '🏆', value: torneosActivos, title: 'Torneos activos' },
    { icon: '✅', value: torneosTerminados, title: 'Torneos terminados' },
    { icon: '🎯', value: partidosPendientes, title: 'Partidos pendientes' },
    { icon: '🏅', value: victorias, title: 'Victorias' },
  ];

  return (
    <div className="perfil-page">
      <div className="container-perfil">
        {/* Header */}
        <div className="perfil-header mb-4">
          <h1 className="mb-2">Mi Perfil</h1>
          <p className="text-muted-custom mb-0">
            Administra tu información y revisa tu historial
          </p>
        </div>

        {/* Grid principal */}
        <div className="row g-4 mb-4">
          <PerfilCard usuario={usuario} onEdit={handleEdit} />

          {/* Estadísticas y Torneos */}
          <div className="col-12 col-lg-8">
            {/* Estadísticas */}
            <div className="row g-3 mb-4">
              {stats.map((stat, index) =>
                loadingEquipos ? (
                <div key={index} className="stat-card d-flex align-items-center justify-content-center" style={{ minHeight: 120 }}>
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
                ) : (
                  <div className="col-6 col-md-3 col-lg-3" key={index}>
                    <StatCard
                      icon={stat.icon}
                      value={stat.value}
                      title={stat.title}
                    />
                  </div>
                ),
              )}
            </div>

            <TorneosPerfil
              equipos={equipos}
              loadingEquipos={loadingEquipos}
              errorEquipos={errorEquipos}
            />
            <ParticipacionesPerfil
              participaciones={participaciones}
              loading={loadingParticipaciones}
              error={errorParticipaciones}
            />
          </div>
        </div>

        {showModal && (
          <UsuarioFormModal
            setShowModal={setShowModal}
            editingUsuario={editingUser}
            onSave={handleSave}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default Perfil;
