import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { QRCode } from 'react-qrcode-logo';

import useFirma from '../../utils/wallet';
import { copyToClipboard } from '../../utils/common';
import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { GUIDE_LINK_EXPORT_PRIVATE_KEY } from '../../config';

import {
  exportPrivatekeyModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalInput,
  ExportPasswordWrapper,
  InputBoxDefault,
  ExportButton,
  CopyIcon,
  HelpIcon,
  ButtonWrapper,
  CancelButton,
  ModalInputWrap,
  PrivatekeyBox,
  ExportQRContainer,
  QRWrapper,
} from './styles';
import theme from '../../themes';

const ExportPrivatekeyModal = () => {
  const exportPrivatekeyModalState = useSelector((state: rootState) => state.modal.exportPrivatekey);
  const { isCorrectPassword, getDecryptPrivateKey } = useFirma();
  const { enqueueSnackbar } = useSnackbar();

  const [password, setPassword] = useState('');
  const [privatekey, setPrivatekey] = useState('');
  const inputRef = useRef(null);

  const exportWallet = () => {
    if (isCorrectPassword(password)) {
      setPrivatekey(getDecryptPrivateKey());
    } else {
      enqueueSnackbar('Invalid Password', {
        variant: 'error',
        autoHideDuration: 2000,
      });
    }
  };

  const clipboard = () => {
    copyToClipboard(privatekey);

    enqueueSnackbar('Copied', {
      variant: 'success',
      autoHideDuration: 1000,
    });
  };

  const closeModal = () => {
    modalActions.handleModalExportPrivatekey(false);
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
      visible={exportPrivatekeyModalState}
      closable={true}
      visibleClose={false}
      onClose={closeModal}
      width={exportPrivatekeyModalWidth}
    >
      <ModalContainer>
        <ModalTitle>
          Export Private Key
          <HelpIcon onClick={() => window.open(GUIDE_LINK_EXPORT_PRIVATE_KEY)} />
        </ModalTitle>
        <ModalContent>
          {privatekey === '' ? (
            <>
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
                <ModalLabel>Private Key</ModalLabel>
                <ModalInput>
                  <CopyIcon style={{ left: '85px' }} onClick={clipboard} />
                  <PrivatekeyBox>{`${privatekey.substring(0, 50)}\n${privatekey.substring(50)}`}</PrivatekeyBox>
                </ModalInput>
              </ModalInputWrap>
              <ExportQRContainer>
                <QRWrapper>
                  <QRCode
                    value={privatekey}
                    quietZone={0}
                    logoImage={theme.urls.qrIcon}
                    logoWidth={40}
                    logoHeight={40}
                  />
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

export default React.memo(ExportPrivatekeyModal);
