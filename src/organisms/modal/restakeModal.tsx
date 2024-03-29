import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { AuthorizationType } from '@firmachain/firma-js';

import { rootState } from '../../redux/reducers';
import { Modal } from '../../components/modal';
import { modalActions } from '../../redux/action';
import { IRestakeState } from '../../interfaces/staking';
import useFirma from '../../utils/wallet';
import {
  convertNumberFormat,
  convertToFctNumber,
  getFeesFromGas,
  getRestakeStatus,
  getUTCDateFormat,
} from '../../utils/common';
import { CHAIN_CONFIG } from '../../config';

import {
  restakeModalWidth,
  ModalContainer,
  ModalTitle,
  ModalContent,
  ButtonWrapper,
  RestakeButton,
  Divider,
  DividerSolid,
  ModalTooltipWrapper,
  ModalTooltipIcon,
  ModalTooltipTypo,
  StatusBox,
  MoreInformation,
  MoreLeftContent,
  MoreLabelWrapper,
  MoreContents,
  MoreContent,
  LeftLabel,
  RightValue,
  ArrowIcon,
  TimeBox,
  ModalInputRowWrap,
  ModalLabel,
  ModalInput,
  CancelButton,
  ModalValue,
} from './styles';

const RestakeModal = () => {
  const restakeModalState = useSelector((state: rootState) => state.modal.restake);
  const modalData = useSelector((state: rootState) => state.modal.data);

  const { enqueueSnackbar } = useSnackbar();

  const {
    grantStakeAuthorizationDelegate,
    revokeStakeAuthorizationDelegate,
    getGasEstimationGrantStakeAuthorizationDelegate,
    getGasEstimationRevokeStakeAuthorizationDelegate,
  } = useFirma();

  const [validatorAddressList, setValidatorAddressList] = useState([]);
  const [isActiveRestake, setActiveRestake] = useState(false);
  const [minimumRewards, setMinimumRewards] = useState(10);
  const [expiryDate, setExpiryDate] = useState<Date>(new Date());
  const [totalDelegated, setTotalDelegated] = useState('0');
  const [totalRewards, setTotalRewards] = useState('0');
  const [status, setStatus] = useState(0);
  const [nextRound, setNextRound] = useState(0);
  const [nextRoundTime, setNextRoundTime] = useState('');
  const [nextRoundTimer, setNextRoundTimer] = useState('00:00:00');
  const [targetCount, setTargetCount] = useState(0);
  const [targetTotalReward, setTargetTotalReward] = useState(0);
  const [totalGrantCount, setTotalGrantCount] = useState(0);

  const closeRestakeModal = () => {
    modalActions.handleModalRestake(false);
  };

  useEffect(() => {
    if (restakeModalState) {
      setValidatorAddressList(modalData.validatorAddressList);
      setActiveRestake(modalData.isActiveRestake);
      setExpiryDate(getNextYear());
      setStatus(modalData.isActiveRestake ? 1 : 0);

      if (modalData.restakeList && modalData.minimumRewards) {
        setMinimumRewards(convertToFctNumber(modalData.minimumRewards));

        const rewardTargetList = modalData.restakeList.filter(
          (restake: IRestakeState) => restake.reward && restake.reward > modalData.minimumRewards
        );

        setTargetCount(rewardTargetList.length);
        setTargetTotalReward(getTotalReward(rewardTargetList));
        setTotalGrantCount(modalData.restakeList.filter((restake: IRestakeState) => restake.status === 1).length);
      }

      modalData.round && setNextRound(modalData.round + 1);
      modalData.nextRoundTime && setNextRoundTime(modalData.nextRoundTime);
      modalData.totalDelegated &&
        setTotalDelegated(`${getFCTFormat(modalData.totalDelegated)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`);
      modalData.totalRewards &&
        setTotalRewards(`${getFCTFormat(modalData.totalRewards)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`);
    }
  }, [restakeModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  const getTotalReward = (restakes: IRestakeState[]): number => {
    let totalReward = 0;
    for (let restake of restakes) {
      totalReward += restake.reward;
    }

    return totalReward;
  };

  useInterval(() => {
    if (nextRoundTime) {
      const now = new Date();
      const diff = new Date(nextRoundTime).getTime() - now.getTime();

      if (diff < 0) return;

      let diffHour = Math.floor((diff / (1000 * 60 * 60)) % 24);
      let diffMin = Math.floor((diff / (1000 * 60)) % 60);
      let diffSec = Math.floor((diff / 1000) % 60);

      diffHour = diffHour === -1 ? 0 : diffHour;
      diffMin = diffMin === -1 ? 0 : diffMin;
      diffSec = diffSec === -1 ? 0 : diffSec;

      setNextRoundTimer(`${('00' + diffHour).slice(-2)}:${('00' + diffMin).slice(-2)}:${('00' + diffSec).slice(-2)}`);
    }
  }, 1000);

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

  const getGrantParamsTx = () => {
    return {
      grantee: CHAIN_CONFIG.RESTAKE.ADDRESS,
      type: AuthorizationType.AUTHORIZATION_TYPE_DELEGATE,
      validatorAddressList,
      maxTokens: '0',
      expirationDate: expiryDate,
    };
  };

  const getRevokeParamsTx = () => {
    return {
      grantee: CHAIN_CONFIG.RESTAKE.ADDRESS,
    };
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
    getGasEstimationGrantStakeAuthorizationDelegate(validatorAddressList, expiryDate, 0)
      .then((gas) => {
        modalActions.handleModalData({
          action: 'Grant restake',
          module: '/authz/stake/grant',
          data: { fees: getFeesFromGas(gas), gas },
          txAction: grantStakeAuthorizationDelegateTx,
          txParams: getGrantParamsTx,
        });

        closeRestakeModal();
        modalActions.handleModalConfirmTx(true);
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  const onClickDisable = () => {
    getGasEstimationRevokeStakeAuthorizationDelegate()
      .then((gas) => {
        modalActions.handleModalData({
          action: 'Revoke restake',
          module: '/authz/stake/revoke',
          data: { fees: getFeesFromGas(gas), gas },
          txAction: revokeStakeAuthorizationDelegateTx,
          txParams: getRevokeParamsTx,
        });

        closeRestakeModal();
        modalActions.handleModalConfirmTx(true);
      })
      .catch((e) => {
        enqueueSnackbar(e, {
          variant: 'error',
          autoHideDuration: 5000,
        });
      });
  };

  return (
    <Modal
      visible={restakeModalState}
      closable={true}
      visibleClose={false}
      onClose={closeRestakeModal}
      width={restakeModalWidth}
    >
      <ModalContainer>
        <ModalTitle>Restake</ModalTitle>
        <ModalContent>
          <ModalInputRowWrap>
            <ModalLabel>Total Delegated</ModalLabel>
            <ModalValue>{totalDelegated}</ModalValue>
          </ModalInputRowWrap>
          <ModalInputRowWrap>
            <ModalLabel>Total Rewards</ModalLabel>
            <ModalValue>{totalRewards}</ModalValue>
          </ModalInputRowWrap>
          <DividerSolid />
          <ModalInputRowWrap>
            <ModalLabel>Restake Status</ModalLabel>
            <ModalInput style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <StatusBox status={status}>{getRestakeStatus(status)}</StatusBox>
            </ModalInput>
          </ModalInputRowWrap>
          {isActiveRestake && (
            <>
              <ModalInputRowWrap>
                <ModalLabel>Expiry Date</ModalLabel>
                <ModalValue>{getUTCDateFormat(expiryDate)}</ModalValue>
              </ModalInputRowWrap>
              <ModalInputRowWrap>
                <ModalLabel>Restake Status</ModalLabel>
                <ModalValue>{`${minimumRewards} ${CHAIN_CONFIG.PARAMS.SYMBOL}`} (per validator)</ModalValue>
              </ModalInputRowWrap>
            </>
          )}
          <Divider />
          <MoreInformation>
            <MoreLabelWrapper onClick={() => window.open(CHAIN_CONFIG.RESTAKE.WEB)}>
              {isActiveRestake ? (
                <MoreLeftContent>
                  Next Round
                  <span style={{ color: '#888' }}>
                    ({nextRound}
                    <span style={{ fontSize: '1.1rem' }}>th</span>)
                  </span>
                </MoreLeftContent>
              ) : (
                <MoreLeftContent>More Information</MoreLeftContent>
              )}
              <ArrowIcon>〉</ArrowIcon>
            </MoreLabelWrapper>
            {isActiveRestake && (
              <MoreContents>
                <MoreContent>
                  <LeftLabel>Remaining Time</LeftLabel>
                  <RightValue>
                    <TimeBox>{nextRoundTimer}</TimeBox>
                  </RightValue>
                </MoreContent>
                <MoreContent>
                  <LeftLabel>Restake Amount</LeftLabel>
                  <RightValue>{`${targetTotalReward} FCT`}</RightValue>
                </MoreContent>
                <MoreContent>
                  <LeftLabel>Restake Validators</LeftLabel>
                  <RightValue>
                    {targetCount}/{totalGrantCount}
                  </RightValue>
                </MoreContent>
              </MoreContents>
            )}
          </MoreInformation>

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
            <CancelButton onClick={() => closeRestakeModal()} status={1}>
              Cancel
            </CancelButton>
            {isActiveRestake ? (
              <>
                <RestakeButton onClick={onClickDisable} status={1}>
                  Disable
                </RestakeButton>
                <RestakeButton onClick={onClickEnable} status={0}>
                  Update
                </RestakeButton>
              </>
            ) : (
              <RestakeButton onClick={onClickEnable} status={0}>
                Enable
              </RestakeButton>
            )}
          </ButtonWrapper>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

const useInterval = (callback: () => void, delay: number) => {
  const savedCallback = useRef<() => void>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      if (savedCallback.current) savedCallback.current();
    }
    if (delay !== null) {
      tick();
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export default React.memo(RestakeModal);
