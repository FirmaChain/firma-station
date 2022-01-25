import React from "react";
import numeral from "numeral";
import { Link } from "react-router-dom";

import { IValidatorsState } from "./hooks";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import {
  ItemWrapper,
  ItemColumn,
  HeaderWrapper,
  HeaderColumn,
  ListWrapper,
  ProfileImage,
  MonikerTypo,
  APYTypo,
  APRTypo,
} from "./styles";

interface IProps {
  validatorsState: IValidatorsState;
}

const CustomRow = ({ currentValidator, index }: any) => {
  const formatCash = (n: any) => {
    let result = "";

    if (n < 1e3) {
      result = n.toFixed(2);
    } else if (n >= 1e3 && n < 1e6) {
      result = +(n / 1e3).toFixed(2) + "K";
    } else if (n >= 1e6 && n < 1e9) {
      result = +(n / 1e6).toFixed(2) + "M";
    } else if (n >= 1e9 && n < 1e12) {
      result = +(n / 1e9).toFixed(2) + "B";
    } else if (n >= 1e12) {
      result = +(n / 1e12).toFixed(2) + "T";
    }

    if (result.length > 10) result = "infinity";

    return result;
  };

  return (
    <Link to={{ pathname: `/staking/validators/${currentValidator.validatorAddress}` }}>
      <ItemWrapper>
        <ItemColumn>{index + 1}</ItemColumn>
        <ItemColumn>
          <ProfileImage src={currentValidator.validatorAvatar} />
          <MonikerTypo>{currentValidator.validatorMoniker}</MonikerTypo>
        </ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.votingPowerPercent).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.selfPercent).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.commission).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>{`${numeral(currentValidator.condition).format("0,0.00")} %`}</ItemColumn>
        <ItemColumn>
          <APRTypo>{`${formatCash(currentValidator.APR * 100)} %`}</APRTypo>

          <APYTypo>{`${formatCash(currentValidator.APY * 100)} %`}</APYTypo>
        </ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const Validators = ({ validatorsState }: IProps) => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height={"100%"}>
      <ListWrapper>
        <HeaderWrapper>
          <HeaderColumn>No</HeaderColumn>
          <HeaderColumn>Moniker</HeaderColumn>
          <HeaderColumn>Voting Power</HeaderColumn>
          <HeaderColumn>Self Delegation</HeaderColumn>
          <HeaderColumn>Commission</HeaderColumn>
          <HeaderColumn>UpTime</HeaderColumn>
          <HeaderColumn>APR / APY</HeaderColumn>
        </HeaderWrapper>
        {validatorsState.validators.map((value, index) => (
          <CustomRow key={index} currentValidator={value} index={index} />
        ))}
      </ListWrapper>
    </BlankCard>
  );
};

export default React.memo(Validators);
