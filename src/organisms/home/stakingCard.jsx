import React from "react";
import { PieChart, Pie, Cell } from "recharts";

import theme from "../../theme";
import { BlankCard } from "../../components/card";
import { StakingWrap, StakingTextWrap, StakingTitleTypo, StakingContentTypo } from "./styles";

function StakingCard({ stakingData }) {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="168px" flex="2.08">
      <PieChart width={140} height={140} style={{ float: "left" }}>
        <Pie data={stakingData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
          {stakingData.map((data, index) => (
            <Cell key={`cell-${index}`} fill={data.color} />
          ))}
        </Pie>
      </PieChart>
      <StakingWrap>
        {stakingData.map((data, index) => (
          <StakingTextWrap key={index}>
            <StakingTitleTypo>{data.name}</StakingTitleTypo>
            <StakingContentTypo>{data.value} FCT</StakingContentTypo>
          </StakingTextWrap>
        ))}
      </StakingWrap>
    </BlankCard>
  );
}

export default StakingCard;
