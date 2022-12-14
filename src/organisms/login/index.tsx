import React, { useState } from 'react';
import { useSnackbar } from 'notistack';

import {
  LoginContainer,
  LoginWrapper,
  LogoImg,
  LoginInputWrapper,
  InputBoxDefault,
  LoginButton,
  LogoutWrap,
  LogoutIconImg,
  LogoutTypo,
} from './styles';
import useFirma from '../../utils/wallet';

const LoginCard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [password, setPassword] = useState('');

  const { loginWallet, resetWallet, setUserData } = useFirma();

  const onKeyDownPassword = (e: any) => {
    if (e.key === 'Enter') {
      login();
    }
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const login = () => {
    if (password === '') return;

    loginWallet(password)
      .then(() => {
        setUserData();
      })
      .catch(() => {
        enqueueSnackbar('Invalid Password', {
          variant: 'error',
          autoHideDuration: 2000,
        });
      });
  };

  return (
    <LoginContainer>
      <LogoutWrap onClick={resetWallet}>
        <LogoutIconImg />
        <LogoutTypo>Logout</LogoutTypo>
      </LogoutWrap>

      <LoginWrapper>
        <LogoImg />
        <LoginInputWrapper>
          <InputBoxDefault
            placeholder='PASSWORD'
            type='password'
            onKeyDown={onKeyDownPassword}
            value={password}
            onChange={onChangePassword}
            autoFocus={true}
          />
          <LoginButton active={password !== ''} onClick={login}>
            LOGIN
          </LoginButton>
        </LoginInputWrapper>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default React.memo(LoginCard);
