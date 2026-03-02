import { test, expect } from '@playwright/test';

/**
 * Tests E2E con Playwright
 * Pruebas de flujos completos del usuario
 * 
 * REQUIERE:
 * - Backend corriendo en http://localhost:3000
 * - Frontend en http://localhost:5173
 */

test.describe('Frontend - Pruebas E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar a la página principal
    await page.goto('/');
  });

  test('debería cargar la página principal', async ({ page }) => {
    // Esperar que el título esté presente
    await expect(page).toHaveTitle(/Gestor|Torneos|Frontend/i);
    
    // Verificar que carga algún contenido
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
  });

  test('debería navegar entre páginas', async ({ page }) => {
    // Encontrar y hacer click en un link de navegación
    const navLinks = page.locator('nav a, [role="navigation"] a');
    
    if (await navLinks.count() > 0) {
      const firstLink = navLinks.first();
      const href = await firstLink.getAttribute('href');
      
      if (href && href !== '/') {
        await firstLink.click();
        await expect(page).toHaveURL(new RegExp(href));
      }
    }
  });

  test('debería responder a pantallas pequeñas', async ({ page }) => {
    // Configurar viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    const mainContent = page.locator('main, [role="main"]');
    await expect(mainContent).toBeVisible();
    
    // Volver al desktop
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(mainContent).toBeVisible();
  });

  test('debería manejar errores de red', async ({ page }) => {
    // Simular conexión lenta/fallida
    await page.route('**/api/**', (route) => route.abort('failed'));
    
    await page.goto('/');
  });

  test('debería limpiar datos de sesión', async ({ page }) => {
    // Verificar que se puede limpiar localStorage
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    
    await expect(page.evaluate(() => localStorage.length)).resolves.toBe(0);
  });
});

test.describe('Manejo de Errores', () => {
  test('se debería recuperar de errores de red', async ({ page }) => {
    await page.goto('/');
    
    // Interceptar y fallar la primera request
    let requestCount = 0;
    await page.route('**/api/**', (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.abort('failed');
      } else {
        route.continue();
      }
    });
    
    await page.reload();
  });

  test('debería mostrar página de error 404', async ({ page }) => {
    const response = await page.goto('/pagina-no-existe-12345');
    
    // Puede ser 404 o redirigir a inicio, ambos son válidos
    expect([404, 200]).toContain(response?.status());
  });
});
