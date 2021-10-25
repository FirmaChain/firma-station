import React, { useEffect } from "react";
import numeral from "numeral";
import AutoSizer from "react-virtualized-auto-sizer";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import styled from "styled-components";

import { walletActions } from "redux/action";

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
  &:nth-child(1) {
    text-align: center;
    flex: 1 1 200px;
  }
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    text-align: center;
    flex: 1 1 300px;
  }
`;

const ItemWrapper = styled(RowWrapper)`
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #444;
`;

const ItemColumn = styled(Column)``;

const HeaderWrapper = styled(RowWrapper)`
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #444;
`;

const HeaderColumn = styled(Column)`
  color: #ddd;
`;

const ListWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const ProfileImage = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-color: gray;
  margin-top: 10px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  float: left;
  ${(props) => props.src && `background-image:url('${props.src}')`}
`;
const MonikerTypo = styled.div`
  margin-left: 10px;
  float: left;
`;

const Row = ({ data, index, style }) => {
  const currentValidator = data[index];

  return (
    <Link
      to={{ pathname: `/staking/validators/${currentValidator.validatorAddress}` }}
      onClick={() => {
        walletActions.handleWalletSelectValidator(currentValidator.validatorAddress);
      }}
    >
      <ItemWrapper style={style}>
        <ItemColumn>{index + 1}</ItemColumn>
        <ItemColumn>
          <ProfileImage src={currentValidator.validatorAvatar} />
          <MonikerTypo>{currentValidator.validatorMoniker}</MonikerTypo>
        </ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.votingPowerPercent).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.selfPercent).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.commission).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.condition).format("0,0.00")} %`}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const Validators = ({ validatorsState }) => {
  useEffect(() => {
    walletActions.handleWalletSelectValidator("");
  }, [validatorsState]);

  return (
    <ListWrapper>
      <AutoSizer>
        {({ height, width }) => (
          <>
            <HeaderWrapper style={{ width }}>
              <HeaderColumn>No</HeaderColumn>
              <HeaderColumn>Moniker</HeaderColumn>
              <HeaderColumn>Voting Power</HeaderColumn>
              <HeaderColumn>Self Delegation</HeaderColumn>
              <HeaderColumn>Validator Commission</HeaderColumn>
              <HeaderColumn>UpTime</HeaderColumn>
            </HeaderWrapper>
            <List
              width={width}
              height={height - 70}
              itemCount={validatorsState.validators.length}
              itemSize={50}
              itemData={validatorsState.validators}
            >
              {Row}
            </List>
          </>
        )}
      </AutoSizer>
    </ListWrapper>
  );
};

export default Validators;
