import styled from "styled-components";

export const ContentContainer = styled.div`
  z-index: 2;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
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
  gap: 0 30px;
  @media only screen and (max-width: 1400px) {
    flex-direction: column;
  }
`;

export const LeftCardWrap = styled.div`
  width: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px 0;
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
  gap: 30px 0;
  @media only screen and (max-width: 1400px) {
    gap: 10px 0;
  }
`;

export const RightCardTopWrap = styled.div`
  flex: 1 1 130px;
  width: 100%;
  min-height: 130px;
  max-height: 130px;
  display: flex;
  gap: 10px 30px;
  flex-wrap: wrap;
  @media only screen and (max-width: 1400px) {
    flex: auto;
    max-height: none;
    & > div {
      min-width: 100%;
      max-height: 130px;
    }
  }
`;

export const RightCardMiddleWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 10px 30px;
  box-shadow: 0;
  flex-wrap: wrap;
  height: 100%;
  & > div {
    width: calc(50% - 15px);
    height: 100%;
  }
  @media only screen and (max-width: 1400px) {
    flex: auto;
    height: auto;
    & > div {
      width: 100%;
    }
    & > div:nth-child(1) {
      height: 33rem;
      min-height: 33rem;
      max-height: 33rem;
    }
    & > div:nth-child(2) {
      height: 41rem;
      min-height: 41rem;
      max-height: 41rem;
    }
  }
`;

export const RightCardBottomWrap = styled.div`
  height: 100%;
`;
