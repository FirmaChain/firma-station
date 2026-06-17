import React, { useRef, useState } from 'react';

import { Modal } from '../../components/modal';
import { modalActions, useModalStore } from '../../store';
import Password from './password';
import {
	ButtonWrapper,
	CancelButton,
	ChangeButton,
	changePasswordModalWidth,
	ExportPasswordWrapper,
	InputBoxDefault,
	ModalContainer,
	ModalContent,
	ModalInputWrap,
	ModalLabel,
	ModalTitle
} from './styles';

const ChangePasswordModal = () => {
	const changePasswordModalState = useModalStore((state) => state.changePassword);

	const [password, setPassword] = useState('');
	const inputRef = useRef(null);

	const closeModal = () => {
		modalActions.handleModalChangePassword(false);
	};

	const onChangePassword = (e: any) => {
		if (e === null) return;
		setPassword(e.target.value);
	};

	const onChangeNewPassword = (newPassword: string) => {};

	const onKeyDownPassword = () => {};

	return (
		<Modal
			visible={changePasswordModalState}
			closable={true}
			visibleClose={false}
			onClose={closeModal}
			width={changePasswordModalWidth}
		>
			<ModalContainer>
				<ModalTitle>Change Password</ModalTitle>
				<ModalContent>
					<ModalInputWrap>
						<ModalLabel>Current Password</ModalLabel>
						<ExportPasswordWrapper>
							<InputBoxDefault
								ref={inputRef}
								placeholder="Enter Current Password"
								type="password"
								value={password}
								onChange={onChangePassword}
								autoFocus={true}
							/>
						</ExportPasswordWrapper>
					</ModalInputWrap>
					<Password onChange={onChangeNewPassword} onKeyDown={onKeyDownPassword} />

					<ButtonWrapper>
						<CancelButton onClick={() => closeModal()} $status={1}>
							Cancel
						</CancelButton>
						<ChangeButton $status={0}>Change</ChangeButton>
					</ButtonWrapper>
				</ModalContent>
			</ModalContainer>
		</Modal>
	);
};

export default React.memo(ChangePasswordModal);
