import { FormEvent, useState } from 'react';
import styled from 'styled-components';

import { ReactComponent as Logo } from '../assets/logo.svg';
import Input from '../components/Input/Input';
import { palette } from '../styles';
import Button from '../components/Button';
import { ConvertResponse, Currencies, CurrencyCodes } from '../types';
import { CurrencySelector } from '../components/CurrencySelector/CurrencySelector';

function App() {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState<undefined | CurrencyCodes>(undefined);
  const [toCurrency, setToCurrency] = useState<undefined | CurrencyCodes>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [convertedAmount, setConvertedAmount] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0 || isNaN(parseFloat(amount))) {
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
        // throw new Error('Server error occured')
      }
      const json: ConvertResponse = await response.json();
      const convertedAmountValue = Number(json.convertedAmount).toLocaleString('en-GB', { maximumFractionDigits: 2 });
      setConvertedAmount(convertedAmountValue);

      // Fire Google Tag Manager event
      if (window.gtag) {
        console.log('google');
        window.gtag('event', 'ConvertButton', {
          event_category: 'CurrencyConverter',
          event_label: 'ConvertButton',
          currency_from: fromCurrency,
          currency_to: toCurrency,
          amount: amount,
          converted_amount: json.convertedAmount,
        });
      }
    } catch (error) {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    convertAmount();
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
              const { amount, ...rest } = errors;
              setErrors(rest);

              setAmount(value);
            }}
            value={amount}
            error={errors.amount}
          />
          <CurrencySelector
            label="From Currency"
            onChange={(value) => {
              const { from, ...rest } = errors;
              setErrors(rest);

              setFromCurrency(value);
            }}
            value={fromCurrency}
            error={errors.from}
          />
          <CurrencySelector
            label="To Currency"
            onChange={(value) => {
              const { to, ...rest } = errors;
              setErrors(rest);

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
