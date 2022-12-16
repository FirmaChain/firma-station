import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { ResponsivePie } from '@nivo/pie';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';
import { IGrantsDataState, ITotalStakingState, IRestakeState } from '../../interfaces/staking';
import {
  convertNumber,
  convertNumberFormat,
  convertToFctNumber,
  convertToFctString,
  getRestakeStatus,
  getFeesFromGas,
} from '../../utils/common';
import { CHAIN_CONFIG } from '../../config';
import { getDateTimeFormat } from '../../utils/dateUtil';

import {
  ChartWrapper,
  DelegationListWrapper,
  DelegationHeaderWrapper,
  DelegationHeaderColumn,
  DelegationItemWrapper,
  DelegationItemColumn,
  RedelegationItemWrapper,
  RedelegationItemColumn,
  RedelegationHeaderWrapper,
  RedelegationHeaderColumn,
  UndelegationItemWrapper,
  UndelegationItemColumn,
  UndelegationHeaderWrapper,
  UndelegationHeaderColumn,
  RestakeHeaderWrapper,
  RestakeHeaderColumn,
  RestakeItemWrapper,
  RestakeItemColumn,
  DelegationTab,
  DelegationTabItem,
  TabListItem,
  FlexWrapper,
  ProfileImage2,
  MonikerTypo,
  ChartCenterTypoWrapper,
  ChartCenterTypo,
  ButtonWrapper,
  Button,
  StatusBox,
} from './styles';

interface IProps {
  totalStakingState: ITotalStakingState;
  grantDataState: IGrantsDataState;
}

const Row = ({ data, index, style, totalStakingState }: any) => {
  const validatorInfo = data[index];

  const getReward = (validatorAddress: string) => {
    const reward = totalStakingState.stakingRewardList.filter(
      (reward: any) => reward.validator_address === validatorAddress
    );

    if (reward.length > 0) {
      return convertNumber(convertToFctString(reward[0].amount));
    } else {
      return 0;
    }
  };

  const getDelegateAmount = (amount: number) => {
    return convertToFctNumber(amount);
  };

  const getMoniker = (moniker: string) => {
    return moniker.length > 20 ? `${moniker.substring(0, 20)}...` : moniker;
  };

  return (
    <DelegationItemWrapper style={style}>
      <DelegationItemColumn>
        <Link to={{ pathname: `/staking/validators/${validatorInfo.validatorAddress}` }}>
          <ProfileImage2 src={validatorInfo.avatarURL} />
          <MonikerTypo>{getMoniker(validatorInfo.moniker)}</MonikerTypo>
        </Link>
      </DelegationItemColumn>
      <DelegationItemColumn>{convertNumberFormat(getDelegateAmount(validatorInfo.amount), 3)}</DelegationItemColumn>
      <DelegationItemColumn>≈ {convertNumberFormat(getReward(validatorInfo.validatorAddress), 3)}</DelegationItemColumn>
    </DelegationItemWrapper>
  );
};

const RedelegationRow = ({ data, index, style }: any) => {
  const validatorInfo = data[index];

  const getMoniker = (moniker: string) => {
    return moniker.length > 15 ? `${moniker.substring(0, 15)}...` : moniker;
  };

  return (
    <RedelegationItemWrapper style={style}>
      <RedelegationItemColumn>
        <Link to={{ pathname: `/staking/validators/${validatorInfo.srcAddress}` }}>
          <ProfileImage2 src={validatorInfo.srcAvatarURL} />
          <MonikerTypo>{getMoniker(validatorInfo.srcMoniker)}</MonikerTypo>
        </Link>
      </RedelegationItemColumn>
      <RedelegationItemColumn>
        <Link to={{ pathname: `/staking/validators/${validatorInfo.dstAddress}` }}>
          <ProfileImage2 src={validatorInfo.dstAvatarURL} />
          <MonikerTypo>{getMoniker(validatorInfo.dstMoniker)}</MonikerTypo>
        </Link>
      </RedelegationItemColumn>
      <RedelegationItemColumn>{convertNumberFormat(validatorInfo.balance, 3)}</RedelegationItemColumn>
      <RedelegationItemColumn>{getDateTimeFormat(validatorInfo.completionTime)}</RedelegationItemColumn>
    </RedelegationItemWrapper>
  );
};

const UndelegationRow = ({ data, index, style }: any) => {
  const validatorInfo = data[index];

  const getMoniker = (moniker: string) => {
    return moniker.length > 30 ? `${moniker.substring(0, 30)}...` : moniker;
  };

  return (
    <UndelegationItemWrapper style={style}>
      <UndelegationItemColumn>
        <Link to={{ pathname: `/staking/validators/${validatorInfo.validatorAddress}` }}>
          <ProfileImage2 src={validatorInfo.avatarURL} />
          <MonikerTypo>{getMoniker(validatorInfo.moniker)}</MonikerTypo>
        </Link>
      </UndelegationItemColumn>
      <UndelegationItemColumn>{convertNumberFormat(validatorInfo.balance, 3)}</UndelegationItemColumn>
      <UndelegationItemColumn>{getDateTimeFormat(validatorInfo.completionTime)}</UndelegationItemColumn>
    </UndelegationItemWrapper>
  );
};

const RestakeRow = ({ data, index, style, totalStakingState }: any) => {
  const restakeInfo: IRestakeState = data[index];

  const getMoniker = (moniker: string) => {
    return moniker.length > 12 ? `${moniker.substring(0, 12)}...` : moniker;
  };

  return (
    <RestakeItemWrapper style={style}>
      <RestakeItemColumn>
        <Link to={{ pathname: `/staking/validators/${restakeInfo.validatorAddress}` }}>
          <ProfileImage2 src={restakeInfo.validatorAvatar} />
          <MonikerTypo>{getMoniker(restakeInfo.validatorMoniker)}</MonikerTypo>
        </Link>
      </RestakeItemColumn>
      <RestakeItemColumn>≈ {`${convertNumberFormat(restakeInfo.reward, 3)}`}</RestakeItemColumn>
      <RestakeItemColumn>≈ {`${convertNumberFormat(restakeInfo.latestReward, 3)}`}</RestakeItemColumn>
      <RestakeItemColumn>
        <StatusBox status={restakeInfo.status}>{getRestakeStatus(restakeInfo.status)}</StatusBox>
      </RestakeItemColumn>
    </RestakeItemWrapper>
  );
};

const GetDelegatePieData = (totalStakingState: ITotalStakingState) => {
  const getMonikerFormat = (moniker: string) => {
    if (moniker.length > 20) return moniker.substr(0, 20) + '...';
    else return moniker;
  };

  const result = totalStakingState.delegateList.map((delegate) => {
    const moniker = getMonikerFormat(delegate.moniker);
    const percentValue = (convertToFctNumber(delegate.amount) / totalStakingState.delegated) * 100;
    return {
      id: getMonikerFormat(moniker),
      value: Math.round(percentValue * 100) / 100,
      amount: convertNumberFormat(convertToFctNumber(delegate.amount), 3),
    };
  });

  return result;
};

const DelegationCard = ({ totalStakingState, grantDataState }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { isInit, address } = useSelector((state: rootState) => state.wallet);
  const { balance } = useSelector((state: rootState) => state.user);
  const { withdrawAllValidator, getGasEstimationWithdrawAllValidator } = useFirma();

  const pieData = GetDelegatePieData(totalStakingState);

  const [currentTab, setCurrentTab] = useState(0);
  const [restakeList, setRestakeList] = useState<IRestakeState[]>([]);

  useEffect(() => {
    if (isInit && totalStakingState.delegateList.length > 0) {
      axios
        .get(`${CHAIN_CONFIG.RESTAKE.API}/restake/reward/${address}`)
        .then(({ data }) => {
          const latestRewardList = data;
          setRestakeList(getParseRestakeDataList(totalStakingState, grantDataState, latestRewardList));
        })
        .catch(() => {
          setRestakeList(getParseRestakeDataList(totalStakingState, grantDataState, []));
        });
    }
  }, [totalStakingState, grantDataState]); // eslint-disable-line react-hooks/exhaustive-deps

  const getParseRestakeDataList = (
    totalStakingState: ITotalStakingState,
    grantsDataState: IGrantsDataState,
    latestReward: { validatorAddr: string; rewards: number }[]
  ) => {
    let result = [];
    for (let delegate of totalStakingState.delegateList) {
      let grantTarget = null;
      for (let grant of grantsDataState.allowValidatorList) {
        if (delegate.validatorAddress === grant.operatorAddress) {
          grantTarget = grant;
          break;
        }
      }

      const rewards = totalStakingState.stakingRewardList.find(
        (stakingReward) => stakingReward.validator_address === delegate.validatorAddress
      );

      const latestRewards = latestReward.find(
        (latestReward) => latestReward.validatorAddr === delegate.validatorAddress
      );

      result.push({
        validatorAddress: delegate.validatorAddress,
        validatorMoniker: delegate.moniker,
        validatorAvatar: delegate.avatarURL,
        status: grantTarget === null ? 0 : 1,
        amount: convertToFctNumber(delegate.amount),
        reward: rewards ? convertToFctNumber(rewards.amount) : 0,
        latestReward: latestRewards ? convertToFctNumber(latestRewards.rewards) : 0,
      });
    }

    for (let grant of grantsDataState.allowValidatorList) {
      let isDuplicate = false;
      for (let data of result) {
        if (data.validatorAddress === grant.operatorAddress) {
          isDuplicate = true;
          break;
        }
      }

      if (isDuplicate === false) {
        result.push({
          validatorAddress: grant.operatorAddress,
          validatorMoniker: grant.moniker,
          validatorAvatar: grant.avatarURL,
          status: 2,
          amount: 0,
          reward: 0,
          latestReward: 0,
        });
      }
    }

    return result;
  };

  const withdrawAllValidatorTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    withdrawAllValidator(gas)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const withdrawAllValidatorAction = () => {
    getGasEstimationWithdrawAllValidator()
      .then((gas) => {
        if (convertNumber(balance) > convertToFctNumber(getFeesFromGas(gas))) {
          modalActions.handleModalData({
            action: 'Withdraw',
            data: { amount: totalStakingState.stakingReward, fees: getFeesFromGas(gas), gas },
            txAction: withdrawAllValidatorTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar('Insufficient funds. Please check your account balance.', {
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  const onCLickChangeTab = (index: number) => {
    if (index === 0) {
      setCurrentTab(index);
    } else if (index === 1 && totalStakingState.redelegationList.length > 0) {
      setCurrentTab(index);
    } else if (index === 2 && totalStakingState.undelegationList.length > 0) {
      setCurrentTab(index);
    } else if (index === 3 && totalStakingState.delegateList.length > 0) {
      setCurrentTab(index);
    }
  };

  const onClickWithdrawAll = () => {
    if (totalStakingState.stakingReward > 0) {
      withdrawAllValidatorAction();
    }
  };

  const onClickRestake = () => {
    if (totalStakingState.delegateList.length > 0 && CHAIN_CONFIG.RESTAKE.API) {
      axios
        .get(`${CHAIN_CONFIG.RESTAKE.API}/restake/info`)
        .then(({ data }) => {
          const minimumRewards = data.minimumRewards;
          const nextRoundTime = data.nextRoundDateTime;
          const round = data.round;
          const isActiveRestake = grantDataState.allowValidatorList.length > 0;
          const validatorAddressList = restakeList.map((data: any) => data.validatorAddress);
          const totalDelegated = totalStakingState.delegateList.reduce((acc: any, obj: any) => acc + obj.amount, 0);
          const totalRewards = totalStakingState.stakingRewardList.reduce(
            (acc: any, obj: any) => acc + convertNumber(obj.amount),
            0
          );

          modalActions.handleModalData({
            validatorAddressList,
            restakeList,
            isActiveRestake,
            minimumRewards,
            round,
            nextRoundTime,
            totalDelegated,
            totalRewards,
          });
          modalActions.handleModalRestake(true);
        })
        .catch((error) => {});
    }
  };

  return (
    <FlexWrapper>
      <ChartWrapper>
        <ChartCenterTypoWrapper>
          <ChartCenterTypo>Delegated</ChartCenterTypo>
          <ChartCenterTypo>{convertNumberFormat(totalStakingState.delegated, 3)}</ChartCenterTypo>
        </ChartCenterTypoWrapper>
        <ResponsivePie
          data={pieData}
          margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
          innerRadius={0.75}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'dark2' }}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
          enableArcLabels={false}
          arcLinkLabel={function (e) {
            return e.id + '\n[' + e.value + '%]';
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor='#fff'
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          tooltip={function (e) {
            const t = e.datum;
            return <div style={{ backgroundColor: '#eee', padding: '10px', borderRadius: '4px' }}>{t.data.amount}</div>;
          }}
          legends={[]}
        />
      </ChartWrapper>
      <DelegationListWrapper>
        <DelegationTab>
          <DelegationTabItem isActive={currentTab === 0} onClick={() => onCLickChangeTab(0)}>
            Delegations ({totalStakingState.delegateList.length})
          </DelegationTabItem>
          <DelegationTabItem isActive={currentTab === 1} onClick={() => onCLickChangeTab(1)}>
            Redelegations ({totalStakingState.redelegationList.length})
          </DelegationTabItem>
          <DelegationTabItem isActive={currentTab === 2} onClick={() => onCLickChangeTab(2)}>
            Undelegations ({totalStakingState.undelegationList.length})
          </DelegationTabItem>
          {CHAIN_CONFIG.RESTAKE.API !== '' && (
            <DelegationTabItem isActive={currentTab === 3} onClick={() => onCLickChangeTab(3)}>
              Restake ({restakeList.length})
            </DelegationTabItem>
          )}
        </DelegationTab>
        <AutoSizer>
          {({ height, width }) => {
            if (currentTab === 0) {
              return (
                <TabListItem>
                  <DelegationHeaderWrapper style={{ width: width - 5 }}>
                    <DelegationHeaderColumn>Validator</DelegationHeaderColumn>
                    <DelegationHeaderColumn>Delegated</DelegationHeaderColumn>
                    <DelegationHeaderColumn>Reward</DelegationHeaderColumn>
                  </DelegationHeaderWrapper>
                  <List
                    width={width}
                    height={height - 80}
                    itemCount={totalStakingState.delegateList.length}
                    itemSize={45}
                    itemData={totalStakingState.delegateList}
                  >
                    {(props) => Row({ ...props, totalStakingState })}
                  </List>
                </TabListItem>
              );
            } else if (currentTab === 1) {
              return (
                <TabListItem>
                  <RedelegationHeaderWrapper style={{ width: width - 5 }}>
                    <RedelegationHeaderColumn>From</RedelegationHeaderColumn>
                    <RedelegationHeaderColumn>To</RedelegationHeaderColumn>
                    <RedelegationHeaderColumn>Amount</RedelegationHeaderColumn>
                    <RedelegationHeaderColumn>Linked Until</RedelegationHeaderColumn>
                  </RedelegationHeaderWrapper>
                  <List
                    width={width}
                    height={height - 80}
                    itemCount={totalStakingState.redelegationList.length}
                    itemSize={45}
                    itemData={totalStakingState.redelegationList}
                  >
                    {(props) => RedelegationRow({ ...props })}
                  </List>
                </TabListItem>
              );
            } else if (currentTab === 2) {
              return (
                <TabListItem>
                  <UndelegationHeaderWrapper style={{ width: width - 5 }}>
                    <UndelegationHeaderColumn>Validator</UndelegationHeaderColumn>
                    <UndelegationHeaderColumn>Amount</UndelegationHeaderColumn>
                    <UndelegationHeaderColumn>Linked Until</UndelegationHeaderColumn>
                  </UndelegationHeaderWrapper>
                  <List
                    width={width}
                    height={height - 80}
                    itemCount={totalStakingState.undelegationList.length}
                    itemSize={45}
                    itemData={totalStakingState.undelegationList}
                  >
                    {(props) => UndelegationRow({ ...props })}
                  </List>
                </TabListItem>
              );
            } else if (currentTab === 3) {
              return (
                <TabListItem>
                  <RestakeHeaderWrapper style={{ width: width - 5 }}>
                    <RestakeHeaderColumn>Validator</RestakeHeaderColumn>
                    <RestakeHeaderColumn>Reward</RestakeHeaderColumn>
                    <RestakeHeaderColumn>Latest Restake</RestakeHeaderColumn>
                    <RestakeHeaderColumn>Grant Status</RestakeHeaderColumn>
                  </RestakeHeaderWrapper>
                  <List
                    width={width}
                    height={height - 80}
                    itemCount={restakeList.length}
                    itemSize={45}
                    itemData={restakeList}
                  >
                    {(props) => RestakeRow({ ...props, totalStakingState })}
                  </List>
                </TabListItem>
              );
            }
          }}
        </AutoSizer>
      </DelegationListWrapper>
      <ButtonWrapper>
        {CHAIN_CONFIG.RESTAKE.API !== '' && (
          <Button isActive={totalStakingState.delegateList.length > 0} onClick={onClickRestake}>
            Restake
          </Button>
        )}

        <Button isActive={totalStakingState.stakingReward > 0} onClick={onClickWithdrawAll}>
          Withdraw All
        </Button>
      </ButtonWrapper>
    </FlexWrapper>
  );
};

export default React.memo(DelegationCard);
