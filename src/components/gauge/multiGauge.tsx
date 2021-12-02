import React from "react";

import theme from "../../themes";
import { MultiGaugeWrapper, MultiGaugePercent, MultiGaugeItem } from "./styles";

interface GaugeItem {
  percent: string;
  bgColor: string;
}
interface IProps {
  percent: string;
  bgColor?: string;
  multiList: Array<GaugeItem>;
}

const MultiGauge = ({ percent, bgColor = theme.colors.mainblue, multiList }: IProps) => {
  return (
    <MultiGaugeWrapper bgColor={bgColor}>
      <MultiGaugePercent percent={percent}>
        {multiList.map((gaugeItem, index) => {
          return <MultiGaugeItem key={index} percent={gaugeItem.percent} bgColor={gaugeItem.bgColor} />;
        })}
      </MultiGaugePercent>
    </MultiGaugeWrapper>
  );
};

export default React.memo(MultiGauge);
