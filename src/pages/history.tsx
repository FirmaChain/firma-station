import React from 'react';

import { useHistoryByAddress } from '../organisms/history/hooks';

import { HistoryCard } from '../organisms/history';
import { ContentContainer } from '../styles/accounts';

const History = () => {
  const { historyByAddressState, loadMore } = useHistoryByAddress();
  return (
    <ContentContainer>
      {historyByAddressState && <HistoryCard historyByAddressState={historyByAddressState} loadMore={loadMore} />}
    </ContentContainer>
  );
};

export default React.memo(History);
