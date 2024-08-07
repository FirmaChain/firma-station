import React, { useMemo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';

import { CHAIN_CONFIG, OSMOSIS_EXPLORER } from '../../config';
import { getDateFormat, getTimeFormat } from '../../utils/dateUtil';
import { convertNumberFormat } from '../../utils/common';
import { ITokensState, ITransferHistoryByAddressState } from '../../interfaces/history';

import theme from '../../themes';
import { BlankCard } from '../../components/card';
import { ListWrapper, ItemWrapper, ItemColumn, HeaderWrapper, HeaderColumn, TitleTypo } from './styles';

interface IProps {
  transferHistoryByAddressState: ITransferHistoryByAddressState;
  tokenDataState: ITokensState;
}

const Row = ({ data, index, style, tokenDataState }: any) => {
  const currentHistory = data[index];

  const getHash = (hash: string) => {
    return '0x' + hash.substr(0, 4) + '...';
  };

  const getAddress = (address: string) => {
    return address.substr(0, 10) + '...';
  };

  const getAmount = (denom: string, amount: number) => {
    if (tokenDataState[denom] !== undefined) {
      return `${convertNumberFormat(amount / 10 ** tokenDataState[denom].decimal, 3)} ${tokenDataState[denom].symbol}`;
    } else {
      return amount;
    }
  };

  const getResult = (result: boolean) => {
    return result ? 'SUCCESS' : 'FAILED';
  };

  const getTimestamp = (timestamp: string) => {
    return (
      <>
        <div>{getDateFormat(timestamp, false)}</div>
        <div>{getTimeFormat(timestamp)}</div>
      </>
    );
  };

  const getMemo = (memo: string) => {
    if (memo.length > 30) return memo.substr(0, 30) + '...';
    else return memo;
  };

  const fromURL = useMemo(() => {
    if (currentHistory.from.includes('osmo')) {
      return `${OSMOSIS_EXPLORER}/address/${currentHistory.from}`;
    } else {
      return `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${currentHistory.from}`;
    }
  }, [currentHistory]);

  const toURL = useMemo(() => {
    if (currentHistory.to.includes('osmo')) {
      return `${OSMOSIS_EXPLORER}/address/${currentHistory.to}`;
    } else {
      return `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${currentHistory.to}`;
    }
  }, [currentHistory]);

  return (
    <ItemWrapper style={style}>
      <ItemColumn>
        <Link to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/transactions/${currentHistory.hash}` }} target={'_blank'}>
          {getHash(currentHistory.hash)}
        </Link>
      </ItemColumn>
      <ItemColumn>
        <Link to={{ pathname: fromURL }} target={'_blank'}>
          {getAddress(currentHistory.from)}
        </Link>
      </ItemColumn>
      <ItemColumn>
        <Link to={{ pathname: toURL }} target={'_blank'}>
          {getAddress(currentHistory.to)}
        </Link>
      </ItemColumn>
      <ItemColumn>{getAmount(currentHistory.denom, currentHistory.amount)}</ItemColumn>
      <ItemColumn>{getResult(currentHistory.success)}</ItemColumn>
      <ItemColumn>{getMemo(currentHistory.memo)}</ItemColumn>
      <ItemColumn>{getTimestamp(currentHistory.timestamp)}</ItemColumn>
    </ItemWrapper>
  );
};

const TransferHistoryCard = ({ transferHistoryByAddressState, tokenDataState }: IProps) => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar}>
      <TitleTypo>Send History</TitleTypo>
      <ListWrapper>
        <AutoSizer>
          {({ height, width }: any) => (
            <>
              <HeaderWrapper style={{ width }}>
                <HeaderColumn>Hash</HeaderColumn>
                <HeaderColumn>From</HeaderColumn>
                <HeaderColumn>To</HeaderColumn>
                <HeaderColumn>Amount</HeaderColumn>
                <HeaderColumn>Result</HeaderColumn>
                <HeaderColumn>Memo</HeaderColumn>
                <HeaderColumn>Time</HeaderColumn>
              </HeaderWrapper>
              <List
                width={width}
                height={height - 90}
                itemCount={transferHistoryByAddressState.historyList.length}
                itemSize={50}
                itemData={transferHistoryByAddressState.historyList}
              >
                {(props) => Row({ ...props, tokenDataState })}
              </List>
            </>
          )}
        </AutoSizer>
      </ListWrapper>
    </BlankCard>
  );
};

export default React.memo(TransferHistoryCard);
