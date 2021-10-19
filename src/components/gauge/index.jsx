import React from "react";

import { GaugeWrapper, GaugePercent } from "./styles";

import theme from "themes";

const Gauge = ({ percent, bgColor = theme.colors.mainblue }) => {
  return (
    <GaugeWrapper $bgColor={bgColor}>
      <GaugePercent percent={percent} $bgColor={bgColor} />
    </GaugeWrapper>
  );
};

export default Gauge;
