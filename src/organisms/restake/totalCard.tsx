import React from 'react';

import { convertNumberFormat, convertToFctString } from '../../utils/common';
import { IRestakeState } from './hooks';

import { StakingWrap, StakingTextWrap, StakingTitleTypo, StakingContentTypo } from './styles';

interface IProps {
  restakeState: IRestakeState;
}

const TotalCard = ({ restakeState }: IProps) => {
  const stakingData = [
    {
      name: 'Round',
      getValue: () => {
        if (restakeState.round === 0) {
          return `Connecting`;
        } else {
          return `${restakeState.round}st`;
        }
      },
    },
    {
      name: 'Restake Amount',
      getValue: () => {
        if (restakeState.restakeAmount === '') {
          return `N/A`;
        } else {
          return `${convertNumberFormat(convertToFctString(restakeState.restakeAmount), 3)} FCT`;
        }
      },
    },
    {
      name: 'Fee Used',
      getValue: () => {
        if (restakeState.feesAmount === '') {
          return `N/A`;
        } else {
          return `${convertNumberFormat(convertToFctString(restakeState.feesAmount), 3)} FCT`;
        }
      },
    },
  ];

  return (
    <StakingWrap>
      {stakingData.map((data, index) => (
        <StakingTextWrap key={index}>
          <StakingTitleTypo>{data.name} </StakingTitleTypo>
          <StakingContentTypo>{data.getValue()}</StakingContentTypo>
        </StakingTextWrap>
      ))}
    </StakingWrap>
  );
};

export default React.memo(TotalCard);
