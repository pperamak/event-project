import { render, screen } from '@testing-library/react';
//import { test, expect } from 'vitest'
import { MockedProvider } from '@apollo/client/testing';
import App from './App';

test('renders headline', () => {
  render(
  <MockedProvider mocks={[]} addTypename={false}>
    <App />
  </MockedProvider>
  );
  expect(screen.getByText(/Something/i)).toBeInTheDocument();
});

