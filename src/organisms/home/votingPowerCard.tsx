import React, { useEffect, useState } from 'react';

import { convertNumberFormat } from '../../utils/common';
import { IVotingPowerState } from '../../interfaces/home';

import theme from '../../themes';
import { Gauge } from '../../components/gauge';
import { BlankCard } from '../../components/card';

import {
  VotingPowerTitleTypo,
  VotingPowerContainer,
  VotingPowerPercentTypo,
  VotingPowerGaugeWrapper,
  VotingPowerDetailWrapper,
  VotingPowerDetail,
  VotingPowerDetailTitle,
  VotingPowerDetailContent,
} from './styles';

interface IProps {
  votingPowerState: IVotingPowerState;
}

const VotingPowerCard = ({ votingPowerState }: IProps) => {
  const [percent, setPercent] = useState(0);
  const [height, setHeight] = useState('');
  const [votingPower, setVotingPower] = useState('');
  const [totalVotingPower, setTotalVotingPower] = useState('');

  useEffect(() => {
    if (votingPowerState) {
      let p = Math.round((votingPowerState.votingPower / votingPowerState.totalVotingPower) * 10000) / 100;
      if (isNaN(p)) p = 0;
      setPercent(p);

      setHeight(convertNumberFormat(votingPowerState.height, 0));
      setVotingPower(convertNumberFormat(votingPowerState.votingPower, 0));
      setTotalVotingPower(convertNumberFormat(votingPowerState.totalVotingPower, 0));
    }
  }, [votingPowerState]);

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height={'100%'}>
      <VotingPowerTitleTypo>Online Voting Power</VotingPowerTitleTypo>
      <VotingPowerContainer>
        <VotingPowerPercentTypo>{`${percent} %`}</VotingPowerPercentTypo>
        <VotingPowerGaugeWrapper>
          <Gauge percent={`${percent}%`} />
        </VotingPowerGaugeWrapper>
        <VotingPowerDetailWrapper>
          <VotingPowerDetail>
            <VotingPowerDetailTitle>Block</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{height}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Voting Power (%)</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{`${percent} %`}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Voting Power</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{votingPower}</VotingPowerDetailContent>
          </VotingPowerDetail>

          <VotingPowerDetail>
            <VotingPowerDetailTitle>Total Voting Power</VotingPowerDetailTitle>
            <VotingPowerDetailContent>{totalVotingPower}</VotingPowerDetailContent>
          </VotingPowerDetail>
        </VotingPowerDetailWrapper>
      </VotingPowerContainer>
    </BlankCard>
  );
};

export default React.memo(VotingPowerCard);
