import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { render } from '@testing-library/react';
import { createApiMock, mockApiClient, mockUseEventSource, resetApiMock } from './test_utils';

beforeEach(() => {
  resetApiMock();
});

test('app flow: start -> logs -> progress update -> stop -> edit/save config', async () => {
  const apiMock = createApiMock({
    progress: jest.fn()
      .mockResolvedValueOnce({ percent: 10, elapsed: 5, total: 100 })
      .mockResolvedValueOnce({ percent: 80, elapsed: 55, total: 100 }),
    currentCaseInfo: jest.fn().mockResolvedValue({ name: 'Case X' }),
    getConfig: jest.fn().mockResolvedValue({ init: true }),
    saveConfig: jest.fn().mockResolvedValue({ ok: true }),
  });
  mockApiClient(apiMock);
  mockUseEventSource({ messages: ['log-1', 'log-2'] });

  render(<App />);

  // Header present
  expect(screen.getByText(/Robot Test Console/i)).toBeInTheDocument();

  // Start run
  const start = screen.getByRole('button', { name: /Start run/i });
  fireEvent.click(start);
  await waitFor(() => expect(apiMock.run).toHaveBeenCalled());

  // Check SSE rendered logs
  expect(screen.getByText('log-1')).toBeInTheDocument();
  expect(screen.getByText('log-2')).toBeInTheDocument();

  // Stop run
  const stop = screen.getByRole('button', { name: /Stop run/i });
  fireEvent.click(stop);
  await waitFor(() => expect(apiMock.stop).toHaveBeenCalled());

  // Switch to Config tab and save
  fireEvent.click(screen.getByRole('button', { name: /Config/i }));
  const textarea = await screen.findByLabelText(/Configuration editor/i);
  expect(textarea.value).toMatch(/init/);

  fireEvent.change(textarea, { target: { value: '{"new":true}' } });
  fireEvent.click(screen.getByText(/Save/i));
  await waitFor(() => expect(apiMock.saveConfig).toHaveBeenCalledWith({ new: true }));
});
