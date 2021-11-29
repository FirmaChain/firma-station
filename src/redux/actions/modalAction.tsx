import {
  HANDLE_MODAL_RESET,
  HANDLE_MODAL_DATA,
  HANDLE_MODAL_QRCODE,
  HANDLE_MODAL_NETWORK,
  HANDLE_MODAL_LOGIN,
  HANDLE_MODAL_NEWWALLET,
  HANDLE_MODAL_CONFIRMWALLET,
  HANDLE_MODAL_RECOVERMNEMONIC,
  HANDLE_MODAL_IMPORTPRIVATEKEY,
  HANDLE_MODAL_CONNECTLEDGER,
  HANDLE_MODAL_DELEGATE,
  HANDLE_MODAL_REDELEGATE,
  HANDLE_MODAL_UNDELEGATE,
  HANDLE_MODAL_DEPOSIT,
  HANDLE_MODAL_VOTING,
  HANDLE_MODAL_NEWPROPOSAL,
  HANDLE_MODAL_SEND,
  HANDLE_MODAL_CONFIRMTX,
  HANDLE_MODAL_QUEUETX,
  HANDLE_MODAL_RESULTTX,
} from "../types";

export const handleModalReset = () => ({ type: HANDLE_MODAL_RESET });
export const handleModalData = (data: any) => ({ type: HANDLE_MODAL_DATA, data });

export const handleModalQRCode = (isVisible: boolean) => ({ type: HANDLE_MODAL_QRCODE, isVisible });
export const handleModalNetwork = (isVisible: boolean) => ({ type: HANDLE_MODAL_NETWORK, isVisible });
export const handleModalLogin = (isVisible: boolean) => ({ type: HANDLE_MODAL_LOGIN, isVisible });
export const handleModalNewWallet = (isVisible: boolean) => ({ type: HANDLE_MODAL_NEWWALLET, isVisible });
export const handleModalConfirmWallet = (isVisible: boolean) => ({ type: HANDLE_MODAL_CONFIRMWALLET, isVisible });
export const handleModalRecoverMnemonic = (isVisible: boolean) => ({ type: HANDLE_MODAL_RECOVERMNEMONIC, isVisible });
export const handleModalImportPrivatekey = (isVisible: boolean) => ({ type: HANDLE_MODAL_IMPORTPRIVATEKEY, isVisible });
export const handleModalConnectLedger = (isVisible: boolean) => ({ type: HANDLE_MODAL_CONNECTLEDGER, isVisible });

export const handleModalDelegate = (isVisible: boolean) => ({ type: HANDLE_MODAL_DELEGATE, isVisible });
export const handleModalRedelegate = (isVisible: boolean) => ({ type: HANDLE_MODAL_REDELEGATE, isVisible });
export const handleModalUndelegate = (isVisible: boolean) => ({ type: HANDLE_MODAL_UNDELEGATE, isVisible });
export const handleModalDeposit = (isVisible: boolean) => ({ type: HANDLE_MODAL_DEPOSIT, isVisible });
export const handleModalVoting = (isVisible: boolean) => ({ type: HANDLE_MODAL_VOTING, isVisible });
export const handleModalNewProposal = (isVisible: boolean) => ({ type: HANDLE_MODAL_NEWPROPOSAL, isVisible });
export const handleModalSend = (isVisible: boolean) => ({ type: HANDLE_MODAL_SEND, isVisible });

export const handleModalConfirmTx = (isVisible: boolean) => ({ type: HANDLE_MODAL_CONFIRMTX, isVisible });
export const handleModalQueueTx = (isVisible: boolean) => ({ type: HANDLE_MODAL_QUEUETX, isVisible });
export const handleModalResultTx = (isVisible: boolean) => ({ type: HANDLE_MODAL_RESULTTX, isVisible });
