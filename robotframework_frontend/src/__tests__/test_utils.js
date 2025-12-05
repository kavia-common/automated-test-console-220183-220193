/**
 * Shared test utilities: API client mock, EventSource hook mock helpers.
 * Refactored to avoid out-of-scope variables in jest.mock factories by using
 * a manual mock at src/api/__mocks__/client.js and providing per-test helpers.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { AppStateProvider } from '../state/appState';

// Always mock the api client module using the manual mock file
jest.mock('../api/client');

// Pull helpers from the manual mock for configuring the api stub in test scope
const { __helpers } = jest.requireMock('../api/client');

// PUBLIC_INTERFACE
export function createApiMock(overrides = {}) {
  /** This is a public function. */
  return __helpers.createApiMock(overrides);
}

// PUBLIC_INTERFACE
export function mockApiClient(apiMockOrOverrides = {}) {
  /** This is a public function. */
  if (typeof apiMockOrOverrides === 'object' && typeof apiMockOrOverrides.root === 'function') {
    // api object passed: copy methods onto the default mock
    __helpers.setApiMock(apiMockOrOverrides);
  } else {
    // overrides passed: construct a new mock and set it
    __helpers.setApiMock(apiMockOrOverrides);
  }
  return true;
}

// PUBLIC_INTERFACE
export function resetApiMock() {
  /** This is a public function. */
  __helpers.resetApiMock();
}

// Mock the useEventSource hook with provided messages / status.
// Using factory-local closure values is safe here because this mock is created
// within each test file's scope (and not shared across unrelated tests).
export function mockUseEventSource({ messages = [], status = 'open' } = {}) {
  jest.mock('../hooks/useEventSource', () => ({
    useEventSource: () => ({
      messages: messages.map((m, idx) => ({ id: `m-${idx}`, data: m })),
      lastEventId: messages.length ? `m-${messages.length - 1}` : null,
      status,
    }),
  }));
}

// PUBLIC_INTERFACE
export function renderWithProvider(ui) {
  /** This is a public function. */
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}
