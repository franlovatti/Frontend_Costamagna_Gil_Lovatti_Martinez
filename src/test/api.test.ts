import { describe, it, expect } from 'vitest';
import apiAxios from '../helpers/api';

describe('API Helper', () => {
  it('debería tener la baseURL correcta', () => {
    expect(apiAxios.defaults.baseURL).toBe('http://localhost:3000/api');
  });

  it('debería enviar cookies en las peticiones', () => {
    expect(apiAxios.defaults.withCredentials).toBe(true);
  });

  it('debería agregar token al header si existe', async () => {
    localStorage.setItem('token', 'test-token-123');
    
    // Acceder a los handlers internos usando type assertion
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = { headers: {} } as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const interceptorManager = apiAxios.interceptors.request as any;
    const interceptor = interceptorManager.handlers?.[0];
    
    if (interceptor?.fulfilled) {
      const result = await interceptor.fulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer test-token-123');
    }
  });

});