import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Controls from '../components/Controls';
import { renderWithProvider, createApiMock, mockApiClient, resetApiMock } from './test_utils';

beforeEach(() => {
  resetApiMock();
});

test('updates input fields and triggers start/stop', async () => {
  const apiMock = createApiMock();
  mockApiClient(apiMock);

  renderWithProvider(<Controls />);

  const project = screen.getByPlaceholderText(/Project folder or name/i);
  const email = screen.getByPlaceholderText(/user@example.com/i);
  const loop = screen.getByLabelText(/Loop/i);

  fireEvent.change(project, { target: { value: 'proj-1' } });
  fireEvent.change(email, { target: { value: 'u@e.co' } });
  fireEvent.change(loop, { target: { value: '3' } });

  const startBtn = screen.getByRole('button', { name: /Start run/i });
  fireEvent.click(startBtn);

  await waitFor(() => expect(apiMock.run).toHaveBeenCalledTimes(1));
  // After start, stop button should become enabled by state change
  const stopBtn = screen.getByRole('button', { name: /Stop run/i });
  // It may still be disabled until state propagates; invoke stop to ensure call path
  fireEvent.click(stopBtn);
  await waitFor(() => expect(apiMock.stop).toHaveBeenCalledTimes(1));
});
