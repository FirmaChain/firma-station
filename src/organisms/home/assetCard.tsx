import React from "react";
import { useSelector } from "react-redux";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

import { rootState } from "../../redux/reducers";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import { AddressTitleTypo, ListWrapper, HeaderWrapper, HeaderColumn, ItemWrapper, ItemColumn } from "./styles";
import { convertNumberFormat } from "../../utils/common";

const Row = ({ data, index, style, tokenDataState }: any) => {
  const currentAsset = data[index];

  return (
    <ItemWrapper style={style}>
      <ItemColumn>{currentAsset[0]}</ItemColumn>
      <ItemColumn>{currentAsset[1]}</ItemColumn>
    </ItemWrapper>
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
      <ListWrapper>
        <AutoSizer>
          {({ height, width }) => (
            <>
              <HeaderWrapper style={{ width }}>
                <HeaderColumn>Name</HeaderColumn>
                <HeaderColumn>Balance</HeaderColumn>
              </HeaderWrapper>
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
      </ListWrapper>
    </BlankCard>
  );
};

export default React.memo(AssetCard);
