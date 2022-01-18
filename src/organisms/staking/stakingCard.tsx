import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import numeral from "numeral";

import { isValid } from "../../utils/common";
import { rootState } from "../../redux/reducers";
import { ITotalStakingState } from "./hooks";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { StakingWrap, StakingTextWrap, StakingTitleTypo, StakingContentTypo } from "./styles";

interface IProps {
  totalStakingState: ITotalStakingState;
}

const StakingCard = ({ totalStakingState }: IProps) => {
  const { vesting } = useSelector((state: rootState) => state.user);

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
  }, [totalStakingState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="120px">
      <StakingWrap>
        {stakingData.map((data, index) => (
          <StakingTextWrap key={index}>
            <StakingTitleTypo>
              {data.name}{" "}
              {index === 0 && vesting.vestingPeriod.length > 0 && (
                <span style={{ fontSize: "12px", color: "#f4b017" }}>( + Vesting )</span>
              )}
            </StakingTitleTypo>
            <StakingContentTypo>{numeral(data.value).format("0,0.000")} FCT</StakingContentTypo>
          </StakingTextWrap>
        ))}
      </StakingWrap>
    </BlankCard>
  );
};

export default React.memo(StakingCard);
