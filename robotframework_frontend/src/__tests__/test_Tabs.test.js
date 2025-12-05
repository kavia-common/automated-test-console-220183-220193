import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import Tabs from '../components/Tabs';
import { renderWithProvider } from './test_utils';

test('renders tabs and switches active tab on click', () => {
  renderWithProvider(<Tabs />);

  const logs = screen.getByRole('button', { name: /Logs/i });
  const batch = screen.getByRole('button', { name: /Batch Log/i });
  const fail = screen.getByRole('button', { name: /Fail Log/i });
  const config = screen.getByRole('button', { name: /Config/i });

  expect(logs).toHaveClass('active');
  fireEvent.click(batch);
  expect(batch).toHaveClass('active');

  fireEvent.click(fail);
  expect(fail).toHaveClass('active');

  fireEvent.click(config);
  expect(config).toHaveClass('active');
});
