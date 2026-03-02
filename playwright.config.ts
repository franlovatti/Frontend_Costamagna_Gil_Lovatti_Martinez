import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para testing E2E
 * Más información en: https://playwright.dev/docs/intro
 */
export default defineConfig({
  testDir: './e2e',
  
  // Máximo de tests que pueden ejecutarse en paralelo
  fullyParallel: true,
  
  // Fallar si hay tests sin ejecutar
  forbidOnly: !!process.env.CI,
  
  // Reintentos en CI
  retries: process.env.CI ? 2 : 0,
  
  // Workers en CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['list'],
  ],
  
  // Shared settings para todos los proyectos
  use: {
    // URL base para tests
    baseURL: 'http://localhost:5173',
    
    // Tomar screenshot en fallos
    screenshot: 'only-on-failure',
    
    // Grabar video en fallos
    video: 'retain-on-failure',
    
    // Timeout para acciones
    actionTimeout: 5000,
  },
  
  // Configuración del servidor de desarrollo
  webServer: {
    command: 'pnpm dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  
  // Proyectos: navegadores a probar
  // Descomentar los que necesites. Chromium es el más rápido para desarrollo.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Descomentar para probar en Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // Descomentar para probar en WebKit (Safari)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    
    // Descomentar para probar en mobile
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
  
  // Timeout global
  timeout: 30000,
  
  // Expect timeout
  expect: {
    timeout: 5000,
  },
});
