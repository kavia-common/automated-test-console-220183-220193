import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Sidebar from '../components/Sidebar';
import { createApiMock, mockApiClient, resetApiMock } from './test_utils';

beforeEach(() => {
  resetApiMock();
});

describe('Sidebar', () => {
  test('renders stats and cases from api', async () => {
    const apiMock = createApiMock({
      stats: jest.fn().mockResolvedValue({ passed: 3, failed: 1, skipped: 2, total: 6 }),
      caseStatus: jest.fn().mockResolvedValue({
        cases: [
          { name: 'Case A', status: 'passed' },
          { name: 'Case B', status: 'failed' },
        ],
      }),
    });
    mockApiClient(apiMock);

    render(<Sidebar />);

    await waitFor(() => {
      expect(screen.getByText('Passed')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Failed')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('Skipped')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
    });

    expect(screen.getByText('Case A')).toBeInTheDocument();
    expect(screen.getByText('Case B')).toBeInTheDocument();
  });

  test('handles empty cases gracefully', async () => {
    const apiMock = createApiMock({
      caseStatus: jest.fn().mockResolvedValue({ cases: [] }),
    });
    mockApiClient(apiMock);

    render(<Sidebar />);
    expect(await screen.findByText(/No cases available/i)).toBeInTheDocument();
  });
});
