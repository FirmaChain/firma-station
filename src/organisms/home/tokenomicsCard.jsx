import React, { useEffect } from "react";
import numeral from "numeral";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import theme from "themes";
import { BlankCard } from "components/card";

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

const DENOM = "FCT";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <CustomTooltipTypo>{payload[0].payload.payload.legendKey}</CustomTooltipTypo>
        <CustomTooltipTypo>{`${numeral(payload[0].value).format("0,0")} ${DENOM}`}</CustomTooltipTypo>
      </CustomTooltipContainer>
    );
  }

  return null;
};

const TokenomicsCard = ({ tokenomicsState }) => {
  const data = [
    {
      legendKey: "delegated",
      percentKey: "delegatedPercent",
      value: numeral(tokenomicsState.delegated).format("0,0"),
      rawValue: Number(tokenomicsState.delegated),
      percent: `${numeral((tokenomicsState.delegated * 100) / tokenomicsState.total).format("0.00")}%`,
      fill: theme.colors.mainblue,
    },
    {
      legendKey: "undelegated",
      percentKey: "undelegatedPercent",
      value: numeral(tokenomicsState.undelegated).format("0,0"),
      rawValue: Number(tokenomicsState.undelegated),
      percent: `${numeral((tokenomicsState.undelegated * 100) / tokenomicsState.total).format("0.00")}%`,
      fill: theme.colors.mainpurple,
    },
    {
      legendKey: "undelegate",
      value: numeral(tokenomicsState.undelegate).format("0,0"),
      rawValue: Number(tokenomicsState.undelegate),
      percent: `${numeral((tokenomicsState.undelegate * 100) / tokenomicsState.total).format("0.00")}%`,
      fill: theme.colors.maingreen,
    },
  ];

  useEffect(() => {}, [tokenomicsState]);

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
                stroke={0}
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
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.supply).format(
              "0,0"
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Delegated</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.delegated).format(
              "0,0"
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Undelegated</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.undelegated).format(
              "0,0"
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Undelegate</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.undelegate).format(
              "0,0"
            )} ${DENOM}`}</TokenomicsDetailContent>
          </TokenomicsDetail>
        </TokenomicsDetailWrapper>
      </TokenomicsContainer>
    </BlankCard>
  );
};

export default TokenomicsCard;
