import React, { useCallback } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';

import { CHAIN_CONFIG } from '../../config';
import { TRANSACTION_TYPE_MODEL } from '../../constants/transactions';
import { IHistoryByAddressState } from '../../interfaces/history';
import { getDateTimeFormat } from '../../utils/dateUtil';

import { ListWrapper, ItemWrapper, ItemColumn, HeaderWrapper, HeaderColumn, HistoryTypeBox } from './styles';

interface IProps {
  historyByAddressState: IHistoryByAddressState;
  loadMore: () => void;
}

const Row = ({ data, index, style }: any) => {
  const { historyList, loading } = data;

  // Show loading status
  if (index === historyList.length) {
    return (
      <ItemWrapper style={style}>
        <ItemColumn style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
          {loading ? 'Loading more...' : ''}
        </ItemColumn>
      </ItemWrapper>
    );
  }

  const currentHistory = historyList[index];

  const getMessageType = (type: string) => {
    let targetTheme = TRANSACTION_TYPE_MODEL['Unknown'];
    try {
      if (TRANSACTION_TYPE_MODEL[type]) {
        targetTheme = TRANSACTION_TYPE_MODEL[type];
      }
    } catch (e) {}

    return <HistoryTypeBox baseColor={targetTheme.tagTheme}>{targetTheme.tagDisplay}</HistoryTypeBox>;
  };

  const getHash = (hash: string) => {
    return '0x' + hash.substr(0, 16) + '...';
  };

  const getResult = (result: boolean) => {
    return result ? 'SUCCESS' : 'FAILED';
  };

  const getTimestamp = (timestamp: string) => {
    return getDateTimeFormat(timestamp);
  };

  const getMemo = (memo: string) => {
    return memo.length > 0 ? memo : '-';
  };

  return (
    <ItemWrapper style={style} data-testid={`send-history-item-${index}`}>
      <ItemColumn data-testid={`send-history-height-${index}`}>{currentHistory.height}</ItemColumn>
      <ItemColumn data-testid={`send-history-type-${index}`}>{getMessageType(currentHistory.type)}</ItemColumn>
      <ItemColumn data-testid={`send-history-hash-${index}`}>
        <Link to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/transactions/${currentHistory.hash}` }} target={'_blank'}>
          {getHash(currentHistory.hash)}
        </Link>
      </ItemColumn>
      <ItemColumn className="clamp-single-line" data-testid={`send-history-memo-${index}`}>{getMemo(currentHistory.memo)}</ItemColumn>
      <ItemColumn data-testid={`send-history-result-${index}`}>{getResult(currentHistory.success)}</ItemColumn>
      <ItemColumn data-testid={`send-history-time-${index}`}>{getTimestamp(currentHistory.timestamp)}</ItemColumn>
    </ItemWrapper>
  );
};

const HistoryCard = ({ historyByAddressState, loadMore }: IProps) => {
  const handleItemsRendered = useCallback(
    ({ visibleStopIndex }: { visibleStopIndex: number }) => {
      // Get next page if scrolled near by the last item
      const { historyList, hasMore, loading } = historyByAddressState;

      if (
        hasMore &&
        !loading &&
        visibleStopIndex >= historyList.length - 5 // Load more if one of the last 5 item is loaded
      ) {
        loadMore();
      }
    },
    [historyByAddressState, loadMore]
  );

  // Show Loading indicator with '+1' when loading status is true
  const itemCount = historyByAddressState.loading
    ? historyByAddressState.historyList.length + 1
    : historyByAddressState.historyList.length;

  return (
    <ListWrapper data-testid="send-history-list">
      <AutoSizer>
        {({ height, width }: any) => (
          <>
            <HeaderWrapper style={{ width }}>
              <HeaderColumn>Block</HeaderColumn>
              <HeaderColumn>Type</HeaderColumn>
              <HeaderColumn>Hash</HeaderColumn>
              <HeaderColumn>Memo</HeaderColumn>
              <HeaderColumn>Result</HeaderColumn>
              <HeaderColumn>Time</HeaderColumn>
            </HeaderWrapper>
            <List
              width={width}
              height={height - 50}
              itemCount={itemCount}
              itemSize={50}
              itemData={historyByAddressState}
              onItemsRendered={handleItemsRendered}
            >
              {Row}
            </List>
          </>
        )}
      </AutoSizer>
    </ListWrapper>
  );
};

export default React.memo(HistoryCard);
