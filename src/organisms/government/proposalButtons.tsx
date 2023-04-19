import React from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { rootState } from '../../redux/reducers';
import { modalActions } from '../../redux/action';
import { convertNumber, convertToFctNumber, getDefaultFee } from '../../utils/common';

import { ButtonWrapper, Button } from './styles';
import { CHAIN_CONFIG } from '../../config';

const ProposalButtons = () => {
  const { balance } = useSelector((state: rootState) => state.user);
  const { isLedger, isMobileApp, address } = useSelector((state: rootState) => state.wallet);
  const { enqueueSnackbar } = useSnackbar();

  const isInvalidProposalAddress = async () => {
    try {
      if (CHAIN_CONFIG.PROPOSAL_JSON !== '') {
        const response = await axios.get(`${CHAIN_CONFIG.PROPOSAL_JSON}?t=${new Date().getTime()}`);
        const { ignoreProposalAddressList } = response.data;

        return ignoreProposalAddressList.includes(address);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  return (
    <ButtonWrapper>
      <Button
        onClick={async () => {
          if (await isInvalidProposalAddress()) {
            enqueueSnackbar('This address is not valid for proposal. Please contact to contact@firmachain.org.', {
              variant: 'error',
              autoHideDuration: 4000,
            });
            return;
          }

          if (convertNumber(balance) > convertToFctNumber(getDefaultFee(isLedger, isMobileApp))) {
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
