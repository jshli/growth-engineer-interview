import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import App from './';
import { ConvertResponse } from '../types';

describe('<App />', () => {
  beforeEach(() => {
    process.env.REACT_APP_API_URL = 'http://localhost:3001';
  });

  it('renders correctly', () => {
    render(<App />);

    const logo = screen.getByTitle('Cleo');
    const subHeading = screen.getByText('Currency Converter');
    const inputs = screen.getAllByRole('textbox');
    const currencySelects = screen.getAllByRole('combobox');
    const convertButton = screen.getByText('Convert');

    expect(logo).toBeInTheDocument();
    expect(subHeading).toBeInTheDocument();
    expect(inputs).toHaveLength(1);
    // not sure how useful these tests are
    expect(currencySelects).toHaveLength(2);
    expect(convertButton).toBeInTheDocument();
  });

  it('sends a correct API request with correct currencies and amount', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve<ConvertResponse>({
          from: 'AUD',
          to: 'USD',
          amount: 100,
          convertedAmount: 200,
        }),
    });
    render(<App />);
    await userEvent.type(screen.getByLabelText('Amount'), '100');
    await userEvent.selectOptions(screen.getByLabelText('From Currency'), 'USD');
    await userEvent.selectOptions(screen.getByLabelText('To Currency'), 'AUD');
    userEvent.click(screen.getByRole('button', { name: 'Convert' }));
    // MAKE SURE YOU AWAIT
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/convert?from=USD&to=AUD&amount=100');
    });
  });

  it('displays the converted amount from API request', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve<ConvertResponse>({
          from: 'AUD',
          to: 'USD',
          amount: 100,
          convertedAmount: 200,
        }),
    });

    render(<App />);
    await userEvent.type(screen.getByLabelText('Amount'), '100');
    await userEvent.selectOptions(screen.getByLabelText('From Currency'), 'USD');
    await userEvent.selectOptions(screen.getByLabelText('To Currency'), 'AUD');
    userEvent.click(screen.getByRole('button', { name: 'Convert' }));
    await waitFor(() => {
      expect(screen.getByTestId('converted-amount').textContent).toBe('200');
    });
  });
  it('does not fire the fetch if the amount is not filled in', async () => {
    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    render(<App />);
    await userEvent.selectOptions(screen.getByLabelText('From Currency'), 'USD');
    await userEvent.selectOptions(screen.getByLabelText('To Currency'), 'AUD');
    userEvent.click(screen.getByRole('button', { name: 'Convert' }));
    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });
});
