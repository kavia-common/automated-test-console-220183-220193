import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header title and tabs', () => {
  render(<App />);
  expect(screen.getByText(/Robot Test Console/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Logs/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Batch Log/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Fail Log/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Config/i })).toBeInTheDocument();
});
