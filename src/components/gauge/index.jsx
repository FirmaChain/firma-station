import React from "react";

import { GaugeWrapper, GaugePercent } from "./styles";

const Gauge = ({ percent }) => {
  return (
    <GaugeWrapper>
      <GaugePercent percent={percent} />
    </GaugeWrapper>
  );
};

export default Gauge;
