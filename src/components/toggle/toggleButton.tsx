import React from 'react';

import { ToggleButtonImage, ToggleText, ToggleWrapper } from './styles';

interface IProps {
	toggleText: string;
	isActive: boolean;
	onClickToggle: () => void;
}

const ToggleButton = ({ toggleText, isActive, onClickToggle }: IProps) => {
	const onClick = () => {
		onClickToggle();
	};

	return (
		<ToggleWrapper>
			<ToggleText>{toggleText}</ToggleText>
			<ToggleButtonImage $isActive={isActive} onClick={onClick}></ToggleButtonImage>
		</ToggleWrapper>
	);
};

export default React.memo(ToggleButton);
