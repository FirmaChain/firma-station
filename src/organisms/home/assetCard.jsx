import React from "react";
import { useSelector } from "react-redux";

import theme from "themes";
import { BlankCard } from "components/card";
import { AessetTable } from "components/table";
import { AddressTitleTypo } from "./styles";

const AssetCard = () => {
  const { balance } = useSelector((state) => state.wallet);
  const { nftList } = useSelector((state) => state.nft);

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <AddressTitleTypo>Assets</AddressTitleTypo>
      <AessetTable
        columns={[
          { name: "Name", align: "center" },
          { name: "Balances", align: "center" },
        ]}
        assets={[
          ["FCT", balance],
          ...nftList.map((data) => {
            return [`NFT #${data.id}`, 1];
          }),
        ]}
        size="medium"
      />
    </BlankCard>
  );
};

export default AssetCard;
