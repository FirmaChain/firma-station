import React from "react";
import { useSelector } from "react-redux";

import { NETWORK_INFO_LIST } from "../../config";
import { rootState } from "../../redux/reducers";
import { Modal } from "../../components/modal";
import { modalActions } from "../../redux/action";

import { networksModalWidth, ModalContainer, ModalTitle, ModalContent, NetworkList, NetworkItem } from "./styles";

const NetworksModal = () => {
  const networkModalState = useSelector((state: rootState) => state.modal.network);

  const closeNetworksModal = () => {
    modalActions.handleModalNetwork(false);
  };

  return (
    <Modal visible={networkModalState} closable={true} onClose={closeNetworksModal} width={networksModalWidth}>
      <ModalContainer>
        <ModalTitle>NETWORKS</ModalTitle>
        <ModalContent>
          <NetworkList>
            {NETWORK_INFO_LIST.length > 0 &&
              NETWORK_INFO_LIST.map((network: any, index) => (
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

export default React.memo(NetworksModal);
