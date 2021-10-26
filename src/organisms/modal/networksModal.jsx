import React from "react";
import { useSelector } from "react-redux";
import { Modal } from "components/modal";
import { modalActions } from "redux/action";
import { ModalContainer, ModalTitle, ModalContent } from "./styles";
import styled from "styled-components";

import { NETWORK_INFO_LIST } from "config";

const NetworkList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  text-align: center;
  gap: 20px 0;
`;
const NetworkItem = styled.div`
  width: 100%;
  text-align: center;
  cursor: pointer;
`;

const NetworksModal = () => {
  const networkModalState = useSelector((state) => state.modal.network);

  const closeNetworksModal = () => {
    modalActions.handleModalNetwork(false);
  };

  return (
    <Modal visible={networkModalState} closable={true} onClose={closeNetworksModal} width={"500px"}>
      <ModalContainer>
        <ModalTitle>Networks</ModalTitle>
        <ModalContent>
          <NetworkList>
            {NETWORK_INFO_LIST.map((network, index) => (
              <NetworkItem
                key={index}
                onClick={() => {
                  window.open(network.stationURI);
                }}
              >
                {network.chainName.toUpperCase()}
              </NetworkItem>
            ))}
          </NetworkList>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
};

export default NetworksModal;
