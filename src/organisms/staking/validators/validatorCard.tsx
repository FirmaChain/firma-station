import React from "react";
import numeral from "numeral";
import { useSnackbar } from "notistack";

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
  LinkTypo,
  AddressInfo,
  AddressWrapper,
  AddressInfoLabel,
  AddressInfoValue,
  CopyIconImg,
  LeftWrapper,
} from "./styles";
import { convertToFctNumber, copyToClipboard } from "../../../utils/common";

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
    if (n < 1e3) return n.toFixed(2);
    if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(2) + "K";
    if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(2) + "M";
    if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(2) + "B";
    if (n >= 1e12) return +(n / 1e12).toFixed(2) + "T";
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
                <AddressInfoValue>{targetValidatorData.validatorAddress}</AddressInfoValue>
                <CopyIconImg onClick={() => clipboard(targetValidatorData.validatorAddress)} />
              </AddressWrapper>
              <AddressWrapper>
                <AddressInfoLabel>Account Address</AddressInfoLabel>
                <AddressInfoValue>{targetValidatorData.selfDelegateAddress}</AddressInfoValue>
                <CopyIconImg onClick={() => clipboard(targetValidatorData.selfDelegateAddress)} />
              </AddressWrapper>
            </AddressInfo>
          </ProfileWrapper>
          <StatusWrapper>
            <StatusItem>
              <StatusTitle>Voting Power</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.votingPowerPercent).format("0.00")} %`}</StatusContent>
              <StatusSubContent>{`${numeral(targetValidatorData.votingPower).format("0,0.00")} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Self-delegation</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.selfPercent).format("0.00")} %`}</StatusContent>
              <StatusSubContent>{`${numeral(convertToFctNumber(targetValidatorData.self)).format(
                "0,0.00"
              )} FCT`}</StatusSubContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>Commission</StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.commission).format("0.00")} %`}</StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>
                Uptime <span style={{ fontSize: "12px" }}>(Last 100 blocks)</span>
              </StatusTitle>
              <StatusContent>{`${numeral(targetValidatorData.condition).format("0.00")} %`}</StatusContent>
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
