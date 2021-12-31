import React from "react";
import numeral from "numeral";
import AutoSizer from "react-virtualized-auto-sizer";
import { Link } from "react-router-dom";
import { FixedSizeList as List } from "react-window";
import { ResponsivePie } from "@nivo/pie";

import useFirma from "../../utils/wallet";
import { modalActions } from "../../redux/action";
import { ITotalStakingState } from "./hooks";

import theme from "../../themes";
import { BlankCard } from "../../components/card";
import {
  ChartWrapper,
  DelegationListWrapper,
  DelegationHeaderWrapper,
  DelegationHeaderColumn,
  DelegationItemWrapper,
  DelegationItemColumn,
  FlexWrapper,
  ProfileImage2,
  MonikerTypo,
  ChartCenterTypoWrapper,
  ChartCenterTypo,
  ButtonWrapper,
  Button,
} from "./styles";
import { convertNumber, convertToFctNumber, convertToFctString } from "../../utils/common";

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

  return (
    <DelegationItemWrapper style={style}>
      <DelegationItemColumn>
        <Link to={{ pathname: `/staking/validators/${data[index].validatorAddress}` }}>
          <ProfileImage2 src={validatorInfo.avatarURL} />
          <MonikerTypo>{validatorInfo.moniker}</MonikerTypo>
        </Link>
      </DelegationItemColumn>
      <DelegationItemColumn>{numeral(getDelegateAmount(data[index].amount)).format("0,0.000")}</DelegationItemColumn>
      <DelegationItemColumn>
        ≈ {numeral(getReward(data[index].validatorAddress)).format("0,0.000")}
      </DelegationItemColumn>
    </DelegationItemWrapper>
  );
};

const GetDelegatePieData = (totalStakingState: ITotalStakingState) => {
  const getMonikerFormat = (moniker: string) => {
    if (moniker.length > 20) return moniker.substr(0, 20) + "...";
    else return moniker;
  };

  const result = totalStakingState.delegateList.map((delegate) => {
    const moniker = getMonikerFormat(delegate.moniker);
    const percentValue = (convertToFctNumber(delegate.amount) / totalStakingState.delegated) * 100;
    return {
      id: getMonikerFormat(moniker),
      value: Math.round(percentValue * 100) / 100,
      amount: numeral(convertToFctNumber(delegate.amount)).format("0,0.000"),
    };
  });

  return result;
};

const DelegationCard = ({ totalStakingState }: IProps) => {
  const { withdrawAllValidator } = useFirma();
  const data = GetDelegatePieData(totalStakingState);

  const withdrawAllValidatorTx = (resolveTx: () => void, rejectTx: () => void) => {
    withdrawAllValidator()
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const withdrawAllValidatorAction = () => {
    modalActions.handleModalData({
      action: "Withdraw",
      data: { amount: totalStakingState.stakingReward },
      txAction: withdrawAllValidatorTx,
    });

    modalActions.handleModalConfirmTx(true);
  };

  const onClickWithdrawAll = () => {
    if (totalStakingState.stakingReward > 0) {
      withdrawAllValidatorAction();
    }
  };

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="370px">
      <FlexWrapper>
        <ChartWrapper>
          <ChartCenterTypoWrapper>
            <ChartCenterTypo>Delegated</ChartCenterTypo>
            <ChartCenterTypo>{numeral(totalStakingState.delegated).format("0,0.000")}</ChartCenterTypo>
          </ChartCenterTypoWrapper>
          <ResponsivePie
            data={data}
            margin={{ top: 30, right: 20, bottom: 30, left: 20 }}
            innerRadius={0.75}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: "dark2" }}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLabels={false}
            arcLinkLabel={function (e) {
              return e.id + "\n[" + e.value + "%]";
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#fff"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
            tooltip={function (e) {
              const t = e.datum;
              return (
                <div style={{ backgroundColor: "#eee", padding: "10px", borderRadius: "4px" }}>{t.data.amount} FCT</div>
              );
            }}
            legends={[]}
          />
        </ChartWrapper>
        <DelegationListWrapper>
          <AutoSizer>
            {({ height, width }) => (
              <>
                <DelegationHeaderWrapper style={{ width: width - 5 }}>
                  <DelegationHeaderColumn>Validator</DelegationHeaderColumn>
                  <DelegationHeaderColumn>Delegated (FCT)</DelegationHeaderColumn>
                  <DelegationHeaderColumn>Reward (FCT)</DelegationHeaderColumn>
                </DelegationHeaderWrapper>
                <List
                  width={width}
                  height={height - 40}
                  itemCount={totalStakingState.delegateList.length}
                  itemSize={45}
                  itemData={totalStakingState.delegateList}
                >
                  {(props) => Row({ ...props, totalStakingState })}
                </List>
              </>
            )}
          </AutoSizer>
        </DelegationListWrapper>
      </FlexWrapper>
      <ButtonWrapper>
        <Button isActive={totalStakingState.stakingReward > 0} onClick={onClickWithdrawAll}>
          Withdraw All
        </Button>
      </ButtonWrapper>
    </BlankCard>
  );
};

export default React.memo(DelegationCard);
