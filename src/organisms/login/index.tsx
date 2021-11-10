import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { useApolloClient } from "@apollo/client";

import { LoginContainer, LoginWrapper, LogoImg, LoginInputWrapper, InputBoxDefault, LoginButton } from "./styles";
import useFirma from "../../utils/wallet";

const LoginCard = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { reFetchObservableQueries } = useApolloClient();
  const [password, setPassword] = useState("");

  const { loginWallet } = useFirma();

  const onKeyDownPassword = (e: any) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const login = () => {
    if (password === "") return;

    loginWallet(password)
      .then(() => {
        reFetchObservableQueries();
      })
      .catch(() => {
        enqueueSnackbar("Invalid Password", {
          variant: "error",
          autoHideDuration: 1000,
        });
      });
  };

  return (
    <LoginContainer>
      <LoginWrapper>
        <LogoImg />
        <LoginInputWrapper>
          <InputBoxDefault
            placeholder="PASSWORD"
            type="password"
            onKeyDown={onKeyDownPassword}
            value={password}
            onChange={onChangePassword}
            autoFocus={true}
          />
          <LoginButton active={password !== ""} onClick={login}>
            LOGIN
          </LoginButton>
        </LoginInputWrapper>
      </LoginWrapper>
    </LoginContainer>
  );
};

export default React.memo(LoginCard);
