import styled from 'styled-components';

export const QRContainer = styled.div`
  width: 100%;
  height: 208px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
`;

export const QRTimerText = styled.div`
  color: white;
  background-color: #3550de;
  padding: 7px 10px;
  border-radius: 20px;
  display: flex;
  gap: 5px;
  cursor: pointer;
`;

export const RefreshIconButton = styled.div`
  width: 16px;
  height: 16px;
  background-image: url('${({ theme }) => theme.urls.refresh}');
  background-size: contain;
  background-position: center;
`;
