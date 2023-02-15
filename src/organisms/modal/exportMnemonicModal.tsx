import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { QRCode } from 'react-qrcode-logo';

import useFirma from '../../utils/wallet';
import { copyToClipboard } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_EXPORT_MNEMONIC } from '../../config';

import {
  exportMnemonicModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  ModalInputWrap,
  ExportPasswordWrapper,
  InputBoxDefault,
  ExportButton,
  CopyIcon,
  HelpIcon,
  ButtonWrapper,
  CancelButton,
  MnemonicBox,
  ExportQRContainer,
  QRWrapper,
} from './styles';
import theme from '../../themes';

const ExportMnemonicModal = () => {
  const exportMnemonicModalState = useSelector((state: rootState) => state.modal.exportMnemonic);
  const { isCorrectPassword, getDecryptMnemonic } = useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const inputRef = useRef(null);

  const exportWallet = () => {
    if (isCorrectPassword(password)) {
      const mnemonic = getDecryptMnemonic();

      if (mnemonic === '') {
        enqueueSnackbar('Faild get Mnemonic (Private Key User)', {
          variant: 'error',
          autoHideDuration: 2000,
        });
      }
      setMnemonic(getDecryptMnemonic());
    } else {
      enqueueSnackbar('Invalid Password', {
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
  };

  const clipboard = () => {
    copyToClipboard(mnemonic);

    enqueueSnackbar('Copied', {
      variant: 'success',
      autoHideDuration: 1000,
    });
  };

  const closeModal = () => {
    modalActions.handleModalExportMnemonic(false);
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const onKeyDownPassword = (e: any) => {
    if (e.key === 'Enter') {
      if (password.length >= 8) exportWallet();
    }
  };
  return (
    <Modal
      visible={exportMnemonicModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={exportMnemonicModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          Export Mnemonic
          <HelpIcon onClick={() => window.open(GUIDE_LINK_EXPORT_MNEMONIC)} />
        </ModalTitle>
        <ModalContent>
          {mnemonic === '' ? (
            <>
              <ModalInputWrap>
                <ModalLabel>Password</ModalLabel>
                <ExportPasswordWrapper>
                  <InputBoxDefault
                    ref={inputRef}
                    placeholder='Enter Password'
                    type='password'
                    value={password}
                    onChange={onChangePassword}
                    onKeyDown={onKeyDownPassword}
                    autoFocus={true}
                  />
                </ExportPasswordWrapper>
              </ModalInputWrap>
              <ButtonWrapper>
                <CancelButton onClick={() => closeModal()} status={1}>
                  Cancel
                </CancelButton>

                <ExportButton
                  status={password.length >= 8 ? 0 : 2}
                  onClick={() => {
                    if (password.length >= 8) exportWallet();
                  }}
                >
                  Export
                </ExportButton>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <ModalInputWrap>
                <ModalLabel>Mnemonic</ModalLabel>
                <ModalInput>
                  <MnemonicBox>{mnemonic}</MnemonicBox>
                  <CopyIcon onClick={clipboard} />
                </ModalInput>
              </ModalInputWrap>
              <ExportQRContainer>
                <QRWrapper>
                  <QRCode value={mnemonic} quietZone={0} logoImage={theme.urls.qrIcon} logoWidth={40} logoHeight={40} />
                </QRWrapper>
              </ExportQRContainer>
              <ButtonWrapper>
                <CancelButton onClick={() => closeModal()} status={1}>
                  OK
                </CancelButton>
              </ButtonWrapper>
            </>
          )}
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(ExportMnemonicModal);
