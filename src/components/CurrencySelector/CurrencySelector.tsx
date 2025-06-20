import { SelectHTMLAttributes } from 'react';
import styled from 'styled-components';
import { Currencies, CurrencyCodes } from '../../types';

type Props = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  label: string;
  onChange: (value: CurrencyCodes) => void;
  value: '' | CurrencyCodes;
  error?: string;
};

export const CurrencySelector: React.FC<Props> = ({ label, value, onChange, error, ...rest }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as CurrencyCodes);
  };
  return (
    <>
      <StyledLabel htmlFor={`${label}-select`}>{label}</StyledLabel>
      <StyledSelect aria-required="true" aria-invalid={!!error} id={`${label}-select`} value={value} onChange={handleChange} {...rest}>
        {!value && <option value="">Select a currency</option>}
        {Object.keys(Currencies).map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </StyledSelect>
      {error && <StyledErrorMessage role="alert">{error}</StyledErrorMessage>}
    </>
  );
};
const StyledErrorMessage = styled.p`
  color: #e43939;
  margin-top: 4px;
  margin-bottom: 8px;
`;
const StyledSelect = styled.select`
  padding: 16px 8px;
  border: solid 1px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  width: 100%;

  &[aria-invalid='true'] {
    border-color: #e43939;
  }
`;

const StyledLabel = styled.label`
  font-weight: 600;
  margin: 12px 0 8px;
`;
