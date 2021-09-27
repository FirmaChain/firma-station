import React from "react";

import theme from "../../theme";
import { BlankCard } from "../../components/card";
import { AessetTable } from "../../components/table";
import { AddressTitleTypo } from "./styles";

function AssetCard({ assetData }) {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <AddressTitleTypo>Assets</AddressTitleTypo>
      <AessetTable columns={assetData.columns} assets={assetData.data} size="medium" />
    </BlankCard>
  );
}

export default AssetCard;
