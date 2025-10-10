import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import apiAxios from '../helpers/api';
import { useAuth } from '../hooks/useAuth';

import type { Equipo, Usuario } from '../types';
import { Button } from '../components/ButtonField.tsx';

export default function VerEquipo() {
  const { id } = useParams<{ id: string }>();
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchEquipo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiAxios.get(`/equipos/${id}`);
      const payload =
        response.data && response.data.data
          ? response.data.data
          : response.data;
      setEquipo(payload as Equipo);
    } catch (e) {
      console.error('Error fetching equipo:', e);
      setError('Error al cargar el equipo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEquipo();
  }, [fetchEquipo]);

  async function handleLeave() {
    try {
      const usuarioIdToRemove = user?.id;
      const payload = usuarioIdToRemove ? { usuarioId: usuarioIdToRemove } : {};

      const res = await apiAxios.patch(`/equipos/${id}/miembros`, payload);
      // actualizar estado con la respuesta (si devuelves el equipo actualizado)
      setEquipo(res.data.data);
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error?.response?.data?.message ??
          error?.message ??
          'Error al eliminar usuario.'
      );
    }
  }

  async function handleDeleteTeam(equipoId: string | number) {
    if (window.confirm('¿Estás seguro de que quieres eliminar este equipo?')) {
      try {
        await apiAxios.delete(`/equipos/${equipoId}`);
        navigate('/home/torneos'); // o a donde quieras redirigir
      } catch (err) {
        const error = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(
          error?.response?.data?.message ??
            error?.message ??
            'Error al eliminar el equipo.'
        );
      }
    }
  }

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!equipo) return <div>Equipo no encontrado.</div>;

  const normalizeId = (v: unknown): string | undefined => {
    if (v === null || v === undefined) return undefined;
    if (typeof v === 'number' || typeof v === 'string') return String(v);
    if (typeof v === 'object') {
      const obj = v as Record<string, unknown>;
      if (
        'id' in obj &&
        (typeof obj.id === 'number' || typeof obj.id === 'string')
      )
        return String(obj.id);
      if (
        'usuario' in obj &&
        (typeof obj.usuario === 'number' || typeof obj.usuario === 'string')
      )
        return String(obj.usuario);
    }
    return undefined;
  };

  const userIdStr = user ? String(user.id) : undefined;
  const capId = normalizeId(equipo.capitan as unknown);
  const isMember =
    Array.isArray(equipo.miembros) &&
    equipo.miembros.some((m) => normalizeId(m as unknown) === userIdStr);
  const isCaptain = userIdStr ? capId === userIdStr : false;
  const canLeave = isMember && !isCaptain;

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8">
          <div className="card bg-dark text-white shadow">
            <div className="card-body">
              <h2 className="card-title">{equipo.nombre}</h2>
              <p className="card-subtitle mb-2 text-muted">
                Capitán: {equipo.nombreCapitan}
              </p>
              <p className="mb-3">Puntos: {equipo.puntos}</p>

              <h5>Miembros</h5>
              {Array.isArray(equipo.miembros) && equipo.miembros.length > 0 ? (
                <ul className="list-group list-group-flush mb-3">
                  {(equipo.miembros as Usuario[]).map((miembro) => (
                    <li
                      key={miembro.id}
                      className="list-group-item bg-dark text-white border-primary"
                    >
                      {miembro.nombre ?? miembro.usuario ?? miembro.id}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="alert alert-secondary">
                  No hay miembros listados.
                </div>
              )}

              <div className="d-flex gap-2 justify-content-end">
                <Button
                  className="btn-outline-light"
                  onClick={() => navigate(-1)}
                >
                  Volver
                </Button>

                {user && canLeave && (
                  <Button
                    className="btn-outline-danger"
                    onClick={() => handleLeave()}
                  >
                    Darse de baja
                  </Button>
                )}

                {isCaptain && (
                  <>
                    <Button
                      className="btn-outline-light"
                      onClick={() =>
                        navigate(`/home/equipos/${equipo.id}/editar`)
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      className="btn-danger"
                      onClick={() => handleDeleteTeam(equipo.id)}
                    >
                      Eliminar
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
