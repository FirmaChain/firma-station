import React from 'react';

import { ComingDiv } from '../organisms/coming';
import { ContentContainer } from '../styles/home';

const Coming = () => {
	return (
		<ContentContainer>
			<ComingDiv />
		</ContentContainer>
	);
};

export default React.memo(Coming);
