/**
 * Shared test utilities: API client mock, EventSource hook mock helpers.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { AppStateProvider } from '../state/appState';

// Default API mock responses
export function createApiMock(overrides = {}) {
  return {
    root: jest.fn().mockResolvedValue('ok'),
    run: jest.fn().mockResolvedValue({ status: 'started' }),
    stop: jest.fn().mockResolvedValue({ status: 'stopped' }),
    logs: jest.fn().mockResolvedValue(''),
    stats: jest.fn().mockResolvedValue({ passed: 0, failed: 0, skipped: 0, total: 0 }),
    caseStatus: jest.fn().mockResolvedValue({ cases: [] }),
    progress: jest.fn().mockResolvedValue({ percent: 0, elapsed: 0, total: 0 }),
    currentCaseInfo: jest.fn().mockResolvedValue(null),
    getConfig: jest.fn().mockResolvedValue({ a: 1 }),
    saveConfig: jest.fn().mockResolvedValue({ ok: true }),
    listConfigFolders: jest.fn().mockResolvedValue([]),
    uiLock: jest.fn().mockResolvedValue({}),
    syncState: jest.fn().mockResolvedValue({}),
    getState: jest.fn().mockResolvedValue({}),
    batchLog: jest.fn().mockResolvedValue('B1\nB2'),
    failLog: jest.fn().mockResolvedValue('F1\nF2'),
    expectedTotal: jest.fn().mockResolvedValue(0),
    ...overrides,
  };
}

export function mockApiClient(apiMock) {
  jest.mock('../api/client', () => {
    const original = jest.requireActual('../api/client');
    return { ...original, api: apiMock, API_BASE: '' };
  });
}

// Mock the useEventSource hook with provided messages / status
export function mockUseEventSource({ messages = [], status = 'open' } = {}) {
  jest.mock('../hooks/useEventSource', () => ({
    useEventSource: () => ({
      messages: messages.map((m, idx) => ({ id: `m-${idx}`, data: m })),
      lastEventId: messages.length ? `m-${messages.length - 1}` : null,
      status,
    }),
  }));
}

export function renderWithProvider(ui) {
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}
