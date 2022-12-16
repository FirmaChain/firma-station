import React from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';
import { convertNumber, convertToFctNumber, getDefaultFee } from '../../utils/common';

import { ButtonWrapper, Button } from './styles';

const ProposalButtons = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  return (
    <ButtonWrapper>
      <Button
        onClick={() => {
          if (convertNumber(balance) > convertToFctNumber(getDefaultFee(isLedger))) {
            modalActions.handleModalNewProposal(true);
          } else {
            enqueueSnackbar('Insufficient funds. Please check your account balance.', {
              variant: 'error',
              autoHideDuration: 2000,
            });
          }
        }}
      >
        New proposal
      </Button>
    </ButtonWrapper>
  );
};

export default React.memo(ProposalButtons);
