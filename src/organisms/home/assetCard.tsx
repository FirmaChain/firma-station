import React from 'react';
import { useSelector } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { rootState } from '../../redux/reducers';

import theme from '../../themes';
import { BlankCard } from '../../components/card';
import { AddressTitleTypo, ListWrapper, HeaderWrapper, HeaderColumn, ItemWrapper, ItemColumn } from './styles';
import { convertNumberFormat } from '../../utils/common';
import { CHAIN_CONFIG } from '../../config';

const Row = ({ data, index, style }: any) => {
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
    [`${CHAIN_CONFIG.PARAMS.SYMBOL}`, convertNumberFormat(balance, 3)],
    ...tokenList.map((data) => {
      let symbol = data.symbol;
      if (data.symbol.length > 10) {
        symbol = data.symbol.substring(0, 10) + '...';
      }
      return [symbol, convertNumberFormat(data.balance, 3)];
    }),
    ...nftList.map((data) => {
      return [`NFT #${data.id}`, '1'];
    }),
  ];

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height='100%'>
      <AddressTitleTypo>Assets</AddressTitleTypo>
      <ListWrapper>
        <AutoSizer>
          {({ height, width }: any) => (
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
