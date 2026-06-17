import { create } from 'zustand';

export interface IModalState {
	data: any;
	paperwallet: boolean;
	qrcode: boolean;
	login: boolean;
	settings: boolean;
	disconnect: boolean;
	newWallet: boolean;
	confirmWallet: boolean;
	recoverMnemonic: boolean;
	exportPrivatekey: boolean;
	exportMnemonic: boolean;
	changePassword: boolean;
	connectLedger: boolean;
	connectApp: boolean;
	delegate: boolean;
	redelegate: boolean;
	undelegate: boolean;
	deposit: boolean;
	voting: boolean;
	newProposal: boolean;
	send: boolean;
	confirmTx: boolean;
	queueTx: boolean;
	gasEstimation: boolean;
	restake: boolean;
	redelegateRestake: boolean;
}

interface ModalStore extends IModalState {
	handleModalReset: () => void;
	handleModalData: (data: any) => void;
	handleModalPaperwallet: (isVisible: boolean) => void;
	handleModalQRCode: (isVisible: boolean) => void;
	handleModalLogin: (isVisible: boolean) => void;
	handleModalSettings: (isVisible: boolean) => void;
	handleModalNewWallet: (isVisible: boolean) => void;
	handleModalConfirmWallet: (isVisible: boolean) => void;
	handleModalRecoverMnemonic: (isVisible: boolean) => void;
	handleModalExportPrivatekey: (isVisible: boolean) => void;
	handleModalExportMnemonic: (isVisible: boolean) => void;
	handleModalChangePassword: (isVisible: boolean) => void;
	handleModalConnectLedger: (isVisible: boolean) => void;
	handleModalConnectApp: (isVisible: boolean) => void;
	handleModalDisconnect: (isVisible: boolean) => void;
	handleModalDelegate: (isVisible: boolean) => void;
	handleModalRedelegate: (isVisible: boolean) => void;
	handleModalUndelegate: (isVisible: boolean) => void;
	handleModalDeposit: (isVisible: boolean) => void;
	handleModalVoting: (isVisible: boolean) => void;
	handleModalNewProposal: (isVisible: boolean) => void;
	handleModalSend: (isVisible: boolean) => void;
	handleModalConfirmTx: (isVisible: boolean) => void;
	handleModalQueueTx: (isVisible: boolean) => void;
	handleModalGasEstimation: (isVisible: boolean) => void;
	handleModalRestake: (isVisible: boolean) => void;
	handleModalRedelegateRestake: (isVisible: boolean) => void;
}

const initialModalState: IModalState = {
	data: {},
	paperwallet: false,
	qrcode: false,
	login: false,
	settings: false,
	disconnect: false,
	newWallet: false,
	confirmWallet: false,
	recoverMnemonic: false,
	exportPrivatekey: false,
	exportMnemonic: false,
	changePassword: false,
	connectLedger: false,
	connectApp: false,
	delegate: false,
	redelegate: false,
	undelegate: false,
	deposit: false,
	voting: false,
	newProposal: false,
	send: false,
	confirmTx: false,
	queueTx: false,
	gasEstimation: false,
	restake: false,
	redelegateRestake: false
};

const setModalValue = <K extends keyof IModalState>(key: K, value: IModalState[K]) => {
	useModalStore.setState({ [key]: value } as Pick<IModalState, K>);
};

export const useModalStore = create<ModalStore>()(() => ({
	...initialModalState,
	handleModalReset: () => useModalStore.setState({ ...initialModalState }),
	handleModalData: (data: any) => setModalValue('data', data),
	handleModalPaperwallet: (isVisible: boolean) => setModalValue('paperwallet', isVisible),
	handleModalQRCode: (isVisible: boolean) => setModalValue('qrcode', isVisible),
	handleModalLogin: (isVisible: boolean) => setModalValue('login', isVisible),
	handleModalSettings: (isVisible: boolean) => setModalValue('settings', isVisible),
	handleModalNewWallet: (isVisible: boolean) => setModalValue('newWallet', isVisible),
	handleModalConfirmWallet: (isVisible: boolean) => setModalValue('confirmWallet', isVisible),
	handleModalRecoverMnemonic: (isVisible: boolean) => setModalValue('recoverMnemonic', isVisible),
	handleModalExportPrivatekey: (isVisible: boolean) => setModalValue('exportPrivatekey', isVisible),
	handleModalExportMnemonic: (isVisible: boolean) => setModalValue('exportMnemonic', isVisible),
	handleModalChangePassword: (isVisible: boolean) => setModalValue('changePassword', isVisible),
	handleModalConnectLedger: (isVisible: boolean) => setModalValue('connectLedger', isVisible),
	handleModalConnectApp: (isVisible: boolean) => setModalValue('connectApp', isVisible),
	handleModalDisconnect: (isVisible: boolean) => setModalValue('disconnect', isVisible),
	handleModalDelegate: (isVisible: boolean) => setModalValue('delegate', isVisible),
	handleModalRedelegate: (isVisible: boolean) => setModalValue('redelegate', isVisible),
	handleModalUndelegate: (isVisible: boolean) => setModalValue('undelegate', isVisible),
	handleModalDeposit: (isVisible: boolean) => setModalValue('deposit', isVisible),
	handleModalVoting: (isVisible: boolean) => setModalValue('voting', isVisible),
	handleModalNewProposal: (isVisible: boolean) => setModalValue('newProposal', isVisible),
	handleModalSend: (isVisible: boolean) => setModalValue('send', isVisible),
	handleModalConfirmTx: (isVisible: boolean) => setModalValue('confirmTx', isVisible),
	handleModalQueueTx: (isVisible: boolean) => setModalValue('queueTx', isVisible),
	handleModalGasEstimation: (isVisible: boolean) => setModalValue('gasEstimation', isVisible),
	handleModalRestake: (isVisible: boolean) => setModalValue('restake', isVisible),
	handleModalRedelegateRestake: (isVisible: boolean) => setModalValue('redelegateRestake', isVisible)
}));

export const modalActions = {
	handleModalReset: () => useModalStore.getState().handleModalReset(),
	handleModalData: (data: any) => useModalStore.getState().handleModalData(data),
	handleModalPaperwallet: (isVisible: boolean) => useModalStore.getState().handleModalPaperwallet(isVisible),
	handleModalQRCode: (isVisible: boolean) => useModalStore.getState().handleModalQRCode(isVisible),
	handleModalLogin: (isVisible: boolean) => useModalStore.getState().handleModalLogin(isVisible),
	handleModalSettings: (isVisible: boolean) => useModalStore.getState().handleModalSettings(isVisible),
	handleModalNewWallet: (isVisible: boolean) => useModalStore.getState().handleModalNewWallet(isVisible),
	handleModalConfirmWallet: (isVisible: boolean) => useModalStore.getState().handleModalConfirmWallet(isVisible),
	handleModalRecoverMnemonic: (isVisible: boolean) => useModalStore.getState().handleModalRecoverMnemonic(isVisible),
	handleModalExportPrivatekey: (isVisible: boolean) => useModalStore.getState().handleModalExportPrivatekey(isVisible),
	handleModalExportMnemonic: (isVisible: boolean) => useModalStore.getState().handleModalExportMnemonic(isVisible),
	handleModalChangePassword: (isVisible: boolean) => useModalStore.getState().handleModalChangePassword(isVisible),
	handleModalConnectLedger: (isVisible: boolean) => useModalStore.getState().handleModalConnectLedger(isVisible),
	handleModalConnectApp: (isVisible: boolean) => useModalStore.getState().handleModalConnectApp(isVisible),
	handleModalDisconnect: (isVisible: boolean) => useModalStore.getState().handleModalDisconnect(isVisible),
	handleModalDelegate: (isVisible: boolean) => useModalStore.getState().handleModalDelegate(isVisible),
	handleModalRedelegate: (isVisible: boolean) => useModalStore.getState().handleModalRedelegate(isVisible),
	handleModalUndelegate: (isVisible: boolean) => useModalStore.getState().handleModalUndelegate(isVisible),
	handleModalDeposit: (isVisible: boolean) => useModalStore.getState().handleModalDeposit(isVisible),
	handleModalVoting: (isVisible: boolean) => useModalStore.getState().handleModalVoting(isVisible),
	handleModalNewProposal: (isVisible: boolean) => useModalStore.getState().handleModalNewProposal(isVisible),
	handleModalSend: (isVisible: boolean) => useModalStore.getState().handleModalSend(isVisible),
	handleModalConfirmTx: (isVisible: boolean) => useModalStore.getState().handleModalConfirmTx(isVisible),
	handleModalQueueTx: (isVisible: boolean) => useModalStore.getState().handleModalQueueTx(isVisible),
	handleModalGasEstimation: (isVisible: boolean) => useModalStore.getState().handleModalGasEstimation(isVisible),
	handleModalRestake: (isVisible: boolean) => useModalStore.getState().handleModalRestake(isVisible),
	handleModalRedelegateRestake: (isVisible: boolean) => useModalStore.getState().handleModalRedelegateRestake(isVisible)
};
