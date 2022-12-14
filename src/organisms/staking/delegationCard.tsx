import React, { useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { ResponsivePie } from '@nivo/pie';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';
import { ITotalStakingState } from '../../interfaces/staking';
import {
  convertNumber,
  convertNumberFormat,
  convertToFctNumber,
  convertToFctString,
  getFeesFromGas,
} from '../../utils/common';
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
} from './styles';

interface IProps {
  totalStakingState: ITotalStakingState;
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
        <Link to={{ pathname: `/staking/validators/${data[index].validatorAddress}` }}>
          <ProfileImage2 src={validatorInfo.avatarURL} />
          <MonikerTypo>{getMoniker(validatorInfo.moniker)}</MonikerTypo>
        </Link>
      </DelegationItemColumn>
      <DelegationItemColumn>{convertNumberFormat(getDelegateAmount(data[index].amount), 3)}</DelegationItemColumn>
      <DelegationItemColumn>≈ {convertNumberFormat(getReward(data[index].validatorAddress), 3)}</DelegationItemColumn>
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

const DelegationCard = ({ totalStakingState }: IProps) => {
  const { enqueueSnackbar } = useSnackbar();
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { balance } = useSelector((state: rootState) => state.user);
  const { withdrawAllValidator, getGasEstimationWithdrawAllValidator } = useFirma();
  const data = GetDelegatePieData(totalStakingState);

  const [currentTab, setCurrentTab] = useState(0);

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
    if (isLedger) modalActions.handleModalGasEstimation(true);

    getGasEstimationWithdrawAllValidator()
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

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
        if (isLedger) modalActions.handleModalGasEstimation(false);
      });
  };

  const onCLickChangeTab = (index: number) => {
    if (index === 0) {
      setCurrentTab(index);
    } else if (index === 1 && totalStakingState.redelegationList.length > 0) {
      setCurrentTab(index);
    } else if (index === 2 && totalStakingState.undelegationList.length > 0) {
      setCurrentTab(index);
    }
  };

  const onClickWithdrawAll = () => {
    if (totalStakingState.stakingReward > 0) {
      withdrawAllValidatorAction();
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
          data={data}
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
            }
          }}
        </AutoSizer>
      </DelegationListWrapper>
      <ButtonWrapper>
        <Button isActive={totalStakingState.stakingReward > 0} onClick={onClickWithdrawAll}>
          Withdraw All
        </Button>
      </ButtonWrapper>
    </FlexWrapper>
  );
};

export default React.memo(DelegationCard);
