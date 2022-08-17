import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';
import { convertNumberFormat, convertToFctString, getRestakeStatus } from '../../utils/common';

import { IGrantsDataState, IRestakeState, ITotalDelegateState } from './hooks';

import {
  RestakeListContainer,
  HeaderWrapper,
  HeaderColumn,
  ItemWrapper,
  ItemColumn,
  ProfileImage,
  MonikerTypo,
  StatusBox,
  ItemSmallWrapper,
  ProfileWrapper,
  ProfileImageSmall,
  Moniker,
  ArrowIcon,
  ValidatorInfoList,
  ValidatorInfo,
  InfoLabel,
  InfoValue,
  ButtonWrapper,
  GeneralButton,
  RestakeEmptyWrapper,
  RestakeEmptyTypo,
} from './styles';

interface IProps {
  totalDelegateState: ITotalDelegateState;
  grantsDataState: IGrantsDataState;
  restakeState: IRestakeState;
}

const CustomRow = ({ currentData, index, isSubString }: any) => {
  const getMoniker = (moniker: string) => {
    if (isSubString && moniker.length > 20) {
      return moniker.substring(0, 20) + '...';
    } else {
      return moniker;
    }
  };
  return (
    <Link to={{ pathname: `/staking/validators/${currentData.validatorAddress}` }}>
      <ItemWrapper>
        <ItemColumn>{index + 1}</ItemColumn>
        <ItemColumn>
          <ProfileImage src={currentData.validatorAvatar} />
          <MonikerTypo>{getMoniker(currentData.validatorMoniker)}</MonikerTypo>
        </ItemColumn>
        <ItemColumn>{currentData.amount}&nbsp;&nbsp;</ItemColumn>
        <ItemColumn>{currentData.reward}&nbsp;&nbsp;</ItemColumn>
        <ItemColumn>
          <StatusBox status={currentData.status}>{getRestakeStatus(currentData.status)}</StatusBox>
        </ItemColumn>
      </ItemWrapper>
    </Link>
  );
};

const CustomSmallRow = ({ currentData, index }: any) => {
  const getMoniker = (moniker: string) => {
    if (moniker.length > 30) {
      return moniker.substring(0, 30) + '...';
    } else {
      return moniker;
    }
  };
  return (
    <Link to={{ pathname: `/staking/validators/${currentData.validatorAddress}` }}>
      <ItemSmallWrapper>
        <ProfileWrapper>
          <ProfileImageSmall src={currentData.validatorAvatar}></ProfileImageSmall>
          <Moniker>{getMoniker(currentData.validatorMoniker)}</Moniker>
          <ArrowIcon>〉</ArrowIcon>
        </ProfileWrapper>
        <ValidatorInfoList>
          <ValidatorInfo>
            <InfoLabel>Reward</InfoLabel>
            <InfoValue> {currentData.reward}</InfoValue>
          </ValidatorInfo>
          <ValidatorInfo>
            <InfoLabel>Restake Status</InfoLabel>
            <InfoValue>
              <StatusBox status={currentData.status}>{getRestakeStatus(currentData.status)}</StatusBox>
            </InfoValue>
          </ValidatorInfo>
        </ValidatorInfoList>
      </ItemSmallWrapper>
    </Link>
  );
};

const RestakeList = ({ totalDelegateState, grantsDataState, restakeState }: IProps) => {
  const isSmall = useMediaQuery({ query: '(max-width: 900px)' });
  const isSubString = useMediaQuery({ query: '(max-width: 1800px)' });
  const { isLedger } = useSelector((state: rootState) => state.wallet);

  const [restakeDataList, setRestakeDataList] = useState<any>([]);
  const [isActiveRestake, setActiveRestake] = useState(false);
  const [isAvailable, setAvailable] = useState(false);

  useEffect(() => {
    setAvailable(totalDelegateState.delegateList.length + grantsDataState.allowValidatorList.length > 0);
    setRestakeDataList(getParseRestakeDataList(totalDelegateState, grantsDataState));
    setActiveRestake(grantsDataState.allowValidatorList.length > 0);
  }, [totalDelegateState, grantsDataState]); // eslint-disable-line react-hooks/exhaustive-deps

  const getParseRestakeDataList = (totalDelegateState: ITotalDelegateState, grantsDataState: IGrantsDataState) => {
    let result = [];
    for (let delegate of totalDelegateState.delegateList) {
      let grantTarget = null;
      for (let grant of grantsDataState.allowValidatorList) {
        if (delegate.validatorAddress === grant.validatorAddress) {
          grantTarget = grant;
          break;
        }
      }

      result.push({
        validatorAddress: delegate.validatorAddress,
        validatorMoniker: delegate.moniker,
        validatorAvatar: delegate.avatarURL,
        status: grantTarget === null ? 0 : 1,
        amount: `${convertNumberFormat(convertToFctString(delegate.amount), 3)} FCT`,
        reward: `${convertNumberFormat(convertToFctString(delegate.rewards), 3)} FCT`,
      });
    }

    for (let grant of grantsDataState.allowValidatorList) {
      let isDuplicate = false;
      for (let data of result) {
        if (data.validatorAddress === grant.validatorAddress) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate === false) {
        result.push({
          validatorAddress: grant.validatorAddress,
          validatorMoniker: grant.moniker,
          validatorAvatar: grant.avatarURL,
          status: 2,
          amount: '0 FCT',
          reward: '0 FCT',
        });
      }
    }

    return result;
  };

  const onClickEnable = () => {
    if (isLedger) return;

    const validatorAddressList = restakeDataList.map((data: any) => data.validatorAddress);

    modalActions.handleModalData({
      validatorAddressList: validatorAddressList,
      isActiveRestake: false,
    });

    modalActions.handleModalRestake(true);
  };

  const onClickSetting = () => {
    const validatorAddressList = restakeDataList.map((data: any) => data.validatorAddress);
    const frequency = restakeState.frequency;
    const minimumRewards = restakeState.minimumRewards;
    const totalDelegated = totalDelegateState.totalDelegated;
    const totalRewards = totalDelegateState.totalRewards;

    modalActions.handleModalData({
      validatorAddressList,
      frequency,
      minimumRewards,
      totalDelegated,
      totalRewards,
      isActiveRestake: true,
    });

    modalActions.handleModalRestake(true);
  };

  return (
    <RestakeListContainer>
      {isAvailable ? (
        <>
          <ButtonWrapper>
            {isActiveRestake ? (
              <GeneralButton active={true} onClick={onClickSetting}>
                Setting
              </GeneralButton>
            ) : (
              <GeneralButton active={isLedger === false} onClick={onClickEnable}>
                Enable
              </GeneralButton>
            )}
          </ButtonWrapper>
          <HeaderWrapper>
            <HeaderColumn>No</HeaderColumn>
            <HeaderColumn>Validator</HeaderColumn>
            <HeaderColumn>Delegated&nbsp;&nbsp;</HeaderColumn>
            <HeaderColumn>Reward&nbsp;&nbsp;</HeaderColumn>
            <HeaderColumn>Grant Status</HeaderColumn>
          </HeaderWrapper>
          {restakeDataList.map((value: any, index: number) => {
            if (isSmall) {
              return <CustomSmallRow key={index} currentData={value} index={index} />;
            } else {
              return <CustomRow key={index} currentData={value} index={index} isSubString={isSubString} />;
            }
          })}
        </>
      ) : (
        <RestakeEmptyWrapper>
          <RestakeEmptyTypo>There are no delegation currently in progress.</RestakeEmptyTypo>
        </RestakeEmptyWrapper>
      )}
    </RestakeListContainer>
  );
};

export default React.memo(RestakeList);
