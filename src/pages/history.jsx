import React from "react";

import { HistoryCard } from "organisms/history";
import { ContentContainer } from "styles/accounts";
import { useHistoryByAddress } from "organisms/history/hooks";

const History = () => {
  const { historyByAddressState } = useHistoryByAddress();
  return (
    <ContentContainer>
      {historyByAddressState && <HistoryCard historyByAddressState={historyByAddressState} />}
    </ContentContainer>
  );
};

export default React.memo(History);
