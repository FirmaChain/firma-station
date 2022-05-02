import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { useMediaQuery } from "react-responsive";
import { FixedSizeList as List } from "react-window";
import { Link } from "react-router-dom";

import { useAvataURL } from "../../header/hooks";
import { IValidatorsState } from "../hooks";
import { convertNumberFormat, convertToFctNumber } from "../../../utils/common";
import { EXPLORER_URI } from "../../../config";

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
        <ItemColumn>{`${convertNumberFormat(convertToFctNumber(currentDelegator.amount), 3)} FCT`}</ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const RowMobile = ({ data, index, style }: any) => {
  const currentDelegator = data[index];
  const { avatarURL, moniker } = useAvataURL(currentDelegator.address);

  return (
    <Link to={{ pathname: `${EXPLORER_URI}/accounts/${currentDelegator.address}` }} target={"_blank"}>
      <ItemMobileWrapper style={style}>
        <ItemMobileColumn>
          <ProfileImage2 src={avatarURL} />
          <DelegatorInfoMobile>
            <div>{`${moniker}`}</div>
            <div>{`${convertNumberFormat(convertToFctNumber(currentDelegator.amount), 3)} FCT`}</div>
          </DelegatorInfoMobile>
        </ItemMobileColumn>
      </ItemMobileWrapper>
    </Link>
  );
};

const DelegatorsCard = ({ validatorsState }: IProps) => {
  const isMobile = useMediaQuery({ query: "(min-width:0px) and (max-width:599px)" });

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
                {isMobile ? (
                  <>
                    <HeaderMobileWrapper style={{ width }}>
                      <HeaderMobileColumn>Delegator</HeaderMobileColumn>
                    </HeaderMobileWrapper>
                    <List
                      width={width}
                      height={height - 70}
                      itemCount={targetValidatorData.delegations.length}
                      itemSize={68}
                      itemData={targetValidatorData.delegations.sort((a: any, b: any) =>
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
              </>
            )}
          </AutoSizer>
        </DelegatorList>
      )}
    </DelegatorsCardWrapper>
  );
};

export default React.memo(DelegatorsCard);
