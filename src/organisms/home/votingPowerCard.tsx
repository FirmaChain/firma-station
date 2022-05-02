import React, { useEffect, useState } from "react";

import { IVotingPowerState } from "./hooks";

import { Gauge } from "../../components/gauge";
import { BlankCard } from "../../components/card";
import theme from "../../themes";
import {
  VotingPowerTitleTypo,
  VotingPowerContainer,
  VotingPowerPercentTypo,
  VotingPowerGaugeWrapper,
  VotingPowerDetailWrapper,
  VotingPowerDetail,
  VotingPowerDetailTitle,
  VotingPowerDetailContent,
} from "./styles";
import { convertNumberFormat } from "../../utils/common";

interface IProps {
  votingPowerState: IVotingPowerState;
}

const VotingPowerCard = ({ votingPowerState }: IProps) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let p = Math.round((votingPowerState.votingPower / votingPowerState.totalVotingPower) * 10000) / 100;
    if (isNaN(p)) p = 0;
    setPercent(p);
  }, [votingPowerState]);

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height={"100%"}>
      <VotingPowerTitleTypo>Online Voting Power</VotingPowerTitleTypo>
      <VotingPowerContainer>
        <VotingPowerPercentTypo>{`${percent} %`}</VotingPowerPercentTypo>
        <VotingPowerGaugeWrapper>
          <Gauge percent={`${percent}%`} />
        </VotingPowerGaugeWrapper>
        <VotingPowerDetailWrapper>
          <VotingPowerDetail>
            <VotingPowerDetailTitle>Block</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{convertNumberFormat(votingPowerState.height, 0)}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Voting Power (%)</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{`${percent} %`}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Voting Power</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{convertNumberFormat(votingPowerState.votingPower, 0)}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Total Voting Power</VotingPowerDetailTitle>
            <VotingPowerDetailContent>
              {convertNumberFormat(votingPowerState.totalVotingPower, 0)}
            </VotingPowerDetailContent>
          </VotingPowerDetail>
        </VotingPowerDetailWrapper>
      </VotingPowerContainer>
    </BlankCard>
  );
};

export default React.memo(VotingPowerCard);
