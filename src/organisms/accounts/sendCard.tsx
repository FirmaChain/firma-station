import React from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';
import { convertNumber, convertToFctNumber, getDefaultFee } from '../../utils/common';

import theme from '../../themes';
import { BlankCard } from '../../components/card';
import { TitleTypo, NextButton } from './styles';

const SendCard = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <BlankCard bgColor={theme.colors.backgroundSideBar} height='100%'>
      <TitleTypo>SEND</TitleTypo>
      <NextButton
        onClick={() => {
          if (convertNumber(balance) > convertToFctNumber(getDefaultFee(isLedger, isMobileApp))) {
            modalActions.handleModalSend(true);
          } else {
            enqueueSnackbar('Insufficient funds. Please check your account balance.', {
              variant: 'error',
              autoHideDuration: 2000,
            });
          }
        }}
      >
        Send to Address
      </NextButton>
    </BlankCard>
  );
};

export default React.memo(SendCard);
