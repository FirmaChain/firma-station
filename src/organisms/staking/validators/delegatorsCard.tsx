import React from "react";
import numeral from "numeral";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

import { useAvataURL } from "../../header/hooks";
import { IValidatorsState } from "../hooks";
import { convertToFctNumber } from "../../../utils/common";
import { EXPLORER_URI } from "../../../config";

import {
  DelegatorsCardWrapper,
  DelegatorList,
  ItemWrapper,
  ItemColumn,
  HeaderWrapper,
  HeaderColumn,
  ProfileImage2,
} from "./styles";

interface IProps {
  validatorsState: IValidatorsState;
}

const Row = ({ data, index, style }: any) => {
  const currentDelegator = data[index];
  const { avatarURL, moniker } = useAvataURL(currentDelegator.address);

  return (
    <Link to={{ pathname: `${EXPLORER_URI}/accounts/${currentDelegator.address}` }} target={"_blank"}>
      <ItemWrapper style={style}>
        <ItemColumn>
          <ProfileImage2 src={avatarURL} />
        </ItemColumn>
        <ItemColumn>{`${moniker}`}</ItemColumn>
        <ItemColumn>{`${numeral(convertToFctNumber(currentDelegator.amount)).format("0,0.000")} FCT`}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const DelegatorsCard = ({ validatorsState }: IProps) => {
  const getValidatorAddress = () => {
    return window.location.pathname.replace("/staking/validators/", "");
  };

  const [targetValidatorData] = validatorsState.validators.filter(
    (value: any) => value.validatorAddress === getValidatorAddress()
  );

  return (
    <DelegatorsCardWrapper>
      {targetValidatorData && (
        <DelegatorList>
          <AutoSizer>
            {({ height, width }) => (
              <>
                <HeaderWrapper style={{ width }}>
                  <HeaderColumn></HeaderColumn>
                  <HeaderColumn>Delegator</HeaderColumn>
                  <HeaderColumn>Amount</HeaderColumn>
                </HeaderWrapper>
                <List
                  width={width}
                  height={height - 70}
                  itemCount={targetValidatorData.delegations.length}
                  itemSize={50}
                  itemData={targetValidatorData.delegations.sort((a: any, b: any) =>
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
    </DelegatorsCardWrapper>
  );
};

export default React.memo(DelegatorsCard);
