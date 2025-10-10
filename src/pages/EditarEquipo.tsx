import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import apiAxios from '../helpers/api';
import { useAuth } from '../hooks/useAuth';

import type { Equipo, Usuario } from '../types';
import {
  Form,
  InputGroup,
  Button as RBButton,
  Table,
  Row,
  Spinner,
  Alert,
} from 'react-bootstrap';

export default function EditarEquipo() {
  const { id } = useParams() as { id?: string };
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchEquipo = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await apiAxios.get(`/equipos/${id}`);
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setEquipo(payload as Equipo);
    } catch (err) {
      console.error('Error fetching equipo:', err);
      setError('Error al cargar el equipo.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEquipo();
  }, [fetchEquipo]);

  useEffect(() => {
    if (equipo) {
      setNameInput(equipo.nombre ?? '');
      setPasswordInput('');
    }
  }, [equipo]);

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
  const capId = equipo ? normalizeId(equipo.capitan as unknown) : undefined;
  const isCaptain = userIdStr ? capId === userIdStr : false;

  async function handleRemoveMember(memberId: string | number) {
    if (!id) return;
    if (!confirm('¿Eliminar este miembro del equipo?')) return;
    try {
      const usuarioId = Number(memberId);
      const res = await apiAxios.patch(`/equipos/${id}/miembros`, {
        usuarioId,
      });
      const payload = res.data && res.data.data ? res.data.data : res.data;
      setEquipo(payload as Equipo);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ??
          (err as Error).message ??
          'Error al eliminar miembro.'
      );
    }
  }

  async function handleSaveAll(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      const payload: Record<string, unknown> = { nombre: nameInput };
      if (passwordInput && passwordInput.length > 0)
        payload['contraseña'] = passwordInput;
      const res = await apiAxios.patch(`/equipos/${id}`, payload);

      setEquipo(res.data.data);
      setPasswordInput('');
      navigate(`/home/equipos/${id}`);
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        errorObj?.response?.data?.message ??
          (err as Error).message ??
          'Error al guardar cambios.'
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="p-3">
        {' '}
        <Spinner animation="border" /> Cargando...
      </div>
    );
  if (error)
    return (
      <div className="p-3">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  if (!equipo)
    return (
      <div className="p-3">
        <Alert variant="warning">Equipo no encontrado.</Alert>
      </div>
    );

  return (
    <div className="container text-bg-dark p-3">
      <Row>
        <h2>{equipo.nombre}</h2>
      </Row>

      <Row>
        <p>Capitán: {equipo.nombreCapitan}</p>
      </Row>

      <Row>
        <p>Puntos: {equipo.puntos}</p>
      </Row>

      {isCaptain ? (
        <>
          <Form onSubmit={handleSaveAll} className="mb-3">
            <Form.Group className="mb-2" controlId="equipoNombre">
              <Form.Label>Nombre del equipo</Form.Label>
              <Form.Control
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
              />
            </Form.Group>
            {equipo.esPublico ? null : (
              <Form.Group className="mb-2" controlId="equipoPassword">
                <Form.Label>Nueva contraseña (opcional)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Dejar vacío para no cambiar"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: 'pointer' }}
                    onClick={() => setShowPassword((s) => !s)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            )}
          </Form>
        </>
      ) : null}

      <Row className="mb-3">
        <h5>Miembros</h5>
      </Row>

      {Array.isArray(equipo.miembros) && equipo.miembros.length > 0 ? (
        <Table striped variant="dark">
          <thead>
            <tr>
              <th>#</th>
              <th>Miembro</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(equipo.miembros as Usuario[]).map((miembro, idx) => {
              const memberId = miembro.id ?? miembro.usuario ?? '';
              const memberIdStr = String(memberId);
              const capIdLocal = normalizeId(equipo.capitan as unknown);
              const isMemberCaptain = capIdLocal === memberIdStr;
              return (
                <tr key={memberIdStr}>
                  <td>{idx + 1}</td>
                  <td>
                    {miembro.nombre ?? miembro.usuario ?? memberIdStr}
                    {isMemberCaptain ? ' (Capitán)' : ''}
                  </td>
                  <td>
                    {isCaptain && !isMemberCaptain ? (
                      <RBButton
                        size="sm"
                        variant="danger"
                        onClick={() => handleRemoveMember(memberId)}
                      >
                        Eliminar
                      </RBButton>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <div className="alert alert-secondary">No hay miembros listados.</div>
      )}
      <div className="d-flex justify-content-between">
        <RBButton className="danger" onClick={() => navigate(-1)}>
          Volver
        </RBButton>

        <RBButton
          className="success"
          onClick={() => handleSaveAll()}
          disabled={saving}
        >
          {saving ? (
            <>
              <Spinner animation="border" size="sm" /> Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </RBButton>
      </div>
    </div>
  );
}
