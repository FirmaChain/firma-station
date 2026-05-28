import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import {
  convertNumber,
  convertNumberFormat,
  convertToFctNumber,
  getFeesFromGas,
} from '../../utils/common';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { CHAIN_CONFIG } from '../../config';

import {
  redelegateRestakeModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ModalLabel,
  ModalValue,
  ModalInputRowWrap,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
  NextButton,
  ButtonWrapper,
  CancelButton,
} from './styles';

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ccc;
  font-size: 1.3rem;
  font-weight: 600;
`;

const InfoIconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  cursor: help;
`;

const InfoIcon = styled(InfoOutlinedIcon)`
  && {
    width: 16px;
    height: 16px;
    color: #888;
  }
`;

const ValidatorCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  background-color: #3d3b48;
  border-radius: 4px;
`;

const ValidatorCardHeader = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  cursor: ${(p) => (p.$disabled ? 'not-allowed' : 'pointer')};
`;

const RoleLabel = styled.span<{ $variant: 'source' | 'dest' }>`
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: ${(p) => (p.$variant === 'source' ? '#ff8a8a' : '#7bd17b')};
  flex-shrink: 0;
`;

const CardMoniker = styled.span`
  font-weight: 600;
  color: #fff;
  font-size: 1.3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
  flex: 1 1 auto;
`;

const RestakeToggleHint = styled.span`
  margin-left: auto;
  color: #888;
  font-size: 1.1rem;
  font-style: italic;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  font-size: 1.2rem;
  color: #888;
`;

const InfoValue = styled.span`
  color: #ccc;
  font-variant-numeric: tabular-nums;
`;

const Delta = styled.span<{ $direction: 'in' | 'out' }>`
  color: ${(p) => (p.$direction === 'out' ? '#ff8a8a' : '#7bd17b')};
  font-variant-numeric: tabular-nums;
`;

interface IRedelegateRestakeData {
  sourceValidator: string;
  sourceValidatorMoniker: string;
  sourceAmount: number;
  targetValidator: string;
  targetValidatorMoniker: string;
  amount: string;
  allowValidatorList: string[];
}

const RedelegateRestakeModal = () => {
  const redelegateRestakeModalState = useSelector((state: rootState) => state.modal.redelegateRestake);
  const modalData = useSelector((state: rootState) => state.modal.data);
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const {
    redelegate,
    redelegateWithGrant,
    getGasEstimationRedelegate,
    getGasEstimationRedelegateWithGrant,
    getDelegation,
    setUserData,
  } = useFirma();

  const [ctx, setCtx] = useState<IRedelegateRestakeData>({
    sourceValidator: '',
    sourceValidatorMoniker: '',
    sourceAmount: 0,
    targetValidator: '',
    targetValidatorMoniker: '',
    amount: '',
    allowValidatorList: [],
  });
  const [includeDstInRestake, setIncludeDstInRestake] = useState(false);
  const [removeSrcFromRestake, setRemoveSrcFromRestake] = useState(false);
  const [removeDstFromRestake, setRemoveDstFromRestake] = useState(false);
  const [destDelegation, setDestDelegation] = useState<number | null>(null);

  useEffect(() => {
    if (redelegateRestakeModalState && modalData?.data) {
      setCtx({
        sourceValidator: modalData.data.sourceValidator || '',
        sourceValidatorMoniker: modalData.data.sourceValidatorMoniker || modalData.data.sourceValidator || '',
        sourceAmount: modalData.data.sourceAmount || 0,
        targetValidator: modalData.data.targetValidator || '',
        targetValidatorMoniker: modalData.data.targetValidatorMoniker || modalData.data.targetValidator || '',
        amount: modalData.data.amount || '',
        allowValidatorList: modalData.data.allowValidatorList || [],
      });
      setIncludeDstInRestake(false);
      setRemoveSrcFromRestake(false);
      setRemoveDstFromRestake(false);
      setDestDelegation(null);

      const dst = modalData.data.targetValidator;
      if (dst) {
        getDelegation(dst)
          .then((d) => setDestDelegation(d ? convertToFctNumber(d.amount) : 0))
          .catch(() => setDestDelegation(0));
      }
    }
  }, [redelegateRestakeModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const closeModal = () => {
    modalActions.handleModalRedelegateRestake(false);
  };

  // Go back to the Redelegate input modal; modalData carries the previous
  // inputs so the user re-enters the modal with source/amount restored.
  const goBackToRedelegate = () => {
    modalActions.handleModalRedelegateRestake(false);
    modalActions.handleModalRedelegate(true);
  };

  const getNextYearExpiration = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  };

  // Apply card-header toggles to the existing allow_list:
  //   - Source card unchecked  → drop sourceValidator
  //   - Destination card checked when not already listed → add targetValidator
  //   - Destination card unchecked when already listed   → drop targetValidator
  const getCombinedAllowList = () => {
    const set = new Set(ctx.allowValidatorList);
    if (removeSrcFromRestake) set.delete(ctx.sourceValidator);
    if (removeDstFromRestake) set.delete(ctx.targetValidator);
    if (includeDstInRestake) set.add(ctx.targetValidator);
    return Array.from(set);
  };

  const redelegateTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    redelegate(ctx.sourceValidator, ctx.targetValidator, convertNumber(ctx.amount), gas)
      .then(() => {
        setUserData();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const getRedelegateParamsTx = () => {
    return {
      validatorSrcAddress: ctx.sourceValidator,
      validatorDstAddress: ctx.targetValidator,
      amount: ctx.amount,
    };
  };

  const redelegateWithGrantTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) => {
    redelegateWithGrant(
      ctx.sourceValidator,
      ctx.targetValidator,
      convertNumber(ctx.amount),
      getCombinedAllowList(),
      getNextYearExpiration(),
      0,
      gas
    )
      .then(() => {
        setUserData();
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });
  };

  const getCombinedParamsTx = () => {
    return {
      validatorSrcAddress: ctx.sourceValidator,
      validatorDstAddress: ctx.targetValidator,
      amount: ctx.amount,
      grantee: CHAIN_CONFIG.RESTAKE.ADDRESS,
      validatorAddressList: getCombinedAllowList(),
      maxTokens: '0',
      expirationDate: getNextYearExpiration().toISOString(),
    };
  };

  const proceedRedelegateOnly = () => {
    closeModal();
    modalActions.handleModalGasEstimation(true);

    getGasEstimationRedelegate(ctx.sourceValidator, ctx.targetValidator, convertNumber(ctx.amount))
      .then((gas) => {
        modalActions.handleModalGasEstimation(false);
        if (isMobileApp) gas += 50000;
        if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas, isLedger))) {
          modalActions.handleModalData({
            action: 'Redelegate',
            module: '/staking/redelegate',
            data: { amount: ctx.amount, fees: getFeesFromGas(gas, isLedger), gas },
            txAction: redelegateTx,
            txParams: getRedelegateParamsTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar('Insufficient funds. Please check your account balance.', {
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
      })
      .catch((e) => {
        modalActions.handleModalGasEstimation(false);
        enqueueSnackbar(e?.message ?? String(e), {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  const proceedRedelegateWithGrant = () => {
    closeModal();
    modalActions.handleModalGasEstimation(true);

    getGasEstimationRedelegateWithGrant(
      ctx.sourceValidator,
      ctx.targetValidator,
      convertNumber(ctx.amount),
      getCombinedAllowList(),
      getNextYearExpiration(),
      0
    )
      .then((gas) => {
        modalActions.handleModalGasEstimation(false);
        if (isMobileApp) gas += 50000;
        if (convertNumber(balance) >= convertToFctNumber(getFeesFromGas(gas, isLedger))) {
          modalActions.handleModalData({
            action: 'Redelegate + Restake',
            module: '/staking/redelegate-with-grant',
            data: { amount: ctx.amount, fees: getFeesFromGas(gas, isLedger), gas, messageCount: 2 },
            txAction: redelegateWithGrantTx,
            txParams: getCombinedParamsTx,
          });

          modalActions.handleModalConfirmTx(true);
        } else {
          enqueueSnackbar('Insufficient funds. Please check your account balance.', {
            variant: 'error',
            autoHideDuration: 2000,
          });
        }
      })
      .catch((e) => {
        modalActions.handleModalGasEstimation(false);
        enqueueSnackbar(e?.message ?? String(e), {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  // Same short-circuit as before: if the resulting allow_list is identical to
  // the current one (no-op checkboxes), skip the grant message entirely.
  const onClickNext = () => {
    const next = getCombinedAllowList();
    const same =
      next.length === ctx.allowValidatorList.length && next.every((v) => ctx.allowValidatorList.includes(v));
    if (same) {
      proceedRedelegateOnly();
      return;
    }
    proceedRedelegateWithGrant();
  };

  const dstAlreadyInRestake = ctx.allowValidatorList.includes(ctx.targetValidator);
  const srcInRestake = ctx.allowValidatorList.includes(ctx.sourceValidator);
  const hasPendingChange =
    (!dstAlreadyInRestake && includeDstInRestake) ||
    (dstAlreadyInRestake && removeDstFromRestake) ||
    (srcInRestake && removeSrcFromRestake);

  return (
    <Modal
      visible={redelegateRestakeModalState}
      closable={true}
      visibleClose={false}
      onClose={goBackToRedelegate}
      width={redelegateRestakeModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Restake</ModalTitle>
        <ModalContent>
          <ModalInputRowWrap>
            <ModalLabel>Source Validator</ModalLabel>
            <ModalValue title={ctx.sourceValidatorMoniker}>{ctx.sourceValidatorMoniker}</ModalValue>
          </ModalInputRowWrap>
          <ModalInputRowWrap style={{ marginBottom: '30px' }}>
            <ModalLabel>Destination Validator</ModalLabel>
            <ModalValue title={ctx.targetValidatorMoniker}>{ctx.targetValidatorMoniker}</ModalValue>
          </ModalInputRowWrap>

          <OptionsWrapper>
            <OptionsHeader>
              Update Restake Options
              <Tooltip
                title='Check an option to update your Restake validator list along with this redelegation. A single transaction with two messages (Redelegate + Restake update) will be broadcast.'
                arrow
                placement='top'
                enterTouchDelay={0}
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: '1.3rem',
                      lineHeight: 1.5,
                      maxWidth: 320,
                      padding: '10px 12px',
                    },
                  },
                }}
              >
                <InfoIconWrap>
                  <InfoIcon />
                </InfoIconWrap>
              </Tooltip>
            </OptionsHeader>

            <ValidatorCard>
              <ValidatorCardHeader $disabled={!srcInRestake}>
                <input
                  type='checkbox'
                  checked={srcInRestake && !removeSrcFromRestake}
                  disabled={!srcInRestake}
                  onChange={(e) => setRemoveSrcFromRestake(!e.target.checked)}
                />
                <RoleLabel $variant='source'>Source</RoleLabel>
                <CardMoniker title={ctx.sourceValidatorMoniker}>{ctx.sourceValidatorMoniker}</CardMoniker>
                {!srcInRestake && <RestakeToggleHint>not in Restake list</RestakeToggleHint>}
              </ValidatorCardHeader>
              <InfoRow>
                <span>Redelegate amount</span>
                <InfoValue>
                  <Delta $direction='out'>
                    -{ctx.amount} {CHAIN_CONFIG.PARAMS.SYMBOL}
                  </Delta>
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <span>Remaining balance</span>
                <InfoValue>
                  {convertNumberFormat(Math.max(ctx.sourceAmount - convertNumber(ctx.amount), 0), 6)}{' '}
                  {CHAIN_CONFIG.PARAMS.SYMBOL}
                </InfoValue>
              </InfoRow>
            </ValidatorCard>

            <ValidatorCard>
              <ValidatorCardHeader>
                <input
                  type='checkbox'
                  checked={dstAlreadyInRestake ? !removeDstFromRestake : includeDstInRestake}
                  onChange={(e) => {
                    if (dstAlreadyInRestake) setRemoveDstFromRestake(!e.target.checked);
                    else setIncludeDstInRestake(e.target.checked);
                  }}
                />
                <RoleLabel $variant='dest'>Destination</RoleLabel>
                <CardMoniker title={ctx.targetValidatorMoniker}>{ctx.targetValidatorMoniker}</CardMoniker>
                {dstAlreadyInRestake && !removeDstFromRestake && (
                  <RestakeToggleHint>already in Restake list</RestakeToggleHint>
                )}
              </ValidatorCardHeader>
              <InfoRow>
                <span>Receive amount</span>
                <InfoValue>
                  <Delta $direction='in'>
                    +{ctx.amount} {CHAIN_CONFIG.PARAMS.SYMBOL}
                  </Delta>
                </InfoValue>
              </InfoRow>
              <InfoRow>
                <span>Total delegation after redelegate</span>
                <InfoValue>
                  {destDelegation === null
                    ? '…'
                    : `${convertNumberFormat(destDelegation + convertNumber(ctx.amount), 6)} ${
                        CHAIN_CONFIG.PARAMS.SYMBOL
                      }`}
                </InfoValue>
              </InfoRow>
            </ValidatorCard>
          </OptionsWrapper>

          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>
              A single transaction with two messages (Redelegate + Restake update) will be broadcast.
            </ModalTooltipTypo>
          </ModalTooltipWrapper>
          <ModalTooltipWrapper>
            <ModalTooltipIcon />
            <ModalTooltipTypo>
              If nothing is changed, Skip will broadcast Redelegate only.
            </ModalTooltipTypo>
          </ModalTooltipWrapper>

          <ButtonWrapper>
            <CancelButton onClick={goBackToRedelegate} $status={1}>
              Back
            </CancelButton>
            <NextButton onClick={onClickNext} $status={0}>
              {hasPendingChange ? 'Next' : 'Skip'}
            </NextButton>
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(RedelegateRestakeModal);
