import React, { useState } from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';
import { walletActions } from '../../redux/action';

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const ContentContainer = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const WarningBox = styled.div`
  background: #FEE2E2;
  border: 1px solid #FCA5A5;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #991B1B;
`;

const InfoBox = styled.div`
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #92400E;
`;

const WalletInfo = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
`;

const WalletInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WalletInfoLabel = styled.span`
  color: #666;
  font-weight: 500;
`;

const WalletInfoValue = styled.span`
  color: #333;
  font-weight: 500;
  font-family: monospace;
`;

const ChecklistContainer = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
`;

const ChecklistTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
`;

const ChecklistItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  &:last-child {
    margin-bottom: 0;
  }

  input {
    cursor: pointer;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'danger' | 'secondary'; disabled?: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props =>
    props.variant === 'secondary' ? 'white' :
    props.variant === 'danger' ? (props.disabled ? '#ccc' : '#EF4444') :
    props.disabled ? '#ccc' : '#3B82F6'
  };
  color: ${props => props.variant === 'secondary' ? '#333' : 'white'};
  border: ${props => props.variant === 'secondary' ? '1px solid #e0e0e0' : 'none'};
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${props =>
      props.variant === 'secondary' ? '#f5f5f5' :
      props.variant === 'danger' ? '#DC2626' : '#2563EB'
    };
  }
`;

const ConfirmationModal = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
`;

const ModalTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
`;

const ModalText = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
`;

interface DisconnectWalletProps {
  onBack: () => void;
}

const DisconnectWallet: React.FC<DisconnectWalletProps> = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { address, walletName, balance } = useSelector((state: rootState) => state.wallet);
  const { disconnectWallet, isValidWallet } = useFirma();

  const [checklist, setChecklist] = useState({
    backup: false,
    privateKey: false,
    understand: false,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChecklistChange = (key: keyof typeof checklist) => {
    setChecklist(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const allChecked = Object.values(checklist).every(value => value);

  const handleDisconnect = () => {
    if (!allChecked) {
      enqueueSnackbar('Please complete all checklist items', {
        variant: 'warning',
        autoHideDuration: 3000,
      });
      return;
    }
    setShowConfirmation(true);
  };

  const confirmDisconnect = async () => {
    try {
      // Clear wallet data
      await disconnectWallet();

      // Clear Redux state
      dispatch(walletActions.resetWallet());

      enqueueSnackbar('Wallet disconnected successfully', {
        variant: 'success',
        autoHideDuration: 3000,
      });

      // Return to offline mode menu instead of redirecting to home
      onBack();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      enqueueSnackbar('Failed to disconnect wallet', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    }
  };

  if (!isValidWallet()) {
    return (
      <Container>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <Title>Disconnect Wallet</Title>
        </Header>
        <ContentContainer>
          <InfoBox>
            No wallet is currently connected.
          </InfoBox>
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
        </ContentContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <Title>Disconnect Wallet</Title>
        </Header>

        <ContentContainer>
          <WarningBox>
            <strong>⚠️ Warning:</strong> Disconnecting your wallet will remove all wallet data from this browser.
            Make sure you have backed up your mnemonic phrase and/or private key before proceeding.
          </WarningBox>

          <WalletInfo>
            <WalletInfoRow>
              <WalletInfoLabel>Wallet Name:</WalletInfoLabel>
              <WalletInfoValue>{walletName || 'Default Wallet'}</WalletInfoValue>
            </WalletInfoRow>
            <WalletInfoRow>
              <WalletInfoLabel>Address:</WalletInfoLabel>
              <WalletInfoValue>{address}</WalletInfoValue>
            </WalletInfoRow>
            <WalletInfoRow>
              <WalletInfoLabel>Balance:</WalletInfoLabel>
              <WalletInfoValue>{balance || '0'} FCT</WalletInfoValue>
            </WalletInfoRow>
          </WalletInfo>

          <ChecklistContainer>
            <ChecklistTitle>Before disconnecting, please confirm:</ChecklistTitle>

            <ChecklistItem>
              <input
                type="checkbox"
                checked={checklist.backup}
                onChange={() => handleChecklistChange('backup')}
              />
              I have backed up my mnemonic phrase
            </ChecklistItem>

            <ChecklistItem>
              <input
                type="checkbox"
                checked={checklist.privateKey}
                onChange={() => handleChecklistChange('privateKey')}
              />
              I have saved my private key (if needed)
            </ChecklistItem>

            <ChecklistItem>
              <input
                type="checkbox"
                checked={checklist.understand}
                onChange={() => handleChecklistChange('understand')}
              />
              I understand that I will need my backup to access this wallet again
            </ChecklistItem>
          </ChecklistContainer>

          <InfoBox>
            💡 Tip: Use the "Export Mnemonic" or "Export Private Key" features before disconnecting
            if you haven't already backed up your wallet.
          </InfoBox>

          <ButtonGroup>
            <Button variant="secondary" onClick={onBack}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDisconnect}
              disabled={!allChecked}
            >
              Disconnect Wallet
            </Button>
          </ButtonGroup>
        </ContentContainer>
      </Container>

      <ConfirmationModal show={showConfirmation}>
        <ModalContent>
          <ModalTitle>Final Confirmation</ModalTitle>
          <ModalText>
            Are you absolutely sure you want to disconnect this wallet?
            This action cannot be undone. You will need your mnemonic phrase
            or private key to access this wallet again.
          </ModalText>
          <ButtonGroup>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmDisconnect}
            >
              Yes, Disconnect
            </Button>
          </ButtonGroup>
        </ModalContent>
      </ConfirmationModal>
    </>
  );
};

export default DisconnectWallet;