import React, { useState, useEffect } from "react";

import { ModalLabel, ModalInput, InputBoxDefault, InputMessageText } from "./styles";

const Password = ({ onChange }: any) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isInvalidPassword, setInvalidPassword] = useState(false);
  const [isInvalidConfirmPassword, setInvalidConfirmPassword] = useState(false);

  useEffect(() => {
    let validPassword = false;
    let validConfirmPassword = false;

    if (password.length >= 8) {
      validPassword = true;
    }
    if (password === confirmPassword) {
      validConfirmPassword = true;
    }

    setInvalidPassword(!validPassword && password.length > 0);
    setInvalidConfirmPassword(!validConfirmPassword && confirmPassword.length > 0);

    if (validPassword && validConfirmPassword) {
      onChange(password);
    }
  }, [password, confirmPassword]); // eslint-disable-line react-hooks/exhaustive-deps

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const onChangeConfirmPassword = (e: any) => {
    if (e === null) return;
    setConfirmPassword(e.target.value);
  };

  return (
    <>
      <ModalLabel>Password</ModalLabel>
      <ModalInput>
        <InputBoxDefault type="password" value={password} onChange={onChangePassword} isInvalid={isInvalidPassword} />
        <InputMessageText>{isInvalidPassword && `Your password must be at least 8 characters.`}</InputMessageText>
      </ModalInput>

      <ModalLabel>Confirm Password</ModalLabel>
      <ModalInput>
        <InputBoxDefault
          type="password"
          value={confirmPassword}
          onChange={onChangeConfirmPassword}
          isInvalid={isInvalidConfirmPassword}
        />
        <InputMessageText>{isInvalidConfirmPassword && `The password confirmation does not match.`}</InputMessageText>
      </ModalInput>
    </>
  );
};

export default React.memo(Password);
