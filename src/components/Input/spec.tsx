import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('shows an error message if the input has an error', () => {
    render(<Input label="Test" error="There has been an error" onChange={() => {}} />);
    expect(screen.getByText('There has been an error')).toBeInTheDocument();
  });
});
