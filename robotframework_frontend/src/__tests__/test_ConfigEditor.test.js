import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ConfigEditor from '../components/ConfigEditor';
import { createApiMock, mockApiClient, resetApiMock } from './test_utils';

beforeEach(() => {
  resetApiMock();
});

test('loads config on mount and saves JSON successfully', async () => {
  const apiMock = createApiMock({
    getConfig: jest.fn().mockResolvedValue({ foo: 'bar' }),
    saveConfig: jest.fn().mockResolvedValue({ ok: true }),
  });
  mockApiClient(apiMock);

  render(<ConfigEditor />);

  const textarea = await screen.findByLabelText(/Configuration editor/i);
  expect(textarea.value).toMatch(/"foo": "bar"/);

  fireEvent.change(textarea, { target: { value: '{"alpha":123}' } });
  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => expect(apiMock.saveConfig).toHaveBeenCalledWith({ alpha: 123 }));
  await waitFor(() => expect(screen.getByText(/Saved/i)).toBeInTheDocument());
});

test('saves raw text when content is not valid JSON', async () => {
  const apiMock = createApiMock({
    getConfig: jest.fn().mockResolvedValue({}),
    saveConfig: jest.fn().mockResolvedValue({ ok: true }),
  });
  mockApiClient(apiMock);

  render(<ConfigEditor />);
  const textarea = await screen.findByLabelText(/Configuration editor/i);

  fireEvent.change(textarea, { target: { value: 'not json' } });
  fireEvent.click(screen.getByText(/Save/i));

  await waitFor(() => expect(apiMock.saveConfig).toHaveBeenCalledWith({ raw: 'not json' }));
});

test('shows error when save fails', async () => {
  const apiMock = createApiMock({
    getConfig: jest.fn().mockResolvedValue({ x: 1 }),
    saveConfig: jest.fn().mockRejectedValue(new Error('boom')),
  });
  mockApiClient(apiMock);

  render(<ConfigEditor />);
  const textarea = await screen.findByLabelText(/Configuration editor/i);

  fireEvent.change(textarea, { target: { value: '{"z":2}' } });
  fireEvent.click(screen.getByText(/Save/i));

  expect(await screen.findByText(/boom/i)).toBeInTheDocument();
});
