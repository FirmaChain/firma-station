import React, { useEffect } from "react";
import numeral from "numeral";
import styled from "styled-components";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

import theme from "themes";
import { BlankCard } from "components/card";
import { useBlockData } from "./hooks";

const TokenomicsTitleTypo = styled.div`
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  margin-top: 14px;
  padding: 0 14px;
  height: 30px;
  line-height: 30px;
  font-size: ${({ theme }) => theme.sizes.accountCardSize1};
`;

const TokenomicsContainer = styled.div`
  padding: 0 14px;
  margin-top: 10px;
`;

const CustomTooltipContainer = styled.div`
  width: 130px;
  background-color: #111;
  padding: 10px;
  border-radius: 4px;
`;

const CustomTooltipTypo = styled.div`
  text-align: center;
`;

const PichartWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PiechartContainer = styled.div`
  width: 100%;
  text-align: center;
  & > div {
    margin: auto;
  }
`;

const PiechartLabelContainer = styled.div`
  width: 100%;
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
`;

const PiechartLabelWrapper = styled.div`
  display: flex;
  flex: 1 1 30%;
  gap: 0 10px;
`;

const PiechartLabelTypo = styled.div`
  width: 100%;
  height: 20px;
  line-height: 20px;
  color: #ccc;
`;

const PiechartLabelIcon = styled.div`
  width: 20px;
  height: 20px;
  background-color: ${(props) => props.bgColor};
  float: left;
`;

const TokenomicsDetailWrapper = styled.div`
  width: 100%;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 24px 0;
`;

const TokenomicsDetail = styled.div`
  width: 100%;
  display: flex;
`;

const TokenomicsDetailTitle = styled.div`
  width: 100%;
  flex: 1;
  color: ${({ theme }) => theme.colors.defaultDarkGray};
  font-size: 16px;
`;
const TokenomicsDetailContent = styled.div`
  width: 100%;
  flex: 1;
  text-align: right;
  font-size: 16px;
`;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <CustomTooltipTypo>{payload[0].payload.payload.legendKey}</CustomTooltipTypo>
        <CustomTooltipTypo>{`${numeral(payload[0].value).format("0,0")} FCT`}</CustomTooltipTypo>
      </CustomTooltipContainer>
    );
  }

  return null;
};

const TokenomicsCard = () => {
  const { tokenomicsState } = useBlockData();

  const data = [
    {
      legendKey: "bonded",
      percentKey: "bondedPercent",
      value: numeral(tokenomicsState.bonded).format("0,0"),
      rawValue: Number(tokenomicsState.bonded),
      percent: `${numeral((tokenomicsState.bonded * 100) / tokenomicsState.total).format("0.00")}%`,
      fill: theme.colors.mainblue,
    },
    {
      legendKey: "unbonded",
      percentKey: "unbondedPercent",
      value: numeral(tokenomicsState.unbonded).format("0,0"),
      rawValue: Number(tokenomicsState.unbonded),
      percent: `${numeral((tokenomicsState.unbonded * 100) / tokenomicsState.total).format("0.00")}%`,
      fill: theme.colors.mainpurple,
    },
    {
      legendKey: "unbonding",
      value: numeral(tokenomicsState.unbonding).format("0,0"),
      rawValue: Number(tokenomicsState.unbonding),
      percent: `${numeral((tokenomicsState.unbonding * 100) / tokenomicsState.total).format("0.00")}%`,
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
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.supply).format("0,0")} FCT`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Bonded</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.bonded).format("0,0")} FCT`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Unbonded</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.unbonded).format(
              "0,0"
            )} FCT`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Unbonding</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${numeral(tokenomicsState.unbonding).format(
              "0,0"
            )} FCT`}</TokenomicsDetailContent>
          </TokenomicsDetail>
        </TokenomicsDetailWrapper>
      </TokenomicsContainer>
    </BlankCard>
  );
};

export default TokenomicsCard;
