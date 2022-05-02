import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";

import { IValidatorsState } from "./hooks";
import { convertNumber, convertNumberFormat, makeDecimalPoint } from "../../utils/common";

import {
  ItemWrapper,
  ItemSmallWrapper,
  ItemColumn,
  HeaderWrapper,
  HeaderColumn,
  ListWrapper,
  ProfileImage,
  MonikerTypo,
  APYTypo,
  APRTypo,
  APYTypoSmall,
  APRTypoSmall,
  ProfileImageSmall,
  Moniker,
  ProfileWrapper,
  ArrowIcon,
  ValidatorInfoList,
  ValidatorInfo,
  InfoLabel,
  InfoValue,
  SmallTitle,
  SortArrow,
} from "./styles";

interface IProps {
  validatorsState: IValidatorsState;
}

const CustomRow = ({ currentValidator, index }: any) => {
  const formatCash = (n: any) => {
    let result = "";

    if (n < 1e3) {
      result = makeDecimalPoint(n, 2);
    } else if (n >= 1e3 && n < 1e6) {
      result = +makeDecimalPoint(n / 1e3, 2) + "K";
    } else if (n >= 1e6 && n < 1e9) {
      result = +makeDecimalPoint(n / 1e6, 2) + "M";
    } else if (n >= 1e9 && n < 1e12) {
      result = +makeDecimalPoint(n / 1e9, 2) + "B";
    } else if (n >= 1e12) {
      result = +makeDecimalPoint(n / 1e12, 2) + "T";
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
        <ItemColumn>{`${convertNumberFormat(currentValidator.votingPowerPercent, 2)} %`}</ItemColumn>
        <ItemColumn>{`${convertNumberFormat(currentValidator.selfPercent, 2)} %`}</ItemColumn>
        <ItemColumn>{`${convertNumberFormat(currentValidator.commission, 2)} %`}</ItemColumn>
        <ItemColumn>{`${convertNumberFormat(currentValidator.condition, 2)} %`}</ItemColumn>
        <ItemColumn>
          <APRTypo>{`${formatCash(currentValidator.APR * 100)} %`}</APRTypo>

          <APYTypo>{`${formatCash(currentValidator.APY * 100)} %`}</APYTypo>
        </ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const CustomSmallRow = ({ currentValidator, index }: any) => {
  const formatCash = (n: any) => {
    let result = "";

    if (n < 1e3) {
      result = makeDecimalPoint(n, 2);
    } else if (n >= 1e3 && n < 1e6) {
      result = +makeDecimalPoint(n / 1e3, 2) + "K";
    } else if (n >= 1e6 && n < 1e9) {
      result = +makeDecimalPoint(n / 1e6, 2) + "M";
    } else if (n >= 1e9 && n < 1e12) {
      result = +makeDecimalPoint(n / 1e9, 2) + "B";
    } else if (n >= 1e12) {
      result = +makeDecimalPoint(n / 1e12, 2) + "T";
    }

    if (result.length > 10) result = "infinity";

    return result;
  };

  return (
    <Link to={{ pathname: `/staking/validators/${currentValidator.validatorAddress}` }}>
      <ItemSmallWrapper>
        <ProfileWrapper>
          <ProfileImageSmall src={currentValidator.validatorAvatar}></ProfileImageSmall>
          <Moniker>{currentValidator.validatorMoniker}</Moniker>
          <ArrowIcon>〉</ArrowIcon>
        </ProfileWrapper>
        <ValidatorInfoList>
          <ValidatorInfo>
            <InfoLabel>Voting Power</InfoLabel>
            <InfoValue>{`${convertNumberFormat(currentValidator.votingPowerPercent, 2)} %`}</InfoValue>
          </ValidatorInfo>
          <ValidatorInfo>
            <InfoLabel>Self Delegation</InfoLabel>
            <InfoValue>{`${convertNumberFormat(currentValidator.selfPercent, 2)} %`}</InfoValue>
          </ValidatorInfo>
          <ValidatorInfo>
            <InfoLabel>Commission</InfoLabel>
            <InfoValue>{`${convertNumberFormat(currentValidator.commission, 2)} %`}</InfoValue>
          </ValidatorInfo>
          <ValidatorInfo>
            <InfoLabel>Uptime</InfoLabel>
            <InfoValue>{`${convertNumberFormat(currentValidator.condition, 2)} %`}</InfoValue>
          </ValidatorInfo>
          <ValidatorInfo>
            <InfoLabel>APR/APY</InfoLabel>
            <InfoValue>
              <APRTypoSmall>{`${formatCash(currentValidator.APR * 100)} % /`}&nbsp;</APRTypoSmall>
              <APYTypoSmall>{`${formatCash(currentValidator.APY * 100)} %`}</APYTypoSmall>
            </InfoValue>
          </ValidatorInfo>
        </ValidatorInfoList>
      </ItemSmallWrapper>
    </Link>
  );
};

const Validators = ({ validatorsState }: IProps) => {
  const isSmall = useMediaQuery({ query: "(max-width: 900px)" });

  const [order, setOrder] = useState(1);
  const [orderBy, setOrderBy] = useState(1);

  const getOrderByFunction = () => {
    switch (orderBy) {
      case 0:
        return sortMoniker;
      case 1:
        return sortVotingPower;
      case 2:
        return sortSelf;
      case 3:
        return sortCommission;
      case 4:
        return sortUptime;
      case 5:
        return sortAPR;
    }
  };

  const changeOrder = (orderByIndex: number) => {
    if (orderBy !== orderByIndex) {
      setOrderBy(orderByIndex);
      setOrder(0);
    } else {
      setOrder(order === 0 ? 1 : 0);
    }
  };

  const sortMoniker = (a: any, b: any) => {
    if (a.validatorMoniker < b.validatorMoniker) {
      return order === 0 ? -1 : 1;
    } else if (a.validatorMoniker > b.validatorMoniker) {
      return order === 0 ? 1 : -1;
    } else {
      return 0;
    }
  };

  const sortVotingPower = (a: any, b: any) => {
    if (convertNumber(a.votingPowerPercent) < convertNumber(b.votingPowerPercent)) {
      return order === 0 ? -1 : 1;
    } else if (convertNumber(a.votingPowerPercent) > convertNumber(b.votingPowerPercent)) {
      return order === 0 ? 1 : -1;
    } else {
      if (a.validatorMoniker < b.validatorMoniker) {
        return -1;
      } else if (a.validatorMoniker > b.validatorMoniker) {
        return 1;
      } else {
        return 0;
      }
    }
  };

  const subSortMoniker = (a: any, b: any) => {
    if (a.validatorMoniker < b.validatorMoniker) {
      return -1;
    } else if (a.validatorMoniker > b.validatorMoniker) {
      return 1;
    } else {
      return 0;
    }
  };

  const sortSelf = (a: any, b: any) => {
    if (convertNumber(a.selfPercent) < convertNumber(b.selfPercent)) {
      return order === 0 ? -1 : 1;
    } else if (convertNumber(a.selfPercent) > convertNumber(b.selfPercent)) {
      return order === 0 ? 1 : -1;
    } else {
      return subSortMoniker(a, b);
    }
  };

  const sortCommission = (a: any, b: any) => {
    if (a.commission < b.commission) {
      return order === 0 ? -1 : 1;
    } else if (a.commission > b.commission) {
      return order === 0 ? 1 : -1;
    } else {
      return subSortMoniker(a, b);
    }
  };

  const sortUptime = (a: any, b: any) => {
    if (a.condition < b.condition) {
      return order === 0 ? -1 : 1;
    } else if (a.condition > b.condition) {
      return order === 0 ? 1 : -1;
    } else {
      return subSortMoniker(a, b);
    }
  };

  const sortAPR = (a: any, b: any) => {
    if (a.commission < b.commission) {
      return order === 0 ? 1 : -1;
    } else if (a.commission > b.commission) {
      return order === 0 ? -1 : 1;
    } else {
      return subSortMoniker(a, b);
    }
  };

  return (
    <ListWrapper>
      <HeaderWrapper>
        <HeaderColumn>No</HeaderColumn>
        <HeaderColumn onClick={() => changeOrder(0)}>
          Validator
          <SortArrow order={order} orderBy={orderBy} index={0} />
        </HeaderColumn>
        <HeaderColumn onClick={() => changeOrder(1)}>
          Voting Power
          <SortArrow order={order} orderBy={orderBy} index={1} />
        </HeaderColumn>
        <HeaderColumn onClick={() => changeOrder(2)}>
          Self Delegation
          <SortArrow order={order} orderBy={orderBy} index={2} />
        </HeaderColumn>
        <HeaderColumn onClick={() => changeOrder(3)}>
          Commission
          <SortArrow order={order} orderBy={orderBy} index={3} />
        </HeaderColumn>
        <HeaderColumn onClick={() => changeOrder(4)}>
          UpTime
          <SortArrow order={order} orderBy={orderBy} index={4} />
        </HeaderColumn>
        <HeaderColumn onClick={() => changeOrder(5)}>
          APR / APY
          <SortArrow order={order} orderBy={orderBy} index={5} />
        </HeaderColumn>
      </HeaderWrapper>
      {isSmall && <SmallTitle>Validators</SmallTitle>}
      {validatorsState.validators.sort(getOrderByFunction()).map((value, index) => {
        if (isSmall) {
          return <CustomSmallRow key={index} currentValidator={value} index={index} />;
        } else {
          return <CustomRow key={index} currentValidator={value} index={index} />;
        }
      })}
    </ListWrapper>
  );
};

export default React.memo(Validators);
