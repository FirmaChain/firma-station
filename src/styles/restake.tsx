import styled from 'styled-components';

export const ContentContainer = styled.div`
  flex: 1;
  z-index: 2;
  width: calc(100% - 80px);
  height: 100%;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
  display: flex;
  gap: 20px;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  align-content: stretch;
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 0 10px;
  }
`;

export const RestakeContainer = styled.div`
  width: calc(100%);
  min-height: 100%;
  font-size: 1.6rem;
  color: white;
  flex: 1;
  display: flex;
  gap: 20px;
  align-items: stretch;
  align-content: stretch;
  @media only screen and (max-width: 900px) {
    flex-wrap: wrap;
  }
`;

export const RestakeLeft = styled.div`
  display: flex;
  width: 33%;
  @media only screen and (max-width: 900px) {
    width: 100%;
    flex-grow: 1;
  }
`;

export const RestakeRight = styled.div`
  display: flex;
  width: 67%;
  @media only screen and (max-width: 900px) {
    width: 100%;
    flex-grow: 1;
  }
`;

export const Label = styled.div`
  width: 100%;
  font-size: 2.2rem;
  color: #bbb;

  margin-top: 10px;
`;
