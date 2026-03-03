import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormTorneos from '../components/FormTorneos';
import ConfirmModal from '../components/ConfirmModal';
import { InviteModal } from '../components/InviteModal';
import TablaPartidos from '../components/TablaPartidos';
import TablaEquipos from '../components/TablaEquipos';
import type { Torneo } from '../contexts/torneo';
import type { Deporte } from '../contexts/deporte';
import type { Localidad } from '../contexts/localidad';
import type { Equipo } from '../contexts/equipo';
import type { Partido } from '../contexts/partido';
import { useDeporte } from '../hooks/useDeporte.tsx';
import { useLocalidad } from '../hooks/useLocalidad.tsx';
import { useInvitacion } from '../hooks/useInvitacion.tsx';
import { estaAbiertoPeriodo } from '../helpers/convertirFechas.tsx';

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../hooks/useDeporte.tsx', () => ({
  useDeporte: vi.fn(),
}));

vi.mock('../hooks/useLocalidad.tsx', () => ({
  useLocalidad: vi.fn(),
}));

vi.mock('../hooks/useInvitacion.tsx', () => ({
  useInvitacion: vi.fn(),
}));

vi.mock('../helpers/convertirFechas.tsx', () => ({
  toDatetimeLocal: (value?: Date | string | null) =>
    value ? '2026-03-01T00:00' : '',
  parseDatetimeLocal: (value: string) => new Date(`${value}T00:00:00.000Z`),
  formatFecha: (value: Date | string) =>
    typeof value === 'string' ? value : '2026-03-01',
  estaAbiertoPeriodo: vi.fn(() => true),
}));

const mockedUseDeporte = vi.mocked(useDeporte);
const mockedUseLocalidad = vi.mocked(useLocalidad);
const mockedUseInvitacion = vi.mocked(useInvitacion);
const mockedEstaAbiertoPeriodo = vi.mocked(estaAbiertoPeriodo);

const deporteMock: Deporte = {
  id: 1,
  nombre: 'Fútbol',
  cantMinJugadores: 5,
  cantMaxJugadores: 11,
  duracion: 90,
};

const localidadMock: Localidad = {
  id: 1,
  lat: '-32.95',
  lng: '-60.66',
  descripcion: 'Rosario',
  codigo: 'ROS',
};

const torneoBase: Torneo = {
  id: 10,
  nombre: 'Torneo Apertura',
  deporte: deporteMock,
  fechaInicioInscripcion: new Date('2026-03-01'),
  fechaFinInscripcion: new Date('2026-03-10'),
  fechaInicioEvento: new Date('2026-03-12'),
  fechaFinEvento: new Date('2026-03-20'),
  localidad: localidadMock,
  esPublico: true,
  cantEquiposMax: 8,
  creador: 1,
  equipos: [],
};

beforeEach(() => {
  navigateMock.mockReset();
  mockedEstaAbiertoPeriodo.mockReturnValue(true);

  mockedUseDeporte.mockReturnValue({
    deportes: [deporteMock],
    getDeportes: vi.fn(),
    error: null,
    loading: false,
    filtrarDeportes: vi.fn(),
    borrarDeporte: vi.fn(),
    modificarDeporte: vi.fn(),
    crearDeporte: vi.fn(),
  });

  mockedUseLocalidad.mockReturnValue({
    localidades: [localidadMock],
    getLocalidades: vi.fn(),
    error: null,
    loading: false,
    crearLocalidad: vi.fn(),
    borrarLocalidad: vi.fn(),
  });

  mockedUseInvitacion.mockReturnValue({
    invitacion: null,
    loading: false,
    error: null,
    getInvitacion: vi.fn(),
    aceptarInvitacion: vi.fn(),
    enviarInvitacion: vi.fn(),
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('FormTorneos', () => {
  it('renderiza título de creación y campos principales', () => {
    render(
      <FormTorneos
        setShowModal={vi.fn()}
        editingTorneo={null}
        onSave={vi.fn()}
      />,
    );

    expect(screen.getByText('Crear Nuevo Torneo')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre del Torneo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deporte/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Localidad/i)).toBeInTheDocument();
  });

  it('envía datos válidos y cierra el modal', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    const setShowModal = vi.fn();

    render(
      <FormTorneos
        setShowModal={setShowModal}
        editingTorneo={null}
        onSave={onSave}
      />,
    );

    await user.type(screen.getByLabelText(/Nombre del Torneo/i), 'Copa Test');
    await user.type(
      screen.getByLabelText(/Descripción/i),
      'Descripción válida',
    );

    await user.selectOptions(screen.getByLabelText(/Deporte/i), '1');
    await user.selectOptions(screen.getByLabelText(/Localidad/i), '1');

    const inicioInscripcion = document.getElementById(
      'fechaInicioInscripcion',
    ) as HTMLInputElement;
    const finInscripcion = document.getElementById(
      'fechaFinInscripcion',
    ) as HTMLInputElement;
    const inicioTorneo = document.getElementById(
      'fechaInicioTorneo',
    ) as HTMLInputElement;
    const finTorneo = document.getElementById(
      'fechaFinTorneo',
    ) as HTMLInputElement;

    await user.type(inicioInscripcion, '2026-03-01');
    await user.type(finInscripcion, '2026-03-05');
    await user.type(inicioTorneo, '2026-03-06');
    await user.type(finTorneo, '2026-03-10');

    const cantidadEquipos = document.getElementById(
      'cantidadEquipos',
    ) as HTMLInputElement;
    await user.clear(cantidadEquipos);
    await user.type(cantidadEquipos, '10');

    await user.type(screen.getByLabelText(/contrasenia del Torneo/i), '1234');

    await user.click(screen.getByRole('button', { name: /crear torneo/i }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(setShowModal).toHaveBeenCalledWith(false);
  });

  it('muestra error y no envía si falta nombre', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <FormTorneos
        setShowModal={vi.fn()}
        editingTorneo={null}
        onSave={onSave}
      />,
    );

    await user.click(screen.getByRole('button', { name: /crear torneo/i }));

    expect(
      await screen.findByText(/El nombre es obligatorio/i),
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('valida que fin de inscripción sea posterior al inicio', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(
      <FormTorneos
        setShowModal={vi.fn()}
        editingTorneo={null}
        onSave={onSave}
      />,
    );

    await user.type(
      screen.getByLabelText(/Nombre del Torneo/i),
      'Copa inválida',
    );
    await user.selectOptions(screen.getByLabelText(/Deporte/i), '1');
    await user.selectOptions(screen.getByLabelText(/Localidad/i), '1');

    const inicioInscripcion = document.getElementById(
      'fechaInicioInscripcion',
    ) as HTMLInputElement;
    const finInscripcion = document.getElementById(
      'fechaFinInscripcion',
    ) as HTMLInputElement;

    await user.type(inicioInscripcion, '2026-03-10');
    await user.type(finInscripcion, '2026-03-09');

    fireEvent.blur(finInscripcion);

    expect(
      await screen.findByText(/Debe ser posterior al inicio de inscripción/i),
    ).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe('ConfirmModal e InviteModal', () => {
  it('ConfirmModal llama handlers de confirmar y cancelar', async () => {
    const user = userEvent.setup();
    const handleConfirmDelete = vi.fn();
    const handleCancelDelete = vi.fn();
    const setShowConfirm = vi.fn();

    render(
      <ConfirmModal
        objeto="el torneo seleccionado"
        asunto="borrado"
        setShowConfirm={setShowConfirm}
        handleConfirmDelete={handleConfirmDelete}
        handleCancelDelete={handleCancelDelete}
      />,
    );

    await user.click(screen.getByRole('button', { name: /confirmar/i }));
    await user.click(screen.getByRole('button', { name: /cancelar/i }));
    fireEvent.click(
      screen.getByText(/¿Estás seguro/i).closest('.modal-overlay') as Element,
    );

    expect(handleConfirmDelete).toHaveBeenCalled();
    expect(handleCancelDelete).toHaveBeenCalled();
    expect(setShowConfirm).toHaveBeenCalledWith(false);
  });

  it('InviteModal envía invitación y cierra luego del éxito', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const enviarInvitacion = vi.fn();

    mockedUseInvitacion.mockReturnValue({
      invitacion: null,
      loading: false,
      error: null,
      getInvitacion: vi.fn(),
      aceptarInvitacion: vi.fn(),
      enviarInvitacion,
    });

    render(<InviteModal equipoId={55} isOpen={true} onClose={onClose} />);

    const input = screen.getByPlaceholderText('correo@ejemplo.com');
    fireEvent.change(input, { target: { value: 'jugador@test.com' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar invitación/i }));

    expect(enviarInvitacion).toHaveBeenCalledWith(55, 'jugador@test.com');
    expect(
      screen.getByText(/Invitación enviada correctamente/i),
    ).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });
    expect(onClose).toHaveBeenCalled();
  });

  it('InviteModal muestra error cuando el hook devuelve error', () => {
    mockedUseInvitacion.mockReturnValue({
      invitacion: null,
      loading: false,
      error: 'No se pudo enviar la invitación',
      getInvitacion: vi.fn(),
      aceptarInvitacion: vi.fn(),
      enviarInvitacion: vi.fn(),
    });

    render(<InviteModal equipoId={99} isOpen={true} onClose={vi.fn()} />);

    expect(
      screen.getByText(/No se pudo enviar la invitación/i),
    ).toBeInTheDocument();
  });

  it('InviteModal bloquea cierre mientras loading es true', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    mockedUseInvitacion.mockReturnValue({
      invitacion: null,
      loading: true,
      error: null,
      getInvitacion: vi.fn(),
      aceptarInvitacion: vi.fn(),
      enviarInvitacion: vi.fn(),
    });

    render(<InviteModal equipoId={99} isOpen={true} onClose={onClose} />);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(cancelButton).toBeDisabled();
    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('TablaPartidos', () => {
  it('muestra estado vacío cuando no hay partidos', () => {
    render(
      <TablaPartidos
        partidosPorFecha={{}}
        tabKey=""
        setTabKey={vi.fn()}
        torneo={torneoBase}
        isCreator={false}
        setPartidoSeleccionado={vi.fn()}
        setResultadoLocal={vi.fn()}
        setResultadoVisitante={vi.fn()}
        setResultadoModal={vi.fn()}
        handleDeletePartido={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/No hay partidos programados aún/i),
    ).toBeInTheDocument();
  });

  it('abre modal de resultado al hacer click en Resultado', async () => {
    const user = userEvent.setup();
    const setPartidoSeleccionado = vi.fn();
    const setResultadoLocal = vi.fn();
    const setResultadoVisitante = vi.fn();
    const setResultadoModal = vi.fn();

    const partido = {
      id: 1,
      fecha: new Date('2026-03-12'),
      hora: '18:00',
      establecimiento: { nombre: 'Cancha 1' },
      equipoLocal: { nombre: 'Leones' },
      equipoVisitante: { nombre: 'Tigres' },
      resultadoLocal: null,
      resultadoVisitante: null,
    } as unknown as Partido;

    render(
      <TablaPartidos
        partidosPorFecha={{ '2026-03-12': [partido] }}
        tabKey="2026-03-12"
        setTabKey={vi.fn()}
        torneo={torneoBase}
        isCreator={true}
        setPartidoSeleccionado={setPartidoSeleccionado}
        setResultadoLocal={setResultadoLocal}
        setResultadoVisitante={setResultadoVisitante}
        setResultadoModal={setResultadoModal}
        handleDeletePartido={vi.fn()}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: /resultado/i })[0]);

    expect(setPartidoSeleccionado).toHaveBeenCalledWith(partido);
    expect(setResultadoLocal).toHaveBeenCalledWith('');
    expect(setResultadoVisitante).toHaveBeenCalledWith('');
    expect(setResultadoModal).toHaveBeenCalledWith(true);
  });

  it('si no es creador no muestra botones de gestión', () => {
    const partido = {
      id: 2,
      fecha: new Date('2026-03-13'),
      hora: '20:00',
      establecimiento: { nombre: 'Cancha 2' },
      equipoLocal: { nombre: 'Pumas' },
      equipoVisitante: { nombre: 'Lobos' },
      resultadoLocal: 1,
      resultadoVisitante: 1,
    } as unknown as Partido;

    render(
      <TablaPartidos
        partidosPorFecha={{ '2026-03-13': [partido] }}
        tabKey="2026-03-13"
        setTabKey={vi.fn()}
        torneo={torneoBase}
        isCreator={false}
        setPartidoSeleccionado={vi.fn()}
        setResultadoLocal={vi.fn()}
        setResultadoVisitante={vi.fn()}
        setResultadoModal={vi.fn()}
        handleDeletePartido={vi.fn()}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /resultado/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /eliminar/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /ver partido/i }).length,
    ).toBeGreaterThan(0);
  });
});

describe('TablaEquipos', () => {
  it('muestra estado vacío cuando no hay equipos', () => {
    render(
      <TablaEquipos
        torneo={{ ...torneoBase, equipos: [] }}
        isMember={() => false}
        userIsMember={() => false}
        isCaptain={() => false}
        setSelectedTeam={vi.fn()}
        setEnrollPassword={vi.fn()}
        setEnrollError={vi.fn()}
        setShowEnrollModal={vi.fn()}
        handleDeleteTeam={vi.fn()}
        setAbandono={vi.fn()}
      />,
    );

    expect(
      screen.getAllByText(/No hay equipos inscritos aún/i).length,
    ).toBeGreaterThan(0);
  });

  it('permite unirse cuando no es miembro', async () => {
    const user = userEvent.setup();
    const setSelectedTeam = vi.fn();
    const setEnrollPassword = vi.fn();
    const setEnrollError = vi.fn();
    const setShowEnrollModal = vi.fn();

    const equipo = {
      id: 7,
      nombre: 'Águilas',
      esPublico: true,
      miembros: [],
    } as unknown as Equipo;

    render(
      <TablaEquipos
        torneo={{ ...torneoBase, equipos: [equipo] }}
        isMember={() => false}
        userIsMember={() => false}
        isCaptain={() => false}
        setSelectedTeam={setSelectedTeam}
        setEnrollPassword={setEnrollPassword}
        setEnrollError={setEnrollError}
        setShowEnrollModal={setShowEnrollModal}
        handleDeleteTeam={vi.fn()}
        setAbandono={vi.fn()}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: /unirse/i })[0]);

    expect(setSelectedTeam).toHaveBeenCalledWith(equipo);
    expect(setEnrollPassword).toHaveBeenCalledWith('');
    expect(setEnrollError).toHaveBeenCalledWith(null);
    expect(setShowEnrollModal).toHaveBeenCalledWith(true);
  });

  it('si es capitán puede eliminar equipo', async () => {
    const user = userEvent.setup();
    const handleDeleteTeam = vi.fn();
    const equipo = {
      id: 8,
      nombre: 'Cóndores',
      esPublico: true,
      miembros: [],
    } as unknown as Equipo;

    render(
      <TablaEquipos
        torneo={{ ...torneoBase, equipos: [equipo] }}
        isMember={() => false}
        userIsMember={() => true}
        isCaptain={() => true}
        setSelectedTeam={vi.fn()}
        setEnrollPassword={vi.fn()}
        setEnrollError={vi.fn()}
        setShowEnrollModal={vi.fn()}
        handleDeleteTeam={handleDeleteTeam}
        setAbandono={vi.fn()}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: /eliminar/i })[0]);

    expect(handleDeleteTeam).toHaveBeenCalledWith(8);
  });

  it('si es miembro (no capitán) puede abandonar equipo', async () => {
    const user = userEvent.setup();
    const setSelectedTeam = vi.fn();
    const setAbandono = vi.fn();
    const equipo = {
      id: 9,
      nombre: 'Halcones',
      esPublico: true,
      miembros: [],
    } as unknown as Equipo;

    render(
      <TablaEquipos
        torneo={{ ...torneoBase, equipos: [equipo] }}
        isMember={() => true}
        userIsMember={() => true}
        isCaptain={() => false}
        setSelectedTeam={setSelectedTeam}
        setEnrollPassword={vi.fn()}
        setEnrollError={vi.fn()}
        setShowEnrollModal={vi.fn()}
        handleDeleteTeam={vi.fn()}
        setAbandono={setAbandono}
      />,
    );

    await user.click(screen.getAllByRole('button', { name: /abandonar/i })[0]);

    expect(setSelectedTeam).toHaveBeenCalledWith(equipo);
    expect(setAbandono).toHaveBeenCalledWith(true);
  });

  it('deshabilita Unirse cuando inscripción está cerrada', () => {
    mockedEstaAbiertoPeriodo.mockReturnValue(false);
    const equipo = {
      id: 10,
      nombre: 'Búhos',
      esPublico: true,
      miembros: [],
    } as unknown as Equipo;

    render(
      <TablaEquipos
        torneo={{ ...torneoBase, equipos: [equipo] }}
        isMember={() => false}
        userIsMember={() => false}
        isCaptain={() => false}
        setSelectedTeam={vi.fn()}
        setEnrollPassword={vi.fn()}
        setEnrollError={vi.fn()}
        setShowEnrollModal={vi.fn()}
        handleDeleteTeam={vi.fn()}
        setAbandono={vi.fn()}
      />,
    );

    const botonesUnirse = screen.getAllByRole('button', { name: /unirse/i });
    expect(botonesUnirse[0]).toBeDisabled();
  });
});
