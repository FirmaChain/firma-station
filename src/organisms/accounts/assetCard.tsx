import React from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

import { rootState } from "../../redux/reducers";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { AddressTitleTypo, ListWrapper2, HeaderWrapper2, HeaderColumn2, ItemWrapper2, ItemColumn2 } from "./styles";
import { convertNumberFormat } from "../../utils/common";

const Row = ({ data, index, style }: any) => {
  const currentAsset = data[index];

  return (
    <ItemWrapper2 style={style}>
      <ItemColumn2>{currentAsset[0]}</ItemColumn2>
      <ItemColumn2>{currentAsset[1]}</ItemColumn2>
    </ItemWrapper2>
  );
};

const AssetCard = () => {
  const { balance, tokenList, nftList } = useSelector((state: rootState) => state.user);

  const assetList = [
    ["FCT", balance],
    ...tokenList.map((data) => {
      return [data.symbol, convertNumberFormat(data.balance, 3)];
    }),
    ...nftList.map((data) => {
      return [`NFT #${data.id}`, "1"];
    }),
  ];

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
      <AddressTitleTypo>Assets</AddressTitleTypo>
      <ListWrapper2>
        <AutoSizer>
          {({ height, width }) => (
            <>
              <HeaderWrapper2 style={{ width }}>
                <HeaderColumn2>Name</HeaderColumn2>
                <HeaderColumn2>Balance</HeaderColumn2>
              </HeaderWrapper2>
              <List
                width={width}
                height={height - 210 - 50}
                itemCount={assetList.length}
                itemSize={50}
                itemData={assetList}
              >
                {(props) => Row({ ...props })}
              </List>
            </>
          )}
        </AutoSizer>
      </ListWrapper2>
    </BlankCard>
  );
};

export default React.memo(AssetCard);
