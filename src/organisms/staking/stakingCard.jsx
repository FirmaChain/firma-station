import React, { useEffect, useState } from "react";
import numeral from "numeral";

import theme from "themes";
import { BlankCard } from "components/card";
import { StakingWrap, StakingTextWrap, StakingTitleTypo, StakingContentTypo } from "./styles";
import { isValid } from "utils/common";

const StakingCard = ({ totalStakingState }) => {
  const [stakingData, setStakingData] = useState([
    { name: "Available", value: 0, color: theme.colors.mainblue },
    { name: "Delegated", value: 0, color: theme.colors.mainpurple },
    { name: "Undelegate", value: 0, color: theme.colors.maingreen },
    { name: "Staking Reward", value: 0, color: theme.colors.mainred },
  ]);

  useEffect(() => {
    if (isValid(totalStakingState)) {
      let newData = [...stakingData];
      newData[0].value = totalStakingState.available;
      newData[1].value = totalStakingState.delegated;
      newData[2].value = totalStakingState.undelegate;
      newData[3].value = totalStakingState.stakingReward;
      setStakingData(newData);
    }
  }, [totalStakingState]);

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="168px" flex="2.08">
      {/* <PieChart width={140} height={140} style={{ float: "left" }}>
        {console.log(stakingData)}
        <Pie data={stakingData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
          {stakingData.map((data, index) => (
            <Cell key={`cell-${index}`} fill={data.color} />
          ))}
        </Pie>
      </PieChart> */}
      <StakingWrap>
        {stakingData.map((data, index) => (
          <StakingTextWrap key={index}>
            <StakingTitleTypo>{data.name}</StakingTitleTypo>
            <StakingContentTypo>{numeral(data.value).format("0,0.000")} FCT</StakingContentTypo>
          </StakingTextWrap>
        ))}
      </StakingWrap>
    </BlankCard>
  );
};

export default StakingCard;
