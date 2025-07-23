import styled from 'styled-components';
import useFirma from '../../utils/wallet';
import { modalActions } from '../../redux/action';
import { getFeesFromGas } from '../../utils/common';

const Contaienr = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const Button = styled.button`
  height: 40px;
  line-height: 40px;
  border-radius: 4px;
  background-color: red;
  outline: none;
  display: flex;
  border: none;
  padding: 0 12px;
`;

const ButtonText = styled.span`
  color: #fff;
  font-weight: 500;
  cursor: pointer;
`;

const CancelProposalButton = ({ proposalId }: { proposalId: string }) => {
  const { cancelProposal, getGasEstimationCancelProposal } = useFirma();

  const cancelProposalTx = (resolveTx: () => void, rejectTx: () => void, gas = 0) =>
    cancelProposal(proposalId, gas)
      .then(() => {
        resolveTx();
      })
      .catch(() => {
        rejectTx();
      });

  const getParamsTx = () => {
    return {
      proposalId: parseInt(proposalId)
    };
  };

  const submitCancelProposal = async () => {
    const gas = await getGasEstimationCancelProposal(proposalId);

    modalActions.handleModalData({
      action: 'Cancel Proposal',
      module: `/gov/cancelproposal`,
      data: { fees: getFeesFromGas(gas), gas: gas },
      prevModalAction: modalActions.handleModalNewProposal,
      txAction: cancelProposalTx,
      txParams: getParamsTx
    });

    modalActions.handleModalConfirmTx(true);
  };

  return (
    <Contaienr>
      <Button>
        <ButtonText onClick={submitCancelProposal}>Cancel Proposal</ButtonText>
      </Button>
    </Contaienr>
  );
};

export default CancelProposalButton;
