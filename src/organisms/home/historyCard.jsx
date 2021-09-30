import React from "react";

import theme from "themes";
import { BlankCard } from "components/card";
import { CustomTabs } from "components/tab";
import { AessetTable } from "components/table";

const HistoryCard = ({ historyData }) => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <CustomTabs />
      <AessetTable columns={historyData.columns} assets={historyData.data} size="small" />
    </BlankCard>
  );
};

export default HistoryCard;
