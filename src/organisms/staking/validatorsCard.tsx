import React, { useEffect } from "react";
import numeral from "numeral";
import AutoSizer from "react-virtualized-auto-sizer";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";

import { IValidatorsState } from "./hooks";
import { walletActions } from "../../redux/action";

import { ItemWrapper, ItemColumn, HeaderWrapper, HeaderColumn, ListWrapper, ProfileImage, MonikerTypo } from "./styles";

interface IProps {
  validatorsState: IValidatorsState;
}

const Row = ({ data, index, style }: any) => {
  const currentValidator = data[index];

  return (
    <Link
      to={{ pathname: `/staking/validators/${currentValidator.validatorAddress}` }}
      onClick={() => {
        //TODO : SELECT VALIDATOR
        // walletActions.handleWalletSelectValidator(currentValidator.validatorAddress);
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

const Validators = ({ validatorsState }: IProps) => {
  useEffect(() => {
    //TODO : SELECT VALIDATOR
    // walletActions.handleWalletSelectValidator("");
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
