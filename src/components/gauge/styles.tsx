import styled from "styled-components";

export const GaugeWrapper = styled.div<{ $bgColor: string }>`
  width: 100%;
  height: 10px;
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  background: ${(props) => props.$bgColor}50;
`;

export const GaugePercent = styled.div<{ percent: string; $bgColor: string }>`
  width: ${(props) => props.percent};
  background: ${(props) => props.$bgColor};
`;
