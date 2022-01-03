import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import useFirma from "../../utils/wallet";

import {
  paperwalletModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  InputBoxDefault,
  ExportPasswordWrapper,
  ExportButton,
} from "./styles";

const PaperwalletModal = () => {
  const peperwalletModalState = useSelector((state: rootState) => state.modal.paperwallet);
  const { enqueueSnackbar } = useSnackbar();
  const { isCorrectPassword, downloadPaperWallet } = useFirma();

  const [password, setPassword] = useState("");
  const inputRef = useRef(null);

  const closePaperwalletModal = () => {
    modalActions.handleModalPaperwallet(false);
  };

  const onChangePassword = (e: any) => {
    if (e === null) return;
    setPassword(e.target.value);
  };

  const onKeyDownPassword = (e: any) => {
    if (e.key === "Enter") {
      if (password.length >= 8) {
        downloadWallet();
      }
    }
  };

  const downloadWallet = () => {
    if (isCorrectPassword(password)) {
      downloadPaperWallet()
        .then((uri) => {
          let a = document.createElement("a");
          a.href = uri;
          a.download = "firma-station-paper-wallet.pdf";
          a.click();
        })
        .catch((e) => {});
    } else {
      enqueueSnackbar("Invalid Password", {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
  };

  return (
    <Modal
      visible={peperwalletModalState}
      closable={true}
      maskClosable={true}
      onClose={closePaperwalletModal}
      width={paperwalletModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Downalod Paper Wallet</ModalTitle>
        <ModalContent>
          <ModalLabel>Password</ModalLabel>
          <ExportPasswordWrapper>
            <InputBoxDefault
              ref={inputRef}
              placeholder="********"
              type="password"
              value={password}
              onChange={onChangePassword}
              onKeyDown={onKeyDownPassword}
              autoFocus={true}
            />
          </ExportPasswordWrapper>

          <ExportButton
            active={password.length >= 8}
            onClick={() => {
              if (password.length >= 8) downloadWallet();
            }}
          >
            DOWNLOAD
          </ExportButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(PaperwalletModal);
