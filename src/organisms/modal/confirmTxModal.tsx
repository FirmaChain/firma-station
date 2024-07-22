import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { convertToFctString, isValidString, convertNumberFormat, getDefaultFee } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { CHAIN_CONFIG } from '../../config';

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
  ModalLabel,
  CancelButton,
  ButtonWrapper,
  ConfirmContainer,
  ModalInputWrap,
  QRGuide,
} from './styles';
import RequestQR from '../requestQR';

const ConfirmTxModal = () => {
  const confirmTxModalState = useSelector((state: rootState) => state.modal.confirmTx);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { isLedger, isMobileApp, address } = useSelector((state: rootState) => state.wallet);

  const { enqueueSnackbar } = useSnackbar();
  const { isCorrectPassword } = useFirma();

  const [password, setPassword] = useState('');
  const [actionName, setActionName] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('0.02');
  const [memo, setMemo] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [isActive, setActive] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (Object.keys(modalData).length > 0) {
      setActionName(modalData.action);
      setAmount(modalData.data.amount);

      modalData.data.memo && setMemo(modalData.data.memo);
      modalData.data.targetAddress && setTargetAddress(modalData.data.targetAddress);

      if (modalData.data.fees) {
        setFee(convertToFctString(modalData.data.fees.toString()));
      } else {
        setFee(convertToFctString(getDefaultFee(isLedger, isMobileApp).toString()));
      }
    }
  }, [modalData]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeConfirmTxModal = () => {
    modalActions.handleModalConfirmTx(false);
  };

  const queueTx = () => {
    if (isActive || isLedger) {
      if (isCorrectPassword(password) || isLedger) {
        closeConfirmTxModal();
        modalActions.handleModalQueueTx(true);
      } else {
        enqueueSnackbar('Invalid Password', {
          variant: 'error',
          autoHideDuration: 2000,
        });
      }
    }
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
    setActive(e.target.value.length >= 8);
  };

  const onKeyDownPassword = (e: any) => {
    if (e.key === 'Enter') {
      queueTx();
    }
  };

  const onSuccess = () => {
    enqueueSnackbar('Success Transaction', {
      variant: 'success',
      autoHideDuration: 1000,
    });
    closeConfirmTxModal();
    setTimeout(() => window.location.reload(), 1000);
  };

  const onFailed = () => {
    enqueueSnackbar('Failed Transaction', {
      variant: 'error',
      autoHideDuration: 1000,
    });
    closeConfirmTxModal();
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Modal
      visible={confirmTxModalState}
      closable={true}
      visibleClose={false}
      onClose={closeConfirmTxModal}
      width={confirmTxModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Confirm</ModalTitle>
        <ModalContent>
          <ConfirmContainer>
            {targetAddress && (
              <ConfirmWrapper>
                <ConfirmLabel>To</ConfirmLabel>
                <ConfirmInput>{targetAddress}</ConfirmInput>
              </ConfirmWrapper>
            )}

            {isValidString(amount) && (
              <ConfirmWrapper>
                <ConfirmLabel>Amount</ConfirmLabel>
                <ConfirmInput point={true}>
                  {`${convertNumberFormat(amount, 6)}`}
                  <span>&nbsp;{CHAIN_CONFIG.PARAMS.SYMBOL}</span>
                </ConfirmInput>
              </ConfirmWrapper>
            )}

            <ConfirmWrapper>
              <ConfirmLabel>Fee</ConfirmLabel>
              <ConfirmInput>
                {convertNumberFormat(fee, 6)}
                <span>&nbsp;{CHAIN_CONFIG.PARAMS.SYMBOL}</span>
              </ConfirmInput>
            </ConfirmWrapper>

            <ConfirmWrapper>
              <ConfirmLabel>Memo</ConfirmLabel>
              <ConfirmInput>{memo.length > 40 ? memo.substring(0, 40) + '...' : memo}</ConfirmInput>
            </ConfirmWrapper>
          </ConfirmContainer>
          {isMobileApp && Object.keys(modalData).length > 0 ? (
            <>
              <QRGuide>{'Please scan the QR code with\nyour mobile Firma Station for transaction.'}</QRGuide>
              <RequestQR
                module={modalData.module}
                params={modalData.txParams()}
                signer={address}
                onSuccess={onSuccess}
                onFailed={onFailed}
              ></RequestQR>
            </>
          ) : (
            isLedger === false && (
              <PasswordWrapper>
                <ModalInputWrap>
                  <ModalLabel>Password</ModalLabel>
                  <InputBoxDefault
                    ref={inputRef}
                    placeholder='Enter Password'
                    type='password'
                    value={password}
                    onChange={onChangePassword}
                    onKeyDown={onKeyDownPassword}
                    autoFocus={true}
                  />
                </ModalInputWrap>
              </PasswordWrapper>
            )
          )}

          <ButtonWrapper>
            <CancelButton onClick={() => closeConfirmTxModal()} status={1}>
              Cancel
            </CancelButton>
            {(isMobileApp === false || isMobileApp === undefined) && (
              <NextButton onClick={() => queueTx()} status={isActive || isLedger ? 0 : 2}>
                {isLedger ? `Sign Ledger` : actionName}
              </NextButton>
            )}
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ConfirmTxModal);
