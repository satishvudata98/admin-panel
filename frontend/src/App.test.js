import { render, screen } from '@testing-library/react';
import App from './App';

test('renders registration component', () => {
  render(<App />);
  const registrationElement = screen.getByText(/User Registration/i);
  expect(registrationElement).toBeInTheDocument();
});

