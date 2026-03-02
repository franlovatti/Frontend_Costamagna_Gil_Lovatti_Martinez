import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Limpiar DOM después de cada test
afterEach(() => {
  cleanup();
});

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de localStorage con almacenamiento real
const localStorageData = new Map<string, string>();

const localStorageMock = {
  getItem: (key: string) => localStorageData.get(key) ?? null,
  setItem: (key: string, value: string) => localStorageData.set(key, value),
  removeItem: (key: string) => localStorageData.delete(key),
  clear: () => localStorageData.clear(),
  key: (index: number) => {
    const keys = Array.from(localStorageData.keys());
    return keys[index] ?? null;
  },
  get length() {
    return localStorageData.size;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock de fetch para tests unitarios (los E2E usan requests reales)
global.fetch = vi.fn();

