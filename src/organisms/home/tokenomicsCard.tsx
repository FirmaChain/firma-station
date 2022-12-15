import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

import { convertNumberFormat } from '../../utils/common';
import { ITokenomicsState } from '../../interfaces/home';
import { CHAIN_CONFIG } from '../../config';

import theme from '../../themes';
import { BlankCard } from '../../components/card';

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
} from './styles';

interface IProps {
  tokenomicsState: ITokenomicsState;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <CustomTooltipContainer>
        <CustomTooltipTypo>{payload[0].payload.payload.legendKey}</CustomTooltipTypo>
        <CustomTooltipTypo>{`${convertNumberFormat(payload[0].value, 0)} ${
          CHAIN_CONFIG.PARAMS.SYMBOL
        }`}</CustomTooltipTypo>
      </CustomTooltipContainer>
    );
  }

  return null;
};

const TokenomicsCard = ({ tokenomicsState }: IProps) => {
  const [pieData, setPieData] = useState<any>([]);
  const [supply, setSupply] = useState('');
  const [delegated, setDelegated] = useState('');
  const [undelegated, setUndelegated] = useState('');
  const [undelegate, setUndelegate] = useState('');

  useEffect(() => {
    if (tokenomicsState) {
      setSupply(convertNumberFormat(tokenomicsState.supply, 0));
      setDelegated(convertNumberFormat(tokenomicsState.delegated, 0));
      setUndelegated(convertNumberFormat(tokenomicsState.undelegated, 0));
      setUndelegate(convertNumberFormat(tokenomicsState.undelegate, 0));

      setPieData([
        {
          legendKey: 'delegated',
          percentKey: 'delegatedPercent',
          value: convertNumberFormat(tokenomicsState.delegated, 0),
          rawValue: tokenomicsState.delegated,
          percent: `${convertNumberFormat((tokenomicsState.delegated * 100) / tokenomicsState.supply, 2)}%`,
          fill: theme.colors.mainblue,
        },
        {
          legendKey: 'undelegated',
          percentKey: 'undelegatedPercent',
          value: convertNumberFormat(tokenomicsState.undelegated, 0),
          rawValue: tokenomicsState.undelegated,
          percent: `${convertNumberFormat((tokenomicsState.undelegated * 100) / tokenomicsState.supply, 2)}%`,
          fill: theme.colors.mainpurple,
        },
        {
          legendKey: 'undelegate',
          value: convertNumberFormat(tokenomicsState.undelegate, 0),
          rawValue: tokenomicsState.undelegate,
          percent: `${convertNumberFormat((tokenomicsState.undelegate * 100) / tokenomicsState.supply, 2)}%`,
          fill: theme.colors.maingreen,
        },
      ]);
    }
  }, [tokenomicsState]);

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height={'100%'}>
      <TokenomicsTitleTypo>Tokenomics</TokenomicsTitleTypo>
      <TokenomicsContainer>
        <PichartWrapper>
          <PiechartContainer>
            <PieChart width={240} height={94} cy={100}>
              <Pie
                cy={90}
                data={pieData}
                startAngle={180}
                endAngle={0}
                outerRadius={95}
                dataKey='rawValue'
                stroke={'0'}
                isAnimationActive={false}
              >
                {pieData.map((entry: any) => {
                  return <Cell key={entry.legendKey} fill={entry.fill} />;
                })}
              </Pie>
              <Tooltip content={<CustomTooltip />} position={{ x: 45, y: 36 }} />
            </PieChart>
          </PiechartContainer>
          <PiechartLabelContainer>
            {pieData.map((x: any) => {
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
            <TokenomicsDetailContent>{`${supply} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Delegated</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${delegated} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Undelegated</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${undelegated} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</TokenomicsDetailContent>
          </TokenomicsDetail>

          <TokenomicsDetail>
            <TokenomicsDetailTitle>Undelegate</TokenomicsDetailTitle>
            <TokenomicsDetailContent>{`${undelegate} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</TokenomicsDetailContent>
          </TokenomicsDetail>
        </TokenomicsDetailWrapper>
      </TokenomicsContainer>
    </BlankCard>
  );
};

export default React.memo(TokenomicsCard);
