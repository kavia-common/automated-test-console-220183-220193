import React from 'react';
import { render, screen } from '@testing-library/react';
import LogViewer from '../components/LogViewer';
import { createApiMock, mockApiClient, mockUseEventSource, resetApiMock } from './test_utils';

beforeEach(() => {
  resetApiMock();
});

describe('LogViewer', () => {
  test('renders SSE messages when mode=logs', () => {
    mockUseEventSource({ messages: ['hello', 'world'] });
    // api mock not needed for SSE path
    render(<LogViewer mode="logs" />);
    expect(screen.getByRole('log')).toBeInTheDocument();
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  test('renders batch log via api when mode=batch', async () => {
    const apiMock = createApiMock({ batchLog: jest.fn().mockResolvedValue('B1\nB2\n') });
    mockApiClient(apiMock);
    // prevent SSE from being used in this test
    mockUseEventSource({ messages: [] });

    render(<LogViewer mode="batch" />);

    expect(await screen.findByText('B1')).toBeInTheDocument();
    expect(screen.getByText('B2')).toBeInTheDocument();
  });

  test('renders fail log via api when mode=fail', async () => {
    const apiMock = createApiMock({ failLog: jest.fn().mockResolvedValue('F1\nF2') });
    mockApiClient(apiMock);
    mockUseEventSource({ messages: [] });

    render(<LogViewer mode="fail" />);

    expect(await screen.findByText('F1')).toBeInTheDocument();
    expect(screen.getByText('F2')).toBeInTheDocument();
  });
});
