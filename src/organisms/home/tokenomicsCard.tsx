import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import { ITokenomicsState } from "./hooks";

import theme from "../../themes";
import { BlankCard } from "../../components/card";

import {
  TokenomicsTitleTypo,
  TokenomicsContainer,
  CustomTooltipContainer,
  CustomTooltipTypo,
  PichartWrapper,
  PiechartContainer,
  PiechartLabelContainer,
  PiechartLabelWrapper,
  PiechartLabelTypo,
  PiechartLabelIcon,
  TokenomicsDetailWrapper,
  TokenomicsDetail,
  TokenomicsDetailTitle,
  TokenomicsDetailContent,
} from "./styles";
import { convertNumberFormat } from "../../utils/common";

interface IProps {
  tokenomicsState: ITokenomicsState;
}

const DENOM = "FCT";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <CustomTooltipTypo>{payload[0].payload.payload.legendKey}</CustomTooltipTypo>
        <CustomTooltipTypo>{`${convertNumberFormat(payload[0].value, 0)} ${DENOM}`}</CustomTooltipTypo>
      </CustomTooltipContainer>
    );
  }

  return null;
};

const TokenomicsCard = ({ tokenomicsState }: IProps) => {
  const data = [
    {
      legendKey: "delegated",
      percentKey: "delegatedPercent",
      value: convertNumberFormat(tokenomicsState.delegated, 0),
      rawValue: tokenomicsState.delegated,
      percent: `${convertNumberFormat((tokenomicsState.delegated * 100) / tokenomicsState.supply, 2)}%`,
      fill: theme.colors.mainblue,
    },
    {
      legendKey: "undelegated",
      percentKey: "undelegatedPercent",
      value: convertNumberFormat(tokenomicsState.undelegated, 0),
      rawValue: tokenomicsState.undelegated,
      percent: `${convertNumberFormat((tokenomicsState.undelegated * 100) / tokenomicsState.supply, 2)}%`,
      fill: theme.colors.mainpurple,
    },
    {
      legendKey: "undelegate",
      value: convertNumberFormat(tokenomicsState.undelegate, 0),
      rawValue: tokenomicsState.undelegate,
      percent: `${convertNumberFormat((tokenomicsState.undelegate * 100) / tokenomicsState.supply, 2)}%`,
      fill: theme.colors.maingreen,
    },
  ];

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height={"100%"}>
      <TokenomicsTitleTypo>Tokenomics</TokenomicsTitleTypo>
      <TokenomicsContainer>
        <PichartWrapper>
          <PiechartContainer>
            <PieChart width={240} height={94} cy={100}>
              <Pie
                cy={90}
                data={data}
                startAngle={180}
                endAngle={0}
                outerRadius={95}
                dataKey="rawValue"
                stroke={"0"}
                isAnimationActive={false}
              >
                {data.map((entry) => {
                  return <Cell key={entry.legendKey} fill={entry.fill} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} position={{ x: 45, y: 36 }} />
            </PieChart>
          </PiechartContainer>
          <PiechartLabelContainer>
            {data.map((x) => {
              return (
                <PiechartLabelWrapper key={x.legendKey}>
                  <PiechartLabelIcon bgColor={x.fill} />
                  <PiechartLabelTypo>{x.legendKey}</PiechartLabelTypo>
                </PiechartLabelWrapper>
              );
            })}
          </PiechartLabelContainer>
        </PichartWrapper>
        <TokenomicsDetailWrapper>
          <TokenomicsDetail>
            <TokenomicsDetailTitle>Total Supply</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${convertNumberFormat(
              tokenomicsState.supply,
              0
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Delegated</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${convertNumberFormat(
              tokenomicsState.delegated,
              0
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Undelegated</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${convertNumberFormat(
              tokenomicsState.undelegated,
              0
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Undelegate</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${convertNumberFormat(
              tokenomicsState.undelegate,
              0
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>
        </TokenomicsDetailWrapper>
      </TokenomicsContainer>
    </BlankCard>
  );
};

export default React.memo(TokenomicsCard);
