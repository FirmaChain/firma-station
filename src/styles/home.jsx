import styled from "styled-components";

export const ContentContainer = styled.div`
  z-index: 2;
  width: 100%;
  padding: 0 40px;
  height: calc(100% - 130px);
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
`;

export const CardWrap = styled.div`
  position: relative;
  z-index: 50;
  height: 100%;
  display: flex;
  gap: 0 30px;
`;

export const LeftCardWrap = styled.div`
  width: 400px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px 0;
`;

export const RightCardWrap = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 30px 0;
`;

export const RightCardTopWrap = styled.div`
  width: 100%;
  min-height: 130px;
  max-height: 130px;
  height: 130px;
  display: flex;
  gap: 0 30px;
`;

export const RightCardMiddleWrap = styled.div`
  width: 100%;
  min-height: 100%;
  max-height: 100%;
  height: 100%;
  display: flex;
  gap: 0 30px;
  box-shadow: 0;
`;

export const RightCardBottomWrap = styled.div`
  height: 100%;
`;
