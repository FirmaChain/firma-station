import React, { useState, useEffect } from 'react';

import { ModalLabel, ModalInput, InputBoxDefault, InputMessageText, ModalInputWrap } from './styles';

const Password = ({ onChange, onKeyDown }: any) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
      onChange && onChange(password);
    } else {
      onChange && onChange('');
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

  const onKeyDownPassword = (e: any) => {
    if (e.key === 'Enter') {
      onKeyDown && onKeyDown();
    }
  };

  return (
    <>
      <ModalInputWrap>
        <ModalLabel>Password</ModalLabel>
        <ModalInput>
          <InputBoxDefault
            type='password'
            value={password}
            onChange={onChangePassword}
            isInvalid={isInvalidPassword}
            placeholder='Enter Password'
          />
          <InputMessageText isActive={isInvalidPassword}>
            {isInvalidPassword && `Your password must be at least 8 characters.`}
          </InputMessageText>
        </ModalInput>
      </ModalInputWrap>
      <ModalInputWrap>
        <ModalLabel>Confirm Password</ModalLabel>
        <ModalInput>
          <InputBoxDefault
            type='password'
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
            onKeyDown={onKeyDownPassword}
            isInvalid={isInvalidConfirmPassword}
            placeholder='Enter Confirm Password'
          />
          <InputMessageText isActive={isInvalidConfirmPassword}>
            {isInvalidConfirmPassword && `The password confirmation does not match.`}
          </InputMessageText>
        </ModalInput>
      </ModalInputWrap>
    </>
  );
};

export default React.memo(Password);
