import React, { useEffect, useState } from "react";
import styled from "styled-components";
import theme from "themes";
import { BlankCard } from "components/card";
import Gauge from "components/gauge";
import { useBlockData } from "./hooks";

const VotingPowerTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  margin-top: 14px;
  padding: 0 14px;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
`;

const VotingPowerContainer = styled.div`
  padding: 0 14px;
  margin-top: 10px;
`;

const VotingPowerPercentTypo = styled.div`
  font-size: 30px;
`;

const VotingPowerGaugeWrapper = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  margin-top: 10px;
  margin-bottom: 40px;
`;

const VotingPowerDetailWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px 0;
`;

const VotingPowerDetail = styled.div`
  width: 100%;
  display: flex;
`;

const VotingPowerDetailTitle = styled.div`
  width: 100%;
  flex: 1;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  font-size: 16px;
`;
const VotingPowerDetailContent = styled.div`
  width: 100%;
  flex: 1;
  text-align: right;
  font-size: 16px;
`;

const VotingPowerCard = () => {
  const { votingPowerState } = useBlockData();

  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(Math.floor((votingPowerState.votingPower / votingPowerState.totalVotingPower) * 10000) / 100);
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
            <VotingPowerDetailContent>{votingPowerState.height}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Voting Power (%)</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{`${percent} %`}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Voting Power</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{votingPowerState.votingPower}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Total Voting Power</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{votingPowerState.totalVotingPower}</VotingPowerDetailContent>
          </VotingPowerDetail>
        </VotingPowerDetailWrapper>
      </VotingPowerContainer>
    </BlankCard>
  );
};

export default VotingPowerCard;
