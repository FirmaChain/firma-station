import React from 'react';
import { useSnackbar } from 'notistack';

import { EXPLORER_URI, SYMBOL } from '../../../config';

import { IValidator } from '../hooks';
import { convertNumberFormat, copyToClipboard, makeDecimalPoint } from '../../../utils/common';

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
} from './styles';

interface IProps {
  targetValidatorData: IValidator;
}

const ValidatorCard = ({ targetValidatorData }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const clipboard = (value: string) => {
    copyToClipboard(value);

    enqueueSnackbar('Copied', {
      variant: 'success',
      autoHideDuration: 1000,
    });
  };

  const formatCash = (n: any) => {
    let result = '';

    if (n < 1e3) {
      result = makeDecimalPoint(n, 2);
    } else if (n >= 1e3 && n < 1e6) {
      result = +makeDecimalPoint(n / 1e3, 2) + 'K';
    } else if (n >= 1e6 && n < 1e9) {
      result = +makeDecimalPoint(n / 1e6, 2) + 'M';
    } else if (n >= 1e9 && n < 1e12) {
      result = +makeDecimalPoint(n / 1e9, 2) + 'B';
    } else if (n >= 1e12) {
      result = +makeDecimalPoint(n / 1e12, 2) + 'T';
    }

    if (result.length > 10) result = 'infinity';

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
                    <LinkTypo href={targetValidatorData.validatorWebsite} target='_blank'>
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
              <StatusSubContent>{`${convertNumberFormat(
                targetValidatorData.votingPower,
                2
              )} ${SYMBOL}`}</StatusSubContent>
            </StatusItem>
            {/* <StatusItem>
              <StatusTitle>Self-delegation</StatusTitle>
              <StatusContent>{`${convertNumberFormat(targetValidatorData.selfPercent, 2)} %`}</StatusContent>
              <StatusSubContent>{`${convertNumberFormat(
                convertToFctNumber(targetValidatorData.self),
                2
              )} ${SYMBOL}`}</StatusSubContent>
            </StatusItem> */}
            <StatusItem>
              <StatusTitle>Commission</StatusTitle>
              <StatusContent>
                {targetValidatorData.commission === null
                  ? 'N/A'
                  : `${convertNumberFormat(targetValidatorData.commission, 2)} %`}
              </StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>
                Uptime <span style={{ fontSize: '12px' }}>(Last 10k blocks)</span>
              </StatusTitle>
              <StatusContent>{`${convertNumberFormat(targetValidatorData.condition, 2)} %`}</StatusContent>
            </StatusItem>
            <StatusItem>
              <StatusTitle>
                APR <span style={{ fontSize: '12px' }}>/ APY</span>
              </StatusTitle>
              <StatusContent style={{ color: '#f4b017' }}>
                {targetValidatorData.APR === null ? 'N/A' : `${formatCash(targetValidatorData.APR * 100)} %`}
              </StatusContent>
              <StatusSubContent>
                {targetValidatorData.APY === null ? 'N/A' : `${formatCash(targetValidatorData.APY * 100)} %`}
              </StatusSubContent>
            </StatusItem>
          </StatusWrapper>
        </>
      )}
    </ValidatorCardWrapper>
  );
};

export default React.memo(ValidatorCard);
