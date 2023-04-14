import React, { useState, useEffect } from 'react';
import GridLoader from 'react-spinners/GridLoader';
import { isMobile } from 'react-device-detect';

import useFirma from '../../utils/wallet';

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
  const { resetWallet } = useFirma();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

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
              {
                'Unable to retrieve wallet information.\nIf the problem repeats, please contact [contact@firmachain.org].'
              }
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
