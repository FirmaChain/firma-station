import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";
import useFirma from "../../utils/wallet";
import { GUIDE_LINK_DOWNLOAD_PAPER_WALLET } from "../../config";

import {
  paperwalletModalWidth,
  ModalContainer,
  ModalTitle,
  ModalSubTitle,
  ModalContent,
  ModalLabel,
  ModalTypoWrapper,
  ModalTypo,
  ModalTooltipIcon,
  InputBoxDefault,
  ExportPasswordWrapper,
  DownloadButton,
  SamplePaperWallet,
  HelpIcon,
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
        autoHideDuration: 2000,
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
        <ModalTitle>
          DOWNLOAD PAPER WALLET
          <HelpIcon onClick={() => window.open(GUIDE_LINK_DOWNLOAD_PAPER_WALLET)} />
        </ModalTitle>
        <ModalSubTitle>It provides a private key in a form that can be printed out.</ModalSubTitle>
        <ModalContent>
          <SamplePaperWallet />
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
          <ModalTypoWrapper>
            <ModalTooltipIcon />
            <ModalTypo>Please download the file and store it separately in a safe place.</ModalTypo>
          </ModalTypoWrapper>
          <DownloadButton
            active={password.length >= 8}
            onClick={() => {
              if (password.length >= 8) downloadWallet();
            }}
          >
            Download
          </DownloadButton>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(PaperwalletModal);
