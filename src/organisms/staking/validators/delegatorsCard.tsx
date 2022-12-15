import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useMediaQuery } from 'react-responsive';
import { FixedSizeList as List } from 'react-window';
import { Link } from 'react-router-dom';

import { convertNumberFormat, convertToFctNumber } from '../../../utils/common';
import { CHAIN_CONFIG } from '../../../config';
import { IDelegationState } from '../../../interfaces/staking';

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
} from './styles';

interface IProps {
  delegateState: IDelegationState;
}

const Row = ({ data, index, style }: any) => {
  const currentDelegator = data[index];

  return (
    <Link
      to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${currentDelegator.delegatorAddress}` }}
      target={'_blank'}
    >
      <ItemWrapper style={style}>
        <ItemColumn>
          <ProfileImage2 src={currentDelegator.avatarURL} />
        </ItemColumn>
        <ItemColumn>{`${currentDelegator.moniker}`}</ItemColumn>
        <ItemColumn>{`${convertNumberFormat(convertToFctNumber(currentDelegator.amount), 3)} ${
          CHAIN_CONFIG.PARAMS.SYMBOL
        }`}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const RowMobile = ({ data, index, style }: any) => {
  const currentDelegator = data[index];

  return (
    <Link
      to={{ pathname: `${CHAIN_CONFIG.EXPLORER_URI}/accounts/${currentDelegator.delegatorAddress}` }}
      target={'_blank'}
    >
      <ItemMobileWrapper style={style}>
        <ItemMobileColumn>
          <ProfileImage2 src={data.avatarURL} />
          <DelegatorInfoMobile>
            <div>{`${data.moniker}`}</div>
            <div>{`${convertNumberFormat(convertToFctNumber(currentDelegator.amount), 3)} ${
              CHAIN_CONFIG.PARAMS.SYMBOL
            }`}</div>
          </DelegatorInfoMobile>
        </ItemMobileColumn>
      </ItemMobileWrapper>
    </Link>
  );
};

const DelegatorsCard = ({ delegateState }: IProps) => {
  const isMobile = useMediaQuery({ query: '(min-width:0px) and (max-width:599px)' });

  return (
    <DelegatorsCardWrapper>
      {delegateState && (
        <DelegatorList>
          <AutoSizer>
            {({ height, width }) => (
              <>
                {isMobile ? (
                  <>
                    <HeaderMobileWrapper style={{ width }}>
                      <HeaderMobileColumn>Delegator</HeaderMobileColumn>
                    </HeaderMobileWrapper>
                    <List
                      width={width}
                      height={height - 70}
                      itemCount={delegateState.delegateList.length}
                      itemSize={68}
                      itemData={delegateState.delegateList.sort((a: any, b: any) =>
                        a.amount > b.amount ? -1 : a.amount < b.amount ? 0 : 1
                      )}
                    >
                      {RowMobile}
                    </List>
                  </>
                ) : (
                  <>
                    <HeaderWrapper style={{ width }}>
                      <HeaderColumn></HeaderColumn>
                      <HeaderColumn>Delegator</HeaderColumn>
                      <HeaderColumn>Amount</HeaderColumn>
                    </HeaderWrapper>
                    <List
                      width={width}
                      height={height - 70}
                      itemCount={delegateState.delegateList.length}
                      itemSize={50}
                      itemData={delegateState.delegateList.sort((a: any, b: any) =>
                        a.amount > b.amount ? -1 : a.amount < b.amount ? 0 : 1
                      )}
                    >
                      {Row}
                    </List>
                  </>
                )}
              </>
            )}
          </AutoSizer>
        </DelegatorList>
      )}
    </DelegatorsCardWrapper>
  );
};

export default React.memo(DelegatorsCard);
