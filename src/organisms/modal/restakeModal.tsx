import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

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
  const [restakeList, setRestakeList] = useState<IRestakeState[]>([]);

  const closeRestakeModal = () => {
    modalActions.handleModalRestake(false);
  };

  useEffect(() => {
    if (restakeModalState) {
      setValidatorAddressList(modalData.validatorAddressList);
      setActiveRestake(modalData.isActiveRestake);
      setExpiryDate(getNextYear());
      setStatus(modalData.isActiveRestake ? 1 : 0);

      modalData.restakeList && setRestakeList(modalData.restakeList);
      modalData.round && setNextRound(modalData.round + 1);
      modalData.nextRoundTime && setNextRoundTime(modalData.nextRoundTime);
      modalData.minimumRewards && setMinimumRewards(convertToFctNumber(modalData.minimumRewards));
      modalData.totalDelegated &&
        setTotalDelegated(`${getFCTFormat(modalData.totalDelegated)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`);
      modalData.totalRewards &&
        setTotalRewards(`${getFCTFormat(modalData.totalRewards)} ${CHAIN_CONFIG.PARAMS.SYMBOL}`);
    }
  }, [restakeModalState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (restakeList.length > 0) {
      for (let restake of restakeList) {
        console.log(restake);
      }
    }
  }, [restakeList]);

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
      });
  };

  const onClickDisable = () => {
    getGasEstimationRevokeStakeAuthorizationDelegate()
      .then((gas) => {
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
          <ValueContainer>
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
              <ValueLabel>Restake Status</ValueLabel>
              <ValueText>
                <StatusBox status={status}>{getRestakeStatus(status)}</StatusBox>
              </ValueText>
            </ValueItem>
            {isActiveRestake && (
              <>
                <ValueItem>
                  <ValueLabel>Expiry Date</ValueLabel>
                  <ValueText>{getUTCDateFormat(expiryDate)}</ValueText>
                </ValueItem>
                <ValueItem>
                  <ValueLabel>Minimum Reward</ValueLabel>
                  <ValueText>{`${minimumRewards} ${CHAIN_CONFIG.PARAMS.SYMBOL}`} (per validator)</ValueText>
                </ValueItem>
              </>
            )}
          </ValueContainer>
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
                  <RightValue>
                    {`${restakeList
                      .filter((restake) => restake.reward > minimumRewards)
                      .map((restake) => restake.reward)
                      .reduce((prev: number, current: number) => prev + current)} FCT`}
                  </RightValue>
                </MoreContent>
                <MoreContent>
                  <LeftLabel>Restake Validators</LeftLabel>
                  <RightValue>
                    {restakeList.filter((restake) => restake.reward > minimumRewards).length}/
                    {restakeList.filter((restake) => restake.status === 1).length}
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

          <ButtonWrapper style={{ marginTop: '40px' }}>
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
