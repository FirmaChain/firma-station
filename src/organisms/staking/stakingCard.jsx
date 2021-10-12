import React from "react";
import { PieChart, Pie, Cell } from "recharts";

import theme from "themes";
import { BlankCard } from "components/card";
import { StakingWrap, StakingTextWrap, StakingTitleTypo, StakingContentTypo } from "./styles";

const StakingCard = () => {
  const stakingData = [
    { name: "Available", value: 9000, color: theme.colors.mainblue },
    { name: "Delegated", value: 1000, color: theme.colors.mainpurple },
    { name: "Unbonding", value: 0, color: theme.colors.maingreen },
    { name: "Staking Reward", value: 350, color: theme.colors.mainred },
  ];

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
};

export default StakingCard;
