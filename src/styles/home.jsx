import styled from "styled-components";

export const ContentContainer = styled.div`
  z-index: 2;
  width: 100%;
  padding: 0 40px;
  height: calc(100% - 130px);
  background-color: ${({ theme }) => theme.colors.backgroundBlack};
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
  min-height: 120px;
  max-height: 120px;
  height: 120px;
  display: flex;
  gap: 0 30px;
  box-shadow: 0;
`;

export const RightCardMiddleWrap = styled.div`
  width: 100%;
  min-height: 168px;
  max-height: 168px;
  height: 168px;
  display: flex;
  gap: 0 30px;
`;

export const StakingWrap = styled.div`
  width: calc(100% - 150px);
  height: 100%;
  float: left;
  display: flex;
`;

export const StakingTextWrap = styled.div`
  width: 100%;
  margin: auto;
  flex: 1;
  text-align: center;
`;
