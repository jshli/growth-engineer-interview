import { FormEvent, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as Logo } from '../assets/logo.svg';
import Input from '../components/Input/Input';
import { palette } from '../styles';
import Button from '../components/Button';
import { ConvertResponse, Currencies, CurrencyCodes } from '../types';
import { CurrencySelector } from '../components/CurrencySelector/CurrencySelector';
import { useAnalytics } from '../hooks/useAnalytics';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: Record<string, any>) => void;
  }
}

function App() {
  const [amount, setAmount] = useState('');

  // maybe talk about grouping these into one object. Otherwise I don't think it's too bad
  // talk about abstraction - how at this point, it's not needed
  const [fromCurrency, setFromCurrency] = useState<'' | CurrencyCodes>('');
  const [toCurrency, setToCurrency] = useState<'' | CurrencyCodes>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [convertedAmount, setConvertedAmount] = useState('');
  const { trackConversion } = useAnalytics();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount))) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!fromCurrency) {
      newErrors.from = 'Please select source currency';
    }
    if (!toCurrency) {
      newErrors.to = 'Please select target currency';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchConversion = async (): Promise<ConvertResponse> => {
    const URL = `${process.env.REACT_APP_API_URL}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
    const response = await fetch(URL);
    if (!response.ok) throw new Error('Conversion failed');
    return response.json();
  };

  // DON'T FORGET TO KEEP IT SIMPLE FIRST, BEFORE REFACTORING
  const convertAmount = async () => {
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const URL = `${process.env.REACT_APP_API_URL}/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`;
      const response = await fetch(URL);
      if (!response.ok) {
        // handle this - maybe with a toast?
        // throw new Error('Server error occ wured')
      }
      const json: ConvertResponse = await response.json();
      const convertedAmountValue = Number(json.convertedAmount).toLocaleString('en-GB', { maximumFractionDigits: 2 });
      setConvertedAmount(convertedAmountValue);
      trackConversion({ from: fromCurrency, to: toCurrency, amount: amount, convertedAmount: convertedAmountValue });
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const clearFieldErrors = (fieldName: string) => {
    setErrors((prev) => {
      const { [fieldName]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchConversion();
      const convertedAmountValue = Number(data.convertedAmount).toLocaleString('en-GB', { maximumFractionDigits: 2 });
      setConvertedAmount(convertedAmountValue);
      trackConversion({ from: fromCurrency, to: toCurrency, amount, convertedAmount: convertedAmountValue });
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <StyledHeader>
        <Logo title="Cleo" />
        <p>Currency Converter</p>
      </StyledHeader>
      <ContentContainer>
        {/* this should be a form */}
        <ConverterContainer onSubmit={handleSubmit}>
          <Input
            label="Amount"
            onChange={(value) => {
              // optional
              clearFieldErrors('amount');

              setAmount(value);
            }}
            value={amount}
            error={errors.amount}
          />
          <CurrencySelector
            label="From Currency"
            onChange={(value) => {
              clearFieldErrors('from');
              setFromCurrency(value);
            }}
            value={fromCurrency}
            error={errors.from}
          />
          <CurrencySelector
            label="To Currency"
            onChange={(value) => {
              clearFieldErrors('to');

              setToCurrency(value);
            }}
            value={toCurrency}
            error={errors.to}
          />
          <Button type="submit" label={isLoading ? 'Loading' : 'Convert'} disabled={isLoading} />
          <span data-testid="converted-amount">{convertedAmount}</span>
        </ConverterContainer>
      </ContentContainer>
    </div>
  );
}

const StyledHeader = styled.header`
  height: 280px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  background-color: ${palette.blue};
  color: ${palette.white};
`;

// probably should be a 'main'
const ContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ConverterContainer = styled.form`
  border-radius: 8px;
  box-shadow:
    0 4px 8px 0 rgba(0, 0, 0, 0.2),
    0 6px 20px 0 rgba(0, 0, 0, 0.2);
  width: 400px;
  margin-top: -50px;
  background-color: ${palette.white};
  padding: 36px 30px;
`;
export default App;
