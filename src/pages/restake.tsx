import React from 'react';
import { useDelegationRewards, useRestakeState } from '../organisms/restake/hooks';
import { TotalCard, RestakeCard, RestakeList } from '../organisms/restake';

import { ContentContainer, RestakeContainer, RestakeLeft, RestakeRight, Label } from '../styles/restake';

const Restake = () => {
  const { totalDelegateState, grantsDataState } = useDelegationRewards();
  const { restakeState } = useRestakeState();

  return (
    <ContentContainer>
      <Label>Recent restake</Label>
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
