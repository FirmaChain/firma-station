import React from 'react';
import { useDelegationRewards, useRestakeState } from '../organisms/restake/hooks';
import { TotalCard, RestakeCard, RestakeList } from '../organisms/restake';

import {
  ContentContainer,
  RestakeContainer,
  RestakeLeft,
  RestakeRight,
  LabelWrapper,
  Label,
  MoreView,
  OpenIcon,
} from '../styles/restake';
import { RESTAKE_PAGE_LINK } from '../config';

const Restake = () => {
  const { totalDelegateState, grantsDataState } = useDelegationRewards();
  const { restakeState } = useRestakeState();

  return (
    <ContentContainer>
      <LabelWrapper>
        <Label>Recent restake</Label>
        <MoreView
          onClick={() => {
            window.open(RESTAKE_PAGE_LINK);
          }}
        >
          More View <OpenIcon />
        </MoreView>
      </LabelWrapper>
      <TotalCard restakeState={restakeState} />
      <Label>My restake</Label>
      <RestakeContainer>
        <RestakeLeft>
          <RestakeCard
            totalDelegateState={totalDelegateState}
            grantsDataState={grantsDataState}
            restakeState={restakeState}
          />
        </RestakeLeft>
        <RestakeRight>
          <RestakeList
            totalDelegateState={totalDelegateState}
            grantsDataState={grantsDataState}
            restakeState={restakeState}
          />
        </RestakeRight>
      </RestakeContainer>
    </ContentContainer>
  );
};

export default React.memo(Restake);
