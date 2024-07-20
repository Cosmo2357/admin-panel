import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import LoginFormCard from '@/components/LoginFormCard';
import { Toaster } from '@/components/ui/toaster';

vi.mock('@/stores/mainStore', () => ({
  __esModule: true,
  default: () => ({
    login: vi.fn(),
  }),
}));

describe('LoginFormCard', () => {
  beforeEach(() => {
    render(
      <React.StrictMode>
        <BrowserRouter>
          <LoginFormCard />
          <Toaster />
        </BrowserRouter>
      </React.StrictMode>
    );
  });

  test('renders LoginFormCard', () => {
    const emailInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(screen.getAllByText(/login/i)).toHaveLength(2);
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  test('displays validation errors for empty form submission', async () => {
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test('displays validation errors for invalid email and short password', async () => {
    const emailInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Password must be at least 6 characters long/i)
      ).toBeInTheDocument();
    });
  });

  test('logs in successfully with valid email and password', async () => {
    const emailInput = screen.getByPlaceholderText('me@example.com');
    const passwordInput = screen.getByPlaceholderText('password');
    const loginButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(
      () => {
        expect(
          screen.getByText(/You have successfully logged in./i)
        ).toBeInTheDocument();
      },
      {
        timeout: 3000,
      }
    );
  });
});
