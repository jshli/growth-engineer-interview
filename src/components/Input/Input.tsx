import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  // would definitely question when there would ever be a form without a label
  label?: string;
  onChange: (val: string) => void;
  error?: string;
  value?: string;
};

interface StyledInputProps {
  hasError?: boolean;
}

const Input: React.FC<InputProps> = ({ label, onChange, value, error, ...props }) => {
  const inputId = `${label}-input`;

  return (
    <Container>
      {label && <StyledLabel htmlFor={inputId}>{label}</StyledLabel>}
      <StyledInput id={inputId} onChange={(e) => onChange(e.target.value)} value={value} aria-invalid={!!error} {...props} />
      {error && <StyledErrorMessage role="alert">{error}</StyledErrorMessage>}
    </Container>
  );
};

const StyledErrorMessage = styled.p`
  color: #e43939;
  margin-top: 4px;
  margin-bottom: 8px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLabel = styled.label`
  font-weight: 600;
  margin: 12px 0 8px;
`;

const StyledInput = styled.input<StyledInputProps>`
  padding: 16px 8px;
  border: solid 1px ${(props) => (props.hasError ? '#e43939' : 'rgba(0, 0, 0, 0.2)')};
  border-radius: 4px;

  &[aria-invalid='true'] {
    border-color: #e43939;
  }
`;

export default Input;
