import { createReducer } from '@reduxjs/toolkit';

import {
	HANDLE_MODAL_CHANGEPASSWORD,
	HANDLE_MODAL_CONFIRMTX,
	HANDLE_MODAL_CONFIRMWALLET,
	HANDLE_MODAL_CONNECTAPP,
	HANDLE_MODAL_CONNECTLEDGER,
	HANDLE_MODAL_DATA,
	HANDLE_MODAL_DELEGATE,
	HANDLE_MODAL_DEPOSIT,
	HANDLE_MODAL_DISCONNECT,
	HANDLE_MODAL_EXPORTMNEMONIC,
	HANDLE_MODAL_EXPORTPRIVATEKEY,
	HANDLE_MODAL_GASESTIMATION,
	HANDLE_MODAL_LOGIN,
	HANDLE_MODAL_NEWPROPOSAL,
	HANDLE_MODAL_NEWWALLET,
	HANDLE_MODAL_PAPERWALLET,
	HANDLE_MODAL_QRCODE,
	HANDLE_MODAL_QUEUETX,
	HANDLE_MODAL_RECOVERMNEMONIC,
	HANDLE_MODAL_REDELEGATE,
	HANDLE_MODAL_REDELEGATERESTAKE,
	HANDLE_MODAL_RESET,
	HANDLE_MODAL_RESTAKE,
	HANDLE_MODAL_SEND,
	HANDLE_MODAL_SETTINGS,
	HANDLE_MODAL_UNDELEGATE,
	HANDLE_MODAL_VOTING
} from '../types';

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

const initialState: IModalState = {
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

export default createReducer(initialState, (builder) => {
	builder
		.addCase(HANDLE_MODAL_RESET, () => {
			return {
				...initialState
			};
		})
		.addCase(HANDLE_MODAL_DATA, (state, { data }: any) => {
			state.data = data;
		})
		.addCase(HANDLE_MODAL_PAPERWALLET, (state, { isVisible }: any) => {
			state.paperwallet = isVisible;
		})
		.addCase(HANDLE_MODAL_QRCODE, (state, { isVisible }: any) => {
			state.qrcode = isVisible;
		})
		.addCase(HANDLE_MODAL_LOGIN, (state, { isVisible }: any) => {
			state.login = isVisible;
		})
		.addCase(HANDLE_MODAL_SETTINGS, (state, { isVisible }: any) => {
			state.settings = isVisible;
		})
		.addCase(HANDLE_MODAL_NEWWALLET, (state, { isVisible }: any) => {
			state.newWallet = isVisible;
		})
		.addCase(HANDLE_MODAL_CONFIRMWALLET, (state, { isVisible }: any) => {
			state.confirmWallet = isVisible;
		})
		.addCase(HANDLE_MODAL_RECOVERMNEMONIC, (state, { isVisible }: any) => {
			state.recoverMnemonic = isVisible;
		})
		.addCase(HANDLE_MODAL_EXPORTPRIVATEKEY, (state, { isVisible }: any) => {
			state.exportPrivatekey = isVisible;
		})
		.addCase(HANDLE_MODAL_EXPORTMNEMONIC, (state, { isVisible }: any) => {
			state.exportMnemonic = isVisible;
		})
		.addCase(HANDLE_MODAL_CHANGEPASSWORD, (state, { isVisible }: any) => {
			state.changePassword = isVisible;
		})
		.addCase(HANDLE_MODAL_CONNECTLEDGER, (state, { isVisible }: any) => {
			state.connectLedger = isVisible;
		})
		.addCase(HANDLE_MODAL_CONNECTAPP, (state, { isVisible }: any) => {
			state.connectApp = isVisible;
		})
		.addCase(HANDLE_MODAL_DISCONNECT, (state, { isVisible }: any) => {
			state.disconnect = isVisible;
		})
		.addCase(HANDLE_MODAL_DELEGATE, (state, { isVisible }: any) => {
			state.delegate = isVisible;
		})
		.addCase(HANDLE_MODAL_REDELEGATE, (state, { isVisible }: any) => {
			state.redelegate = isVisible;
		})
		.addCase(HANDLE_MODAL_UNDELEGATE, (state, { isVisible }: any) => {
			state.undelegate = isVisible;
		})
		.addCase(HANDLE_MODAL_DEPOSIT, (state, { isVisible }: any) => {
			state.deposit = isVisible;
		})
		.addCase(HANDLE_MODAL_VOTING, (state, { isVisible }: any) => {
			state.voting = isVisible;
		})
		.addCase(HANDLE_MODAL_NEWPROPOSAL, (state, { isVisible }: any) => {
			state.newProposal = isVisible;
		})
		.addCase(HANDLE_MODAL_SEND, (state, { isVisible }: any) => {
			state.send = isVisible;
		})
		.addCase(HANDLE_MODAL_CONFIRMTX, (state, { isVisible }: any) => {
			state.confirmTx = isVisible;
		})
		.addCase(HANDLE_MODAL_QUEUETX, (state, { isVisible }: any) => {
			state.queueTx = isVisible;
		})
		.addCase(HANDLE_MODAL_GASESTIMATION, (state, { isVisible }: any) => {
			state.gasEstimation = isVisible;
		})
		.addCase(HANDLE_MODAL_RESTAKE, (state, { isVisible }: any) => {
			state.restake = isVisible;
		})
		.addCase(HANDLE_MODAL_REDELEGATERESTAKE, (state, { isVisible }: any) => {
			state.redelegateRestake = isVisible;
		});
});
