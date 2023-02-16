import React, { useState, useEffect } from 'react';

import useAPI from '../../utils/api';
import ConnectQR from '../../components/connectQR';

import { QRContainer, QRTimerText, RefreshIconButton } from './styles';

interface IProps {
  module: string;
  onSuccess: (requestData: Object) => void;
  onFailed: (requestData: Object) => void;
  params?: Object;
  signer?: string;
}

const RequestQR = ({ module, onSuccess, onFailed, params = {}, signer = '' }: IProps) => {
  const { checkRequest, generateRequestQR } = useAPI();

  const [requestKey, setRequestKey] = useState('');
  const [qrcode, setQrcode] = useState('');
  const [expireDate, setExpireDate] = useState<Date | null>(null);
  const [timerText, setTimerText] = useState('02:59');
  const [activeQR, setActiveQR] = useState(false);

  useEffect(() => requestQR(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const requestQR = () => {
    generateRequestQR(module, { ...params, signer })
      .then((result) => {
        if (result !== null) {
          setRequestKey(result.requestKey);
          setQrcode(result.qrcode);
          setExpireDate(result.expire);
          setActiveQR(true);
        } else {
          throw new Error('INVALID REQUEST');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const refreshRequestQR = () => {
    setRequestKey('');
    setQrcode('');
    setExpireDate(null);
    setActiveQR(false);

    requestQR();
  };

  const onTickCheckRequest = async () => {
    checkRequest(requestKey).then((requestData) => {
      if (requestData.status === 1) {
        setActiveQR(false);
        onSuccess(requestData);
      } else if (requestData.status === -2) {
        setActiveQR(false);
        onFailed(requestData);
      }
    });
  };

  return (
    <QRContainer>
      <ConnectQR
        qrSize={140}
        qrcode={qrcode}
        expireDate={expireDate}
        isActive={activeQR}
        setTimerText={(value: string) => {
          setTimerText(value);
        }}
        onExpired={() => {
          setActiveQR(false);
          refreshRequestQR();
        }}
        onTick={() => {
          onTickCheckRequest();
        }}
      />
      {qrcode !== '' && (
        <QRTimerText onClick={() => refreshRequestQR()}>
          {timerText}
          <RefreshIconButton />
        </QRTimerText>
      )}
    </QRContainer>
  );
};

export default React.memo(RequestQR);
