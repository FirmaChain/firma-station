import React from "react";
import numeral from "numeral";
import styled from "styled-components";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

const CardWrapper = styled.div`
  display: flex;
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.backgroundSideBar};
  flex-direction: column;
`;

const DelegatorList = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
`;

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: nowrap;
`;

const Column = styled.div`
  width: 100%;
  & {
    flex: 1 1 100%;
  }
  &:nth-child(2) {
    text-align: right;
    padding-right: 30px;
  }
`;

const ItemWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

const ItemColumn = styled(Column)``;

const HeaderWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

const HeaderColumn = styled(Column)`
  color: #ddd;
`;

const Row = ({ data, index, style }) => {
  const currentDelegator = data[index];

  return (
    <ItemWrapper style={style}>
      <ItemColumn>{currentDelegator.address}</ItemColumn>
      <ItemColumn>{`${numeral(currentDelegator.amount / 1000000).format("0,0.000")} FCT`}</ItemColumn>
    </ItemWrapper>
  );
};

const DelegatorsCard = ({ validatorsState }) => {
  const getValidatorAddress = () => {
    return window.location.pathname.replace("/staking/validators/", "");
  };

  const [targetValidatorData] = validatorsState.validators.filter(
    (value) => value.validatorAddress === getValidatorAddress()
  );

  return (
    <CardWrapper>
      {targetValidatorData && (
        <DelegatorList>
          <AutoSizer>
            {({ height, width }) => (
              <>
                <HeaderWrapper style={{ width }}>
                  <HeaderColumn>Address</HeaderColumn>
                  <HeaderColumn>Amount</HeaderColumn>
                </HeaderWrapper>
                <List
                  width={width}
                  height={height - 70}
                  itemCount={targetValidatorData.delegations.length}
                  itemSize={50}
                  itemData={targetValidatorData.delegations.sort((a, b) =>
                    a.amount > b.amount ? -1 : a.amount < b.amount ? 0 : 1
                  )}
                >
                  {Row}
                </List>
              </>
            )}
          </AutoSizer>
        </DelegatorList>
      )}
      {/* 
      {targetValidatorData && (
        <DelegatorList>
          <DelegatorWrapper>
            <DelegatorAddressHeader>Address</DelegatorAddressHeader>
            <DelegatorAmountHeader>Amount</DelegatorAmountHeader>
          </DelegatorWrapper>
          {targetValidatorData.delegations
            .sort((a, b) =>
              numeral(a.amount).value() > numeral(b.amount).value()
                ? -1
                : numeral(a.amount).value() < numeral(b.amount).value()
                ? 1
                : 0
            )
            .map((delegator, index) => (
              <DelegatorWrapper key={index}>
                <DelegatorAddress>{delegator.address}</DelegatorAddress>
                <DelegatorAmount>{numeral(delegator.amount / 1000000).format("0,00.000")} FCT</DelegatorAmount>
              </DelegatorWrapper>
            ))}
        </DelegatorList>
      )} */}
    </CardWrapper>
  );
};

export default DelegatorsCard;
