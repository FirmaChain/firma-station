import React, { useState, useEffect } from "react";

import { ModalLabel, ModalInput, InputBoxDefault } from "./styles";

const Password = ({ onChange }: any) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (password === confirmPassword) {
      if (password.length > 10) {
        onChange(password);
      }
    }
  }, [password, confirmPassword]);

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
        <InputBoxDefault type="password" value={password} onChange={onChangePassword} />
      </ModalInput>

      <ModalLabel>Confirm Password</ModalLabel>
      <ModalInput>
        <InputBoxDefault type="password" value={confirmPassword} onChange={onChangeConfirmPassword} />
      </ModalInput>
    </>
  );
};

export default React.memo(Password);
