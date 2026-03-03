import { test, expect } from '@playwright/test';

test.describe('Integración Front + Back', () => {
  test('carga la home y obtiene torneos desde el backend', async ({ page }) => {
    const responsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'GET' &&
        response.url().includes('http://localhost:3000/api/eventos')
      );
    });

    await page.goto('/');

    const apiResponse = await responsePromise;
    expect(apiResponse.ok()).toBeTruthy();

    const body = await apiResponse.json();
    expect(body).toHaveProperty('data');
    expect(Array.isArray(body.data)).toBe(true);

    const mainContent = page
      .locator('main, [role="main"], .main-home-container')
      .first();
    await expect(mainContent).toBeVisible();

    const errorAlert = page.locator('[role="alert"], .alert-danger-custom');
    await expect(errorAlert).toHaveCount(0);
  });

  test('login real contra backend y acceso a ruta protegida', async ({
    page,
    request,
  }) => {
    const unique = Date.now();
    const usuario = `e2e_user_${unique}`;
    const contrasenia = 'E2e123456!';
    const email = `e2e_${unique}@test.com`;

    const registerResponse = await request.post(
      'http://localhost:3000/api/usuarios',
      {
        data: {
          nombre: 'E2E',
          apellido: 'Tester',
          usuario,
          contrasenia,
          email,
          estado: true,
          participations: [],
        },
      },
    );

    expect(registerResponse.ok()).toBeTruthy();

    await page.goto('/login');
    await page
      .locator('input[placeholder*="Usuario"], input[type="text"]')
      .first()
      .fill(usuario);
    await page.locator('input[type="password"]').fill(contrasenia);

    const loginResponsePromise = page.waitForResponse((response) => {
      return (
        response.request().method() === 'POST' &&
        response.url().includes('http://localhost:3000/api/usuarios/login')
      );
    });

    await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    const loginResponse = await loginResponsePromise;
    expect(loginResponse.ok()).toBeTruthy();

    await page.waitForURL(/\/home(?:\/.*)?$/i);

    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();

    await page.goto('/home/noticias');
    await expect(page).toHaveURL(/\/home\/noticias/i);

    const protectedContent = page
      .locator('main, [role="main"], .noticias-page-container')
      .first();
    await expect(protectedContent).toBeVisible();
  });
});
