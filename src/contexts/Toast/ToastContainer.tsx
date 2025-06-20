import styled from 'styled-components';
import { useToast } from './ToastContext';

const ToastContainer = () => {
  const { toasts } = useToast();
  return (
    <Container>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} data-type={toast.type}>
          {toast.message}
        </ToastItem>
      ))}
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div`
  background: #333;
  color: #fff;
  padding: 12px 20px;
  border-radius: 4px;
  min-width: 200px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  &[data-type='success'] {
    background: #4caf50;
  }
  &[data-type='error'] {
    background: #f44336;
  }
  &[data-type='info'] {
    background: #2196f3;
  }
`;

export default ToastContainer;
