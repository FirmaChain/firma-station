import React from 'react';
import moment from 'moment';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { IVesting } from '../../redux/reducers/userReducer';

import theme from '../../themes';
import { BlankCard } from '../../components/card';
import {
  ListWrapper,
  ItemWrapper3,
  ItemColumn3,
  HeaderWrapper3,
  HeaderColumn3,
  TitleTypo,
  VestingTotal,
} from './styles';
import { CHAIN_CONFIG } from '../../config';
import { convertToFctString, convertToFctNumber, convertNumberFormat } from '../../utils/common';
import { getDateTimeFormat } from '../../utils/dateUtil';

interface IProps {
  vestingState: IVesting;
}

const Row = ({ data, index, style }: any) => {
  const currentVesting = data[index];

  const getTimestamp = (timestamp: number) => {
    return getDateTimeFormat(
      moment(timestamp * 1000)
        .utc()
        .toISOString()
    );
  };

  const getAmount = (amount: string) => {
    return convertNumberFormat(convertToFctString(amount), 3) + ` ${CHAIN_CONFIG.PARAMS.SYMBOL}`;
  };

  const getStatus = (status: any) => {
    switch (status) {
      case 0:
        return <span style={{ color: '#707070' }}>{'LOCKED'}</span>;
      case 1:
        return <span style={{ color: '#f4b017' }}>{'UNLOCKED'}</span>;
    }
  };

  return (
    <ItemWrapper3 style={style}>
      <ItemColumn3>{index + 1}</ItemColumn3>
      <ItemColumn3>{getAmount(currentVesting.amount)}</ItemColumn3>
      <ItemColumn3>{getTimestamp(currentVesting.endTime)}</ItemColumn3>
      <ItemColumn3>{getStatus(currentVesting.status)}</ItemColumn3>
    </ItemWrapper3>
  );
};

const VestingCard = ({ vestingState }: IProps) => {
  const getVestingTotal = () => {
    return `( ${convertNumberFormat(
      convertToFctString((vestingState.totalVesting - vestingState.expiredVesting).toString()),
      3
    )} / ${convertNumberFormat(convertToFctNumber(vestingState.totalVesting), 3)} )`;
  };

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar}>
      <TitleTypo>Account Vesting</TitleTypo>
      <VestingTotal>{getVestingTotal()}</VestingTotal>
      <ListWrapper>
        <AutoSizer>
          {({ height, width }: any) => (
            <>
              <HeaderWrapper3 style={{ width }}>
                <HeaderColumn3>No</HeaderColumn3>
                <HeaderColumn3>Amount</HeaderColumn3>
                <HeaderColumn3>Vesting End Date</HeaderColumn3>
                <HeaderColumn3>Status</HeaderColumn3>
              </HeaderWrapper3>
              <List
                width={width}
                height={height - 90}
                itemCount={vestingState.vestingPeriod.length}
                itemSize={40}
                itemData={vestingState.vestingPeriod}
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

export default React.memo(VestingCard);
