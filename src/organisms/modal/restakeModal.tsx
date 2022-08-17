import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import useFirma from '../../utils/wallet';
import { convertNumberFormat, convertToFctNumber, getFeesFromGas, getUTCDateFormat } from '../../utils/common';

import {
  restakeModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ValueContainer,
  ValueItem,
  ValueLabel,
  ValueText,
  ButtonWrapper,
  RestakeButton,
  Divider,
  DividerSolid,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
} from './styles';

const RestakeModal = () => {
  const restakeModalState = useSelector((state: rootState) => state.modal.restake);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { isLedger } = useSelector((state: rootState) => state.wallet);

  const { enqueueSnackbar } = useSnackbar();

  const {
    grantStakeAuthorizationDelegate,
    revokeStakeAuthorizationDelegate,
    getGasEstimationGrantStakeAuthorizationDelegate,
    getGasEstimationRevokeStakeAuthorizationDelegate,
  } = useFirma();

  const [validatorAddressList, setValidatorAddressList] = useState([]);
  const [isActiveRestake, setActiveRestake] = useState(false);
  const [frequency, setFrequency] = useState('4 Hours');
  const [minimumRewards, setMinimumRewards] = useState('10 FCT');
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());
  const [totalDelegated, setTotalDelegated] = useState('0');
  const [totalRewards, setTotalRewards] = useState('0');

  const closeRestakeModal = () => {
    modalActions.handleModalRestake(false);
  };

  useEffect(() => {
    if (restakeModalState) {
      if (modalData.validatorAddressList && modalData.validatorAddressList.length > 0) {
        setValidatorAddressList(modalData.validatorAddressList);
        setActiveRestake(modalData.isActiveRestake);
        setExpiryDate(getNextYear());

        modalData.frequency && setFrequency(modalData.frequency);
        modalData.minimumRewards && setMinimumRewards(`${convertToFctNumber(modalData.minimumRewards)} FCT`);
        modalData.totalDelegated && setTotalDelegated(`${getFCTFormat(modalData.totalDelegated)} FCT`);
        modalData.totalRewards && setTotalRewards(`${getFCTFormat(modalData.totalRewards)} FCT`);
      }
    }
  }, [restakeModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const getFCTFormat = (ufct: string) => {
    return convertNumberFormat(convertToFctNumber(ufct), 3);
  };

  const getNextYear = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  };

  const grantStakeAuthorizationDelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    grantStakeAuthorizationDelegate(validatorAddressList, expiryDate, 0, gas)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const revokeStakeAuthorizationDelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    revokeStakeAuthorizationDelegate(gas)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const onClickEnable = () => {
    if (isLedger) modalActions.handleModalGasEstimation(true);

    getGasEstimationGrantStakeAuthorizationDelegate(validatorAddressList, expiryDate, 0)
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

        modalActions.handleModalData({
          action: 'Grant restake',
          data: { fees: getFeesFromGas(gas), gas },
          txAction: grantStakeAuthorizationDelegateTx,
        });

        closeRestakeModal();
        modalActions.handleModalConfirmTx(true);
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
        if (isLedger) modalActions.handleModalGasEstimation(false);
      });
  };

  const onClickDisable = () => {
    if (isLedger) modalActions.handleModalGasEstimation(true);

    getGasEstimationRevokeStakeAuthorizationDelegate()
      .then((gas) => {
        if (isLedger) modalActions.handleModalGasEstimation(false);

        modalActions.handleModalData({
          action: 'Revoke restake',
          data: { fees: getFeesFromGas(gas), gas },
          txAction: revokeStakeAuthorizationDelegateTx,
        });

        closeRestakeModal();
        modalActions.handleModalConfirmTx(true);
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
        if (isLedger) modalActions.handleModalGasEstimation(false);
      });
  };

  return (
    <Modal
      visible={restakeModalState}
      closable={true}
      maskClosable={true}
      onClose={closeRestakeModal}
      width={restakeModalWidth}
    >
      <ModalContainer>
        <ModalTitle>RESTAKE</ModalTitle>
        <ModalContent>
          <ValueContainer style={{ gap: '10px' }}>
            <ValueItem>
              <ValueLabel>Total Delegated</ValueLabel>
              <ValueText>{totalDelegated}</ValueText>
            </ValueItem>
            <ValueItem>
              <ValueLabel>Total Rewards</ValueLabel>
              <ValueText>{totalRewards}</ValueText>
            </ValueItem>
          </ValueContainer>
          <DividerSolid />
          <ValueContainer>
            <ValueItem>
              <ValueLabel>Frequency</ValueLabel>
              <ValueText>{frequency}</ValueText>
            </ValueItem>
            <ValueItem>
              <ValueLabel>Minimum Reward</ValueLabel>
              <ValueText>{minimumRewards}</ValueText>
            </ValueItem>
            <ValueItem>
              <ValueLabel>Expiry Date</ValueLabel>
              <ValueText>{getUTCDateFormat(expiryDate)}</ValueText>
            </ValueItem>
          </ValueContainer>
          <Divider />

          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>Performs a restake to all validators currently being delegated.</ModalTooltipTypo>
          </ModalTooltipWrapper>
          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>
              If you delegate to a new validator after activating restake, you must update restake
            </ModalTooltipTypo>
          </ModalTooltipWrapper>

          <ButtonWrapper>
            {isActiveRestake ? (
              <>
                <RestakeButton onClick={onClickDisable} active={false}>
                  Disable
                </RestakeButton>
                <RestakeButton onClick={onClickEnable} active={true}>
                  Update
                </RestakeButton>
              </>
            ) : (
              <RestakeButton onClick={onClickEnable} active={true}>
                Enable
              </RestakeButton>
            )}
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(RestakeModal);
