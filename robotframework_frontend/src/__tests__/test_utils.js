/**
 * Shared test utilities: API client mock, EventSource hook mock helpers.
 * Refactored to avoid out-of-scope variables in jest.mock factories by using
 * a manual mock at src/api/__mocks__/client.js and providing per-test helpers.
 *
 * Note:
 * - We always import the manual mock for ../api/client via jest.mock.
 * - For useEventSource, we define jest.mock with its own factory-local state
 *   inside the helper, ensuring no references to outer variables persist
 *   across tests. Each call to mockUseEventSource re-registers the module mock
 *   with a new factory so values are captured safely within that scope.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { AppStateProvider } from '../state/appState';

// Always mock the api client module using the manual mock file.
// This picks up src/api/__mocks__/client.js automatically.
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
  if (apiMockOrOverrides && typeof apiMockOrOverrides.root === 'function') {
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

/**
 * Mock the useEventSource hook.
 * Ensures there is no out-of-scope variable usage by capturing values inside the mock factory.
 * Call this within each test that requires specific SSE messages.
 */
export function mockUseEventSource({ messages = [], status = 'open' } = {}) {
  // Prepare a local copy for the factory to close over
  const localMessages = Array.isArray(messages) ? [...messages] : [];
  const localStatus = status;

  jest.doMock('../hooks/useEventSource', () => {
    return {
      useEventSource: () => {
        const mapped = localMessages.map((m, idx) => ({ id: `m-${idx}`, data: m }));
        return {
          messages: mapped,
          lastEventId: mapped.length ? mapped[mapped.length - 1].id : null,
          status: localStatus,
        };
      },
    };
  });
}

// PUBLIC_INTERFACE
export function renderWithProvider(ui) {
  /** This is a public function. */
  return render(<AppStateProvider>{ui}</AppStateProvider>);
}
