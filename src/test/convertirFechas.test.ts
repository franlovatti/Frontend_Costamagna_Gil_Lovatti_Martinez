import { describe, it, expect } from 'vitest';
import { parseDatetimeLocal, toDatetimeLocal, parseFecha, estaAbiertoPeriodo } from '../helpers/convertirFechas';

describe('Conversión de Fechas', () => {
  describe('parseDatetimeLocal', () => {
    it('debería parsear fecha válida', () => {
      const result = parseDatetimeLocal('2024-03-15T10:30');
      expect(result).toBeInstanceOf(Date);
      expect(result?.getFullYear()).toBe(2024);
    });

    it('debería retornar null si es inválida', () => {
      expect(parseDatetimeLocal('invalid')).toBeNull();
      expect(parseDatetimeLocal(null)).toBeNull();
      expect(parseDatetimeLocal(undefined)).toBeNull();
    });
  });

  describe('toDatetimeLocal', () => {
    it('debería formatear Date a string datetime-local', () => {
      const date = new Date('2024-03-15T10:30:00');
      const result = toDatetimeLocal(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('debería retornar string vacío si es null/undefined', () => {
      expect(toDatetimeLocal(null)).toBe('');
      expect(toDatetimeLocal(undefined)).toBe('');
    });

    it('debería manejar strings ISO', () => {
      const result = toDatetimeLocal('2024-03-15T10:30:00.000Z');
      expect(result).toBeTruthy();
    });
  });

  describe('parseFecha', () => {
    it('debería retornar Date si recibe Date', () => {
      const date = new Date();
      expect(parseFecha(date)).toBe(date);
    });

    it('debería parsear string ISO', () => {
      const result = parseFecha('2024-03-15T10:30:00.000Z');
      expect(result).toBeInstanceOf(Date);
    });

    it('debería manejar null/undefined', () => {
      expect(parseFecha(null)).toBeNull();
      expect(parseFecha(undefined)).toBeNull();
    });
  });
});

describe('Verificación de Periodo Abierto', () => {
  it('debería verificar si un periodo está abierto', () => {
    const fechaInicio = new Date('2026-01-15T10:30:00.000Z');
    const fechaFin = new Date('2026-04-15T12:30:00.000Z');

    expect(estaAbiertoPeriodo(fechaInicio, fechaFin )).toBe(true);
  });

  it('debería verificar si un periodo está cerrado', () => {
    const fechaInicio = new Date('2024-03-15T10:30:00.000Z');
    const fechaFin = new Date('2024-03-15T12:30:00.000Z');

    expect(estaAbiertoPeriodo(fechaInicio, fechaFin )).toBe(false);
  });
});