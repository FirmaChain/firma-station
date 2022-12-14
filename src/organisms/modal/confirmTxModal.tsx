import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { convertToFctString, isValidString, convertNumberFormat } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';

import {
  confirmTxModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ConfirmWrapper,
  ConfirmLabel,
  ConfirmInput,
  NextButton,
  InputBoxDefault,
  PasswordWrapper,
} from './styles';
import { FIRMACHAIN_CONFIG, SYMBOL } from '../../config';

const ConfirmTxModal = () => {
  const confirmTxModalState = useSelector((state: rootState) => state.modal.confirmTx);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { isLedger } = useSelector((state: rootState) => state.wallet);

  const { enqueueSnackbar } = useSnackbar();
  const { isCorrectPassword } = useFirma();

  const [password, setPassword] = useState('');
  const [actionName, setActionName] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('0.2');
  const [isActive, setActive] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setActionName(modalData.action);
    setAmount(modalData.data.amount);

    if (modalData.data.fees) {
      setFee(convertToFctString(modalData.data.fees.toString()));
    } else {
      setFee(convertToFctString(FIRMACHAIN_CONFIG.defaultFee.toString()));
    }
  }, [modalData]);

  const closeConfirmTxModal = () => {
    modalActions.handleModalConfirmTx(false);
  };

  const queueTx = () => {
    if (isCorrectPassword(password) || isLedger) {
      closeConfirmTxModal();
      modalActions.handleModalQueueTx(true);
    } else {
      enqueueSnackbar('Invalid Password', {
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
    setActive(e.target.value.length >= 8);
  };

  const onKeyDownPassword = (e: any) => {
    if (e.key === 'Enter') {
      if (isActive) queueTx();
    }
  };

  return (
    <Modal visible={confirmTxModalState} closable={true} onClose={closeConfirmTxModal} width={confirmTxModalWidth}>
      <ModalContainer>
        <ModalTitle>CONFIRM</ModalTitle>
        <ModalContent>
          {isValidString(amount) && (
            <ConfirmWrapper>
              <ConfirmLabel>Amount</ConfirmLabel>
              <ConfirmInput>{`${convertNumberFormat(amount, 6)} ${SYMBOL}`}</ConfirmInput>
            </ConfirmWrapper>
          )}
          <ConfirmWrapper>
            <ConfirmLabel>Fee</ConfirmLabel>
            <ConfirmInput>{`${convertNumberFormat(fee, 6)} ${SYMBOL}`}</ConfirmInput>
          </ConfirmWrapper>
          {isLedger === false && (
            <PasswordWrapper>
              <InputBoxDefault
                ref={inputRef}
                placeholder='PASSWORD'
                type='password'
                value={password}
                onChange={onChangePassword}
                onKeyDown={onKeyDownPassword}
                autoFocus={true}
              />
            </PasswordWrapper>
          )}
          <NextButton
            style={{ marginTop: '50px' }}
            onClick={() => {
              if (isActive || isLedger) queueTx();
            }}
            active={isActive || isLedger}
          >
            {isLedger === false ? actionName : `Sign Ledger`}
          </NextButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ConfirmTxModal);
