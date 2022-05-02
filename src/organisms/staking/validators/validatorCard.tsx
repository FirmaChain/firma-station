import React from "react";
import { useSnackbar } from "notistack";

import { IValidatorsState } from "../hooks";
import { EXPLORER_URI } from "../../../config";

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
  LinkTypo,
  AddressInfo,
  AddressWrapper,
  AddressInfoLabel,
  AddressInfoValue,
  CopyIconImg,
  LeftWrapper,
} from "./styles";
import { convertNumberFormat, convertToFctNumber, copyToClipboard, makeDecimalPoint } from "../../../utils/common";

interface IProps {
  validatorsState: IValidatorsState;
}

const ValidatorCard = ({ validatorsState }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const getValidatorAddress = () => {
    return window.location.pathname.replace("/staking/validators/", "");
  };

  const [targetValidatorData] = validatorsState.validators.filter(
    (value) => value.validatorAddress === getValidatorAddress()
  );

  const clipboard = (value: string) => {
    copyToClipboard(value);

    enqueueSnackbar("Copied", {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

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
    <ValidatorCardWrapper>
      {targetValidatorData && (
        <>
          <ProfileWrapper>
            <LeftWrapper>
              <ProfileImageWrap>
                <ProfileImage src={targetValidatorData.validatorAvatar} />
              </ProfileImageWrap>
              <DescriptionWrap>
                <NameTypo>{targetValidatorData.validatorMoniker}</NameTypo>
                <DescriptionTypo>
                  <div>{targetValidatorData.validatorDetail}</div>
                  {targetValidatorData.validatorWebsite && (
                    <LinkTypo href={targetValidatorData.validatorWebsite} target="_blank">
                      {targetValidatorData.validatorWebsite}
                    </LinkTypo>
                  )}
                </DescriptionTypo>
              </DescriptionWrap>
            </LeftWrapper>

            <AddressInfo>
              <AddressWrapper>
                <AddressInfoLabel>Operator Address</AddressInfoLabel>
                <AddressInfoValue
                  onClick={() => window.open(`${EXPLORER_URI}/validators/${targetValidatorData.validatorAddress}`)}
                >
                  {targetValidatorData.validatorAddress}
                </AddressInfoValue>
                <CopyIconImg onClick={() => clipboard(targetValidatorData.validatorAddress)} />
              </AddressWrapper>
              <AddressWrapper>
                <AddressInfoLabel>Account Address</AddressInfoLabel>
                <AddressInfoValue
                  onClick={() => window.open(`${EXPLORER_URI}/accounts/${targetValidatorData.selfDelegateAddress}`)}
                >
                  {targetValidatorData.selfDelegateAddress}
                </AddressInfoValue>
                <CopyIconImg onClick={() => clipboard(targetValidatorData.selfDelegateAddress)} />
              </AddressWrapper>
            </AddressInfo>
          </ProfileWrapper>
          <StatusWrapper>
            <StatusItem>
              <StatusTitle>Voting Power</StatusTitle>
              <StatusContent>{`${convertNumberFormat(targetValidatorData.votingPowerPercent, 2)} %`}</StatusContent>
              <StatusSubContent>{`${convertNumberFormat(targetValidatorData.votingPower, 2)} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Self-delegation</StatusTitle>
              <StatusContent>{`${convertNumberFormat(targetValidatorData.selfPercent, 2)} %`}</StatusContent>
              <StatusSubContent>{`${convertNumberFormat(
                convertToFctNumber(targetValidatorData.self),
                2
              )} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Commission</StatusTitle>
              <StatusContent>{`${convertNumberFormat(targetValidatorData.commission, 2)} %`}</StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>
                Uptime <span style={{ fontSize: "12px" }}>(Last 10k blocks)</span>
              </StatusTitle>
              <StatusContent>{`${convertNumberFormat(targetValidatorData.condition, 2)} %`}</StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>
                APR <span style={{ fontSize: "12px" }}>/ APY</span>
              </StatusTitle>
              <StatusContent style={{ color: "#f4b017" }}>{`${formatCash(
                targetValidatorData.APR * 100
              )} %`}</StatusContent>
              <StatusSubContent>{`${formatCash(targetValidatorData.APY * 100)} %`}</StatusSubContent>
            </StatusItem>
          </StatusWrapper>
        </>
      )}
    </ValidatorCardWrapper>
  );
};

export default React.memo(ValidatorCard);
