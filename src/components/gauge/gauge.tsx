import React from "react";

import theme from "../../themes";
import { GaugeWrapper, GaugePercent } from "./styles";

interface IProps {
  percent: string;
  bgColor?: string;
}

const Gauge = ({ percent, bgColor = theme.colors.mainblue }: IProps) => {
  return (
    <GaugeWrapper $bgColor={bgColor}>
      <GaugePercent percent={percent} $bgColor={bgColor} />
    </GaugeWrapper>
  );
};

export default React.memo(Gauge);
