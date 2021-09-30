import React from "react";

import theme from "themes";
import { BlankCard } from "components/card";
import { AessetTable } from "components/table";
import { AddressTitleTypo } from "./styles";

const AssetCard = ({ assetData }) => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <AddressTitleTypo>Assets</AddressTitleTypo>
      <AessetTable columns={assetData.columns} assets={assetData.data} size="medium" />
    </BlankCard>
  );
};

export default AssetCard;
