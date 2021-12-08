import styled from "styled-components";

export const ContentContainer = styled.div`
  z-index: 2;
  width: calc(100% - 80px);
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  padding: 0 40px;
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
  color: ${({ theme }) => theme.colors.defaultFont};
`;

export const CardWrap = styled.div`
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  gap: 0 30px;
  flex: 1;
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

export const RightCardBottomWrap = styled.div`
  height: 100%;
`;
