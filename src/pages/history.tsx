import React from "react";

import { useHistoryByAddress } from "../organisms/history/hooks";

import { HistoryCard } from "../organisms/history";
import { ContentContainer } from "../styles/accounts";

const History = () => {
  const { historyByAddressState } = useHistoryByAddress();
  return (
    <ContentContainer>
      {historyByAddressState && <HistoryCard historyByAddressState={historyByAddressState} />}
    </ContentContainer>
  );
};

export default React.memo(History);
