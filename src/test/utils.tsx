/**
 * Utilidades para testing
 * Re-export de testing library + helpers adicionales
 */

import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import {
  screen,
  fireEvent,
  waitFor,
  within,
  getByRole,
  queryByRole,
  getAllByRole,
} from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

/**
 * Render con providers (Router, etc)
 * Uso: renderWithRouter(<Component />)
 */
export function renderWithRouter(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <BrowserRouter>{children}</BrowserRouter>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Re-export específicos de testing-library
export {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  getByRole,
  queryByRole,
  getAllByRole,
};
export { default as userEvent } from '@testing-library/user-event';
