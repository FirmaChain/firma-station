import React, { useEffect, useState } from 'react';
import ky from 'ky';
import { useSelector } from 'react-redux';

import { BlankCard } from '../../components/card';
import { CHAIN_CONFIG } from '../../config';
import { rootState } from '../../redux/reducers';
import theme from '../../themes';
import { convertNumber, convertNumberFormat } from '../../utils/common';
import { AddressTitleTypo, PriceTypo, UsdTypo, UserBalanceTypo } from './styles';

const AccountCard = () => {
	const { balance } = useSelector((state: rootState) => state.user);
	const [currentUSDPrice, setPrice] = useState(0.0);

	useEffect(() => {
		ky.get(`https://api.coingecko.com/api/v3/simple/price?ids=upbit,firmachain&vs_currencies=usd`)
			.json<{ firmachain: { usd: number } }>()
			.then((data) => {
				setPrice(data.firmachain.usd);
			})
			.catch((e) => {});
	}, []);

	return (
		<BlankCard bgColor={theme.colors.mainblue} height="130px" backgroundLogo={true}>
			<AddressTitleTypo>{CHAIN_CONFIG.PARAMS.SYMBOL} Balance</AddressTitleTypo>
			<UsdTypo>
				1 {CHAIN_CONFIG.PARAMS.SYMBOL} ($ {Math.round(currentUSDPrice * 1000) / 1000})
			</UsdTypo>
			<PriceTypo>$ {convertNumberFormat(currentUSDPrice * convertNumber(balance), 2)}</PriceTypo>
			<UserBalanceTypo>{`${convertNumberFormat(balance, 3)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`}</UserBalanceTypo>
		</BlankCard>
	);
};

export default React.memo(AccountCard);
