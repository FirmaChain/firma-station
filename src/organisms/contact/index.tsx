import React, { useEffect, useState } from 'react';
import ky from 'ky';
import { isMobile } from 'react-device-detect';
import { GridLoader } from 'react-spinners';

import { CHAIN_CONFIG } from '../../config';
import { useWalletStore } from '../../store';
import { encryptData } from '../../utils/keystore';
import useFirma from '../../utils/wallet';
import {
	BackgroundSymbol,
	ContactContainer,
	ContactTypo,
	ContactWrapper,
	Copyright,
	GridWrapper,
	LogoImg,
	LogoutIconImg,
	LogoutTypo,
	LogoutWrap,
	SubTitleTypo,
	TitleTypo
} from './styles';

const Contact = () => {
	const { address } = useWalletStore((state) => state);
	const { resetWallet } = useFirma();

	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		encryptData(address)
			.then((data) => ky.post(`${CHAIN_CONFIG.API_HOST}/status`, { json: { data } }))
			.then(() => {})
			.catch(() => {});
		setTimeout(() => {
			setLoading(false);
		}, 3000);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return (
		<ContactContainer>
			{isMobile === false && <BackgroundSymbol />}

			<LogoutWrap onClick={resetWallet}>
				<LogoutIconImg />
				<LogoutTypo>Logout</LogoutTypo>
			</LogoutWrap>

			<ContactWrapper>
				<LogoImg />
				{isLoading ? (
					<GridWrapper>
						<GridLoader loading={true} color={'#ffffff50'} />
					</GridWrapper>
				) : (
					<>
						<TitleTypo>Please check your wallet.</TitleTypo>
						<SubTitleTypo>
							{`Unable to retrieve wallet information.\nIf the problem repeats, please contact [contact@firmachain.org].`}
						</SubTitleTypo>
					</>
				)}
				<Copyright>Copyrightⓒ FirmaChain Pte. Ltd. | All Right Reserved</Copyright>
				<ContactTypo>contact@firmachain.org</ContactTypo>
			</ContactWrapper>
		</ContactContainer>
	);
};

export default React.memo(Contact);
