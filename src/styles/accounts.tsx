import styled from "styled-components";

export const ContentContainer = styled.div`
  flex: 1;
  z-index: 2;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
  @media only screen and (max-width: 1400px) {
    width: calc(100% - 20px);
    padding: 0 10px;
  }
`;

export const CardWrap = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  gap: 0 15px;
  @media only screen and (max-width: 1400px) {
    flex-direction: column;
  }
`;

export const LeftCardWrap = styled.div`
  width: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  @media only screen and (max-width: 1400px) {
    width: 100%;
    flex-direction: column;
    margin-bottom: 10px;
    & > div:nth-child(2) {
      display: none;
    }
  }
`;

export const RightCardWrap = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 15px 0;
  @media only screen and (max-width: 1400px) {
    gap: 10px 0;
  }
`;

export const RightCardTopWrap = styled.div`
  width: 100%;
  min-height: 130px;
  max-height: 130px;
  height: 130px;
  display: flex;
  gap: 0 15px;
`;

export const RightCardBottomWrap = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  & > div {
    flex: 1;
  }
  @media only screen and (max-width: 1400px) {
    height: 600px;
  }
`;
