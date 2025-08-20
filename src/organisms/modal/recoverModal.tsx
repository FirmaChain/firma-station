import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { isValidString } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_RECOVER_FROM_MNEMONIC } from '../../config';

import Password from './password';

import {
  recoverMnemonicModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  MnemonicTextArea,
  RecoverButton,
  HelpIcon,
  PrivatekeyTextArea,
  RecoverTypeWrap,
  RecoverTypeList,
  RecoverTypeItem,
  ModalInputWrap,
} from './styles';

const RecoverModal = () => {
  const recoverMnemonicModalState = useSelector((state: rootState) => state.modal.recoverMnemonic);

  const { enqueueSnackbar } = useSnackbar();
  const { storeWalletFromMnemonic, storeWalletFromPrivateKey } = useFirma();

  const [recoverType, setRecoverType] = useState(0);
  const [isActiveRecoverButton, activeRecoverButton] = useState(false);
  const [inputWord, setInputWord] = useState('');
  const [password, setPassword] = useState('');

  const inputRefMnemonic = useRef<HTMLTextAreaElement>();
  const inputRefPrivateKey = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    activeRecoverButton(false);
    setInputWord('');
    setPassword('');
  }, [recoverType]);

  const recoverWallet = () => {
    if (isValidString(password)) {
      storeWallet()
        .then(() => {
          enqueueSnackbar('Success Recovered Your Wallet', {
            variant: 'success',
            autoHideDuration: 2000,
          });
          closeModal();
        })
        .catch((error) => {
          console.log(error);
          enqueueSnackbar('Invalidate Mnemonic Words', {
            variant: 'error',
            autoHideDuration: 2000,
          });
        });
    } else {
      enqueueSnackbar('Invalid input fields', {
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
  };

  const storeWallet = async () => {
    if (recoverType === 1) {
      return storeWalletFromPrivateKey(password, inputWord);
    } else {
      return storeWalletFromMnemonic(password, inputWord);
    }
  };

  const cancelWallet = () => {
    closeModal();
  };

  const prevModal = () => {
    closeModal();
    modalActions.handleModalLogin(true);
  };

  const closeModal = () => {
    if (inputRefMnemonic.current) inputRefMnemonic.current.value = '';

    activeRecoverButton(false);
    setInputWord('');
    modalActions.handleModalRecoverMnemonic(false);
  };

  const checkWords = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      return;
    }

    e.target.value = e.target.value.replace(recoverType === 0 ? /[^A-Za-z\s]/gi : /[^A-Za-z0-9]/gi, '');

    const checkValue = e.target.value.replace(/ +/g, ' ').replace(/^\s+|\s+$/g, '');
    activeRecoverButton(recoverType === 0 ? checkValue.split(' ').length === 24 : checkValue.length === 66);
    setInputWord(checkValue);
  };

  const onChangePassword = (password: string) => {
    setPassword(password);
  };

  const onKeyDownPassword = () => {
    if (isActiveRecoverButton) recoverWallet();
  };

  return (
    <Modal
      visible={recoverMnemonicModalState}
      closable={true}
      onClose={cancelWallet}
      prev={prevModal}
      width={recoverMnemonicModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          Recover Wallet
          <HelpIcon onClick={() => window.open(GUIDE_LINK_RECOVER_FROM_MNEMONIC)} />
        </ModalTitle>
        <ModalContent>
          <RecoverTypeWrap>
            <RecoverTypeList>
              <RecoverTypeItem isActive={recoverType === 0} onClick={() => setRecoverType(0)}>
                Mnemonic
              </RecoverTypeItem>
              <RecoverTypeItem isActive={recoverType === 1} onClick={() => setRecoverType(1)}>
                Private Key
              </RecoverTypeItem>
            </RecoverTypeList>
          </RecoverTypeWrap>
          <ModalInputWrap>
            <ModalLabel>{recoverType === 0 ? 'Mnemonic' : 'Private Key'}</ModalLabel>
            <ModalInput>
              {recoverType === 0 ? (
                <MnemonicTextArea 
                  onChange={checkWords} 
                  ref={inputRefMnemonic} 
                  placeholder='Enter Mnemonic'
                  data-testid="recover-mnemonic-textarea"
                />
              ) : (
                <PrivatekeyTextArea 
                  onChange={checkWords} 
                  ref={inputRefPrivateKey} 
                  placeholder='Enter Private Key'
                  data-testid="recover-privatekey-textarea"
                />
              )}
            </ModalInput>
          </ModalInputWrap>

          <Password onChange={onChangePassword} onKeyDown={onKeyDownPassword} />

          <RecoverButton
            status={isActiveRecoverButton ? 0 : 2}
            onClick={() => {
              if (isActiveRecoverButton) recoverWallet();
            }}
            data-testid="login-recover-button"
          >
            Recover
          </RecoverButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(RecoverModal);
