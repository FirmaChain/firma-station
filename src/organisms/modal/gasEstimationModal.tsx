import React from "react";
import { useSelector } from "react-redux";
import ScaleLoader from "react-spinners/ScaleLoader";

import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import { gasEstimationModalWidth, ModalContainer, ModalTitle, ModalContent, LoadingWrapper, ModalTypo } from "./styles";

const GasEstimationModal = () => {
  const gasEstimationModalState = useSelector((state: rootState) => state.modal.gasEstimation);

  const closeGasEstimationModal = () => {
    modalActions.handleModalQueueTx(false);
  };

  return (
    <Modal
      visible={gasEstimationModalState}
      closable={false}
      onClose={closeGasEstimationModal}
      width={gasEstimationModalWidth}
    >
      <ModalContainer>
        <ModalTitle>ESTIMATING THE GAS</ModalTitle>
        <ModalContent>
          <LoadingWrapper>
            <ScaleLoader loading={true} color={"#3550DE80"} height={"50px"} width={"7px"} />
          </LoadingWrapper>
          <ModalTypo>To estimate your gas fee we need your ledger signature</ModalTypo>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default React.memo(GasEstimationModal);
