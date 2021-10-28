import React from "react";
import numeral from "numeral";

import { IValidatorsState } from "../hooks";

import {
  ValidatorCardWrapper,
  ProfileWrapper,
  StatusWrapper,
  ProfileImageWrap,
  ProfileImage,
  DescriptionWrap,
  NameTypo,
  DescriptionTypo,
  StatusItem,
  StatusTitle,
  StatusContent,
  StatusSubContent,
} from "./styles";
import { convertToFctNumber } from "../../../utils/common";

interface IProps {
  validatorsState: IValidatorsState;
}

const ValidatorCard = ({ validatorsState }: IProps) => {
  const getValidatorAddress = () => {
    return window.location.pathname.replace("/staking/validators/", "");
  };

  const [targetValidatorData] = validatorsState.validators.filter(
    (value) => value.validatorAddress === getValidatorAddress()
  );

  return (
    <ValidatorCardWrapper>
      {targetValidatorData && (
        <>
          <ProfileWrapper>
            <ProfileImageWrap>
              <ProfileImage src={targetValidatorData.validatorAvatar} />
            </ProfileImageWrap>
            <DescriptionWrap>
              <NameTypo>{targetValidatorData.validatorMoniker}</NameTypo>
              <DescriptionTypo>{targetValidatorData.validatorDetail}</DescriptionTypo>
            </DescriptionWrap>
          </ProfileWrapper>
          <StatusWrapper>
            <StatusItem>
              <StatusTitle>Voting Power</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.votingPowerPercent * 1).format("0.00")} %`}</StatusContent>
              <StatusSubContent>{`${numeral(targetValidatorData.votingPower).format("0,0.00")} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Self-delegation</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.selfPercent * 1).format("0.00")} %`}</StatusContent>
              <StatusSubContent>{`${numeral(convertToFctNumber(targetValidatorData.self)).format(
                "0,0.00"
              )} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Commission</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.commission * 1).format("0.00")} %`}</StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Uptime</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.condition * 1).format("0.00")} %`}</StatusContent>
            </StatusItem>
          </StatusWrapper>
        </>
      )}
    </ValidatorCardWrapper>
  );
};

export default React.memo(ValidatorCard);
