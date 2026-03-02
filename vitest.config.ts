import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Entorno para testing
    environment: 'jsdom',
    
    // Archivo de setup
    setupFiles: ['./src/test/setup.ts'],
    
    // Cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/index.ts',
        'src/main.tsx',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
    
    // UI para visualizar tests
    ui: true,
    
    // Globales (no necesitas importar describe, it, expect)
    globals: true,
    
    // Timeout para tests
    testTimeout: 10000,
    
    // Reporters
    reporters: ['verbose'],
    
    // Include patterns
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
