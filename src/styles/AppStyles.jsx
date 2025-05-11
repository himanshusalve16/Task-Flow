import styled from 'styled-components';

export const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: ${props => props.theme.backgroundSecondary};
  transition: all 0.3s ease;
`;

export const Button = styled.button`
  padding: 8px 16px;
  background: ${props => props.$primary ? props.theme.primary : 'transparent'};
  color: ${props => props.$primary ? '#fff' : props.theme.text};
  border: 1px solid ${props => props.$primary ? 'transparent' : props.theme.border};
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${props => props.$primary ? props.theme.accent : props.theme.backgroundTertiary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.background};
  border-radius: 8px;
  padding: 16px;
  box-shadow: ${props => props.theme.shadow};
  transition: all 0.3s ease;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}33;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}33;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: ${props => props.$alignItems || 'center'};
  justify-content: ${props => props.$justifyContent || 'flex-start'};
  gap: ${props => props.$gap || '8px'};
  flex-direction: ${props => props.$direction || 'row'};
  flex-wrap: ${props => props.$wrap || 'nowrap'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`; 