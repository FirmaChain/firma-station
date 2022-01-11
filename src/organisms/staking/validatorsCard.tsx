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
    if (n < 1e3) return n.toFixed(2);
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
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
