import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import GridLoader from 'react-spinners/GridLoader';

import useFirma from '../../utils/wallet';
import { CHAIN_CONFIG } from '../../config';
import { rootState } from '../../redux/reducers';
import { encryptData } from '../../utils/keystore';

import {
  ContactContainer,
  ContactWrapper,
  LogoImg,
  TitleTypo,
  SubTitleTypo,
  Copyright,
  ContactTypo,
  BackgroundSymbol,
  GridWrapper,
  LogoutIconImg,
  LogoutWrap,
  LogoutTypo,
} from './styles';

const Contact = () => {
  const { address } = useSelector((state: rootState) => state.wallet);
  const { resetWallet } = useFirma();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post(`${CHAIN_CONFIG.API_HOST}/status`, { data: encryptData(address) })
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
