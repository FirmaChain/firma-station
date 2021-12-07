import React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";

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
} from "./styles";

interface IProps {
  totalStakingState: ITotalStakingState;
}

const Row = ({ data, index, style, totalStakingState }: any) => {
  return (
    <DelegationItemWrapper style={style}>
      <DelegationItemColumn></DelegationItemColumn>
    </DelegationItemWrapper>
  );
};

const DelegationCard = ({ totalStakingState }: IProps) => {
  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height="200px">
      <FlexWrapper>
        <ChartWrapper></ChartWrapper>
        <DelegationListWrapper>
          <AutoSizer>
            {({ height, width }) => (
              <>
                <DelegationHeaderWrapper style={{ width }}>
                  <DelegationHeaderColumn>Validator</DelegationHeaderColumn>
                  <DelegationHeaderColumn>Delegated</DelegationHeaderColumn>
                  <DelegationHeaderColumn>Reward</DelegationHeaderColumn>
                </DelegationHeaderWrapper>
                <List width={width} height={height - 30} itemCount={10} itemSize={35} itemData={[]}>
                  {(props) => Row({ ...props, totalStakingState })}
                </List>
              </>
            )}
          </AutoSizer>
        </DelegationListWrapper>
      </FlexWrapper>
    </BlankCard>
  );
};

export default React.memo(DelegationCard);
