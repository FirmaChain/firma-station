import React, { useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useMediaQuery } from 'react-responsive';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const InlineValidator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const WalletCell: React.CSSProperties = {
  flex: '0 0 460px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const ValidatorCell: React.CSSProperties = {
  flex: '1 1 0',
  minWidth: 0,
};

const NumericCell: React.CSSProperties = {
  flex: '0 0 160px',
};

const TimeCell: React.CSSProperties = {
  flex: '0 0 220px',
};

import { convertNumberFormat, convertToFctNumber } from '../../../utils/common';
import { CHAIN_CONFIG } from '../../../config';
import {
  IDelegationState,
  IRedelegationList,
  IRedelegationState,
  IUndelegationList,
  IUndelegationState,
} from '../../../interfaces/staking';
import { getDateTimeFormat } from '../../../utils/dateUtil';

import {
  DelegatorsCardWrapper,
  DelegatorList,
  ItemWrapper,
  ItemColumn,
  HeaderWrapper,
  HeaderColumn,
  HeaderMobileWrapper,
  HeaderMobileColumn,
  ItemMobileWrapper,
  ItemMobileColumn,
  ProfileImage2,
  DelegatorInfoMobile,
  TabBar,
  TabItem,
} from './styles';

interface IProps {
  delegateState: IDelegationState;
  redelegateState: IRedelegationState;
  undelegateState: IUndelegationState;
}

const sortedAmountDescending = (list: any[]) =>
  [...list].sort((a, b) => (a.amount > b.amount ? -1 : a.amount < b.amount ? 1 : 0));

const sortedUntimeDescending = (list: any[]) =>
  [...list].sort((a, b) => (new Date(a.completionTime).getTime() - new Date(b.completionTime).getTime()));

const DelegatorRow = ({ data, index, style }: any) => {
  const item = data[index];
  return (
    <Link to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${item.delegatorAddress}` }} target={'_blank'}>
      <ItemWrapper style={style}>
        <ItemColumn avatar>
          <ProfileImage2 src={item.avatarURL} />
        </ItemColumn>
        <ItemColumn>{`${item.moniker}`}</ItemColumn>
        <ItemColumn>{`${convertNumberFormat(convertToFctNumber(item.amount), 3)} ${
          CHAIN_CONFIG.PARAMS.SYMBOL
        }`}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const DelegatorRowMobile = ({ data, index, style }: any) => {
  const item = data[index];
  return (
    <Link to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${item.delegatorAddress}` }} target={'_blank'}>
      <ItemMobileWrapper style={style}>
        <ItemMobileColumn>
          <ProfileImage2 src={item.avatarURL} />
          <DelegatorInfoMobile>
            <div>{`${item.moniker}`}</div>
            <div>{`${convertNumberFormat(convertToFctNumber(item.amount), 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</div>
          </DelegatorInfoMobile>
        </ItemMobileColumn>
      </ItemMobileWrapper>
    </Link>
  );
};

const RedelegatorRow = ({ data, index, style }: any) => {
  const item: IRedelegationList = data[index];
  return (
    <Link to={{ pathname: `/staking/validators/${item.srcAddress}` }}>
      <ItemWrapper style={style}>
        <ItemColumn style={WalletCell} title={item.delegatorAddress}>{item.delegatorAddress}</ItemColumn>
        <ItemColumn avatar>
          <ProfileImage2 src={item.dstAvatarURL} />
        </ItemColumn>
        <ItemColumn>{`${item.dstMoniker}`}</ItemColumn>
        <ItemColumn style={NumericCell}>{`${convertNumberFormat(convertToFctNumber(item.balance), 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</ItemColumn>
        <ItemColumn style={TimeCell}>{getDateTimeFormat(item.completionTime)}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const RedelegatorRowMobile = ({ data, index, style }: any) => {
  const item: IRedelegationList = data[index];
  return (
    <ItemMobileWrapper style={style}>
      <ItemMobileColumn>
        <ProfileImage2 src={item.dstAvatarURL} />
        <DelegatorInfoMobile>
          <div>{`${item.srcMoniker}`}</div>
          <div>{`${item.dstMoniker}`}</div>
          <div>
            {`${convertNumberFormat(convertToFctNumber(item.balance), 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`} ·{' '}
            {getDateTimeFormat(item.completionTime)}
          </div>
        </DelegatorInfoMobile>
      </ItemMobileColumn>
    </ItemMobileWrapper>
  );
};

const UndelegatorRow = ({ data, index, style }: any) => {
  const item: IUndelegationList = data[index];
  return (
    <Link to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${item.validatorAddress}` }} target={'_blank'}>
      <ItemWrapper style={style}>
        <ItemColumn avatar>
          <ProfileImage2 src={item.avatarURL} />
        </ItemColumn>
        <ItemColumn>{`${item.moniker}`}</ItemColumn>
        <ItemColumn>{`${convertNumberFormat(convertToFctNumber(item.balance), 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</ItemColumn>
        <ItemColumn>{getDateTimeFormat(item.completionTime)}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const UndelegatorRowMobile = ({ data, index, style }: any) => {
  const item: IUndelegationList = data[index];
  return (
    <Link to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${item.validatorAddress}` }} target={'_blank'}>
      <ItemMobileWrapper style={style}>
        <ItemMobileColumn>
          <ProfileImage2 src={item.avatarURL} />
          <DelegatorInfoMobile>
            <div>{`${item.moniker || item.validatorAddress}`}</div>
            <div>
              {`${convertNumberFormat(convertToFctNumber(item.balance), 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`} ·{' '}
              {getDateTimeFormat(item.completionTime)}
            </div>
          </DelegatorInfoMobile>
        </ItemMobileColumn>
      </ItemMobileWrapper>
    </Link>
  );
};

const DelegatorsCard = ({ delegateState, redelegateState, undelegateState }: IProps) => {
  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });
  const [tab, setTab] = useState(0);
  
  const delegatorCount = delegateState?.delegationList?.length ?? 0;
  const redelegatorCount = redelegateState?.redelegationList?.length ?? 0;
  const undelegatorCount = undelegateState?.undelegationList?.length ?? 0;

  const sortedDelegateList = delegateState?.delegationList ? sortedAmountDescending(delegateState.delegationList) : [];
  const sortedRedelegatorList = redelegateState?.redelegationList ? sortedUntimeDescending(redelegateState.redelegationList) : [];
  const sortedUndelegatorList = undelegateState?.undelegationList ? sortedUntimeDescending(undelegateState.undelegationList) : [];

  console.log(sortedUndelegatorList);
  return (
    <DelegatorsCardWrapper>
      <TabBar>
        <TabItem active={tab === 0} onClick={() => setTab(0)}>
          Delegators ({delegatorCount})
        </TabItem>
        <TabItem active={tab === 1} onClick={() => setTab(1)}>
          Redelegators ({redelegatorCount})
        </TabItem>
        <TabItem active={tab === 2} onClick={() => setTab(2)}>
          Undelegators ({undelegatorCount})
        </TabItem>
      </TabBar>

      <DelegatorList>
        <AutoSizer>
          {({ height, width }: any) => {
            if (tab === 0) {
              return isMobile ? (
                <>
                  <HeaderMobileWrapper style={{ width }}>
                    <HeaderMobileColumn>Delegator</HeaderMobileColumn>
                  </HeaderMobileWrapper>
                  <List
                    width={width}
                    height={height - 70}
                    itemCount={sortedDelegateList.length}
                    itemSize={68}
                    itemData={sortedDelegateList}
                  >
                    {DelegatorRowMobile}
                  </List>
                </>
              ) : (
                <>
                  <HeaderWrapper style={{ width }}>
                    <HeaderColumn avatar></HeaderColumn>
                    <HeaderColumn>Delegator</HeaderColumn>
                    <HeaderColumn>Amount</HeaderColumn>
                  </HeaderWrapper>
                  <List
                    width={width}
                    height={height - 70}
                    itemCount={sortedDelegateList.length}
                    itemSize={50}
                    itemData={sortedDelegateList}
                  >
                    {DelegatorRow}
                  </List>
                </>
              );
            }

            if (tab === 1) {
              return isMobile ? (
                <>
                  <HeaderMobileWrapper style={{ width }}>
                    <HeaderMobileColumn>My Redelegations</HeaderMobileColumn>
                  </HeaderMobileWrapper>
                  <List
                    width={width}
                    height={height - 70}
                    itemCount={sortedRedelegatorList.length}
                    itemSize={68}
                    itemData={sortedRedelegatorList}
                  >
                    {RedelegatorRowMobile}
                  </List>
                </>
              ) : (
                <>
                  <HeaderWrapper style={{ width }}>
                    <HeaderColumn style={WalletCell}>Wallet</HeaderColumn>
                    <HeaderColumn style={ValidatorCell}>To</HeaderColumn>
                    <HeaderColumn style={NumericCell}>Amount</HeaderColumn>
                    <HeaderColumn style={TimeCell}>Linked Until</HeaderColumn>
                  </HeaderWrapper>
                  <List
                    width={width}
                    height={height - 70}
                    itemCount={sortedRedelegatorList.length}
                    itemSize={50}
                    itemData={sortedRedelegatorList}
                  >
                    {RedelegatorRow}
                  </List>
                </>
              );
            }

            // tab === 2 (Undelegations)
            return isMobile ? (
              <>
                <HeaderMobileWrapper style={{ width }}>
                  <HeaderMobileColumn>Undelegator</HeaderMobileColumn>
                </HeaderMobileWrapper>
                <List
                  width={width}
                  height={height - 70}
                  itemCount={sortedUndelegatorList.length}
                  itemSize={68}
                  itemData={sortedUndelegatorList}
                >
                  {UndelegatorRowMobile}
                </List>
              </>
            ) : (
              <>
                <HeaderWrapper style={{ width }}>
                  <HeaderColumn avatar></HeaderColumn>
                  <HeaderColumn>Undelegator</HeaderColumn>
                  <HeaderColumn>Amount</HeaderColumn>
                  <HeaderColumn>Linked Until</HeaderColumn>
                </HeaderWrapper>
                <List
                  width={width}
                  height={height - 70}
                  itemCount={sortedUndelegatorList.length}
                  itemSize={50}
                  itemData={sortedUndelegatorList}
                >
                  {UndelegatorRow}
                </List>
              </>
            );
          }}
        </AutoSizer>
      </DelegatorList>
    </DelegatorsCardWrapper>
  );
};

export default React.memo(DelegatorsCard);
