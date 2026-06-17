import React from 'react';
import { useSnackbar } from 'notistack';

import { BlankCard } from '../../components/card';
import { modalActions, useUserStore, useWalletStore } from '../../store';
import theme from '../../themes';
import { convertNumber, convertToFctNumber, getDefaultFee } from '../../utils/common';
import { NextButton, TitleTypo } from './styles';

const SendCard = () => {
	const { balance } = useUserStore((state) => state);
	const { isLedger, isMobileApp } = useWalletStore((state) => state);
	const { enqueueSnackbar } = useSnackbar();

	return (
		<BlankCard bgColor={theme.colors.backgroundSideBar} height="100%">
			<TitleTypo>SEND</TitleTypo>
			<NextButton
				onClick={() => {
					if (convertNumber(balance) > convertToFctNumber(getDefaultFee(isLedger, isMobileApp))) {
						modalActions.handleModalSend(true);
					} else {
						enqueueSnackbar('Insufficient funds. Please check your account balance.', {
							variant: 'error',
							autoHideDuration: 2000
						});
					}
				}}
				data-testid="send-to-address-button"
			>
				Send to Address
			</NextButton>
		</BlankCard>
	);
};

export default React.memo(SendCard);
