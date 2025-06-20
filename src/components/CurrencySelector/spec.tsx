import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencySelector } from './CurrencySelector';
import { Currencies } from '../../types';

describe('CurrencySelector', () => {
  const mockOnChange = jest.fn();
  const label = 'Currency';

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('displays "Select a currency" option when value is empty string', () => {
    render(<CurrencySelector label={label} value={'' as any} onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox');
    const placeholderOption = screen.getByText('Select a currency');

    expect(selectElement).toBeInTheDocument();
    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toHaveValue('');
  });

  it('displays "Select a currency" option when value is undefined', () => {
    render(<CurrencySelector label={label} value={undefined as any} onChange={mockOnChange} />);

    const placeholderOption = screen.getByText('Select a currency');
    expect(placeholderOption).toBeInTheDocument();
  });

  it('does not display "Select a currency" option when value is set', () => {
    render(<CurrencySelector label={label} value="USD" onChange={mockOnChange} />);

    const placeholderOption = screen.queryByText('Select a currency');
    expect(placeholderOption).not.toBeInTheDocument();
  });

  it('renders all currency options', () => {
    render(<CurrencySelector label={label} value={'' as any} onChange={mockOnChange} />);

    Object.keys(Currencies).forEach((currencyCode) => {
      const option = screen.getByText(currencyCode);
      expect(option).toBeInTheDocument();
      expect(option).toHaveValue(currencyCode);
    });
  });

  it('calls onChange with selected currency code', () => {
    render(<CurrencySelector label={label} value={'' as any} onChange={mockOnChange} />);

    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;

    fireEvent.change(selectElement, { target: { value: 'EUR' } });

    expect(mockOnChange).toHaveBeenCalledWith('EUR');
  });
});
