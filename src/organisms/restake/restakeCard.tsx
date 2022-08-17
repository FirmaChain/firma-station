import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { rootState } from '../../redux/reducers';
import { IGrantsDataState, ITotalDelegateState, IRestakeState } from './hooks';
import { getRestakeStatus, getUTCDateFormat } from '../../utils/common';

import {
  RestakeContainer,
  CardTitle,
  CardLabel,
  CardValue,
  StatusText,
  StatusDot,
  StateList,
  StateItem,
  Label,
  Value,
  ValueBox,
  DdayDot,
} from './styles';

interface IProps {
  totalDelegateState: ITotalDelegateState;
  grantsDataState: IGrantsDataState;
  restakeState: IRestakeState;
}

const RestakeCard = ({ totalDelegateState, grantsDataState, restakeState }: IProps) => {
  const { isLedger } = useSelector((state: rootState) => state.wallet);

  const [restakeStatus, setRestakeStatus] = useState(0);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [totalValidatorCount, setTotalValidatorCount] = useState(0);
  const [activeValidatorCount, setActiveValidatorCount] = useState(0);
  const [nextRoundTimer, setNextRoundTimer] = useState('00:00:00');

  useEffect(() => {
    const delegateCount = totalDelegateState.delegateList.length;
    const gantCount = grantsDataState.allowValidatorList.length;

    setRestakeStatus(delegateCount > 0 ? (gantCount > 0 ? 1 : 0) : 2);

    if (grantsDataState.expiration !== '') {
      setExpiryDate(new Date(grantsDataState.expiration));
    }

    const delegateValidatorList = totalDelegateState.delegateList.map((v: any) => v.validatorAddress);
    const grantValidatorList = grantsDataState.allowValidatorList.map((v: any) => v.validatorAddress);
    const validatorList = delegateValidatorList.concat(grantValidatorList);

    const totalValidatorCount = validatorList.filter((item, index) => validatorList.indexOf(item) === index).length;
    const activeValidatorCount = delegateValidatorList.filter((x) => grantValidatorList.includes(x)).length;

    setTotalValidatorCount(totalValidatorCount);
    setActiveValidatorCount(activeValidatorCount);
  }, [totalDelegateState, grantsDataState]);

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

  useInterval(() => {
    if (restakeState.nextRoundDateTime) {
      const now = new Date();
      const diff = new Date(restakeState.nextRoundDateTime).getTime() - now.getTime();

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

  const getDDayFormat = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `D-${diffDay}`;
  };

  return (
    <RestakeContainer>
      <CardTitle>
        <CardLabel>Status</CardLabel>
        <CardValue>
          <StatusDot status={{ restakeStatus, isLedger }} />
          <StatusText status={{ restakeStatus, isLedger }}>{getRestakeStatus(restakeStatus, isLedger)}</StatusText>
        </CardValue>
      </CardTitle>
      <StateList>
        <StateItem>
          <Label>Next Round</Label>
          <Value>
            <ValueBox>{nextRoundTimer}</ValueBox>
          </Value>
        </StateItem>
        <StateItem>
          {restakeStatus === 1 && <DdayDot>{getDDayFormat(expiryDate)}</DdayDot>}
          <Label>Expiry Date</Label>
          <Value>{restakeStatus === 1 ? getUTCDateFormat(expiryDate) : '-'}</Value>
        </StateItem>
        <StateItem>
          <Label>Restake Active Validators</Label>
          <Value>
            <span style={{ color: 'white' }}>{activeValidatorCount ? activeValidatorCount : '-'}</span>/
            {totalValidatorCount ? totalValidatorCount : '-'}
          </Value>
        </StateItem>
      </StateList>
    </RestakeContainer>
  );
};

export default React.memo(RestakeCard);
