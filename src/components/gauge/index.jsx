import React from "react";
import styled from "styled-components";

const GaugeWrapper = styled.div`
  width: 100%;
  height: 10px;
  display: flex;
  overflow: hidden;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.mainblue}50;
`;
const GaugePercent = styled.div`
  width: ${(props) => props.percent};
  background: ${({ theme }) => theme.colors.mainblue};
`;

const Gauge = ({ percent }) => {
  return (
    <GaugeWrapper>
      <GaugePercent percent={percent} />
    </GaugeWrapper>
  );
};

export default Gauge;
