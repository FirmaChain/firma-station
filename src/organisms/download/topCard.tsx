import React from 'react';

import { SubTitleTypo, TitleTypo, TopCardWrapper } from './styles';

const TopCard = () => {
	return (
		<TopCardWrapper>
			<TitleTypo>Download</TitleTypo>
			<SubTitleTypo>Get the firma station apps to seamlessly manage your assets in one place.</SubTitleTypo>
		</TopCardWrapper>
	);
};

export default React.memo(TopCard);
