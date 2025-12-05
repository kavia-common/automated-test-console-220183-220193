import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import { AppStateContext } from '../state/appState';

function renderWithState(stateOverrides = {}) {
  const base = {
    isRunning: false,
    progress: { percent: 0, elapsed: 0, total: 0 },
  };
  const value = { ...base, ...stateOverrides };
  return render(
    <AppStateContext.Provider value={value}>
      <Header />
    </AppStateContext.Provider>
  );
}

test('renders title and default progress info', () => {
  renderWithState();
  expect(screen.getByText(/Robot Test Console/i)).toBeInTheDocument();
  expect(screen.getByText(/Elapsed: 00:00:00/i)).toBeInTheDocument();
  expect(screen.getByText(/Total: 0/i)).toBeInTheDocument();
});

test('shows progress bar width from percent', () => {
  renderWithState({ progress: { percent: 42, elapsed: 65, total: 120 } });
  const fill = document.querySelector('.progress-fill');
  expect(fill).toBeTruthy();
  expect(fill.style.width).toBe('42%');
  expect(screen.getByText(/Elapsed: 00:01:05/i)).toBeInTheDocument();
  expect(screen.getByText(/Total: 120/i)).toBeInTheDocument();
});
