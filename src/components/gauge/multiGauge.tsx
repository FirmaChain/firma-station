import React from 'react';

import theme from '../../themes';
import { MultiGaugeItem, MultiGaugePercent, MultiGaugeWrapper } from './styles';

interface IProps {
	percent: string;
	bgColor?: string;
	multiList: {
		percent: string;
		bgColor: string;
	}[];
}

const MultiGauge = ({ percent, bgColor = theme.colors.mainblue, multiList }: IProps) => {
	return (
		<MultiGaugeWrapper $bgColor={bgColor}>
			<MultiGaugePercent $percent={percent}>
				{multiList.map((gaugeItem, index) => {
					return <MultiGaugeItem key={index} $percent={gaugeItem.percent} $bgColor={gaugeItem.bgColor} />;
				})}
			</MultiGaugePercent>
		</MultiGaugeWrapper>
	);
};

export default React.memo(MultiGauge);
