import React, { useState } from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';

import useFirma from '../../utils/wallet';
import { rootState } from '../../redux/reducers';

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

const PreviewContainer = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
`;

const PreviewImage = styled.div`
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  margin-bottom: 16px;
`;

const PreviewDescription = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

const PasswordInput = styled.input.attrs({ type: 'password' })`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3B82F6;
  }
`;

const InfoBox = styled.div`
  background: #FEF3C7;
  border: 1px solid #FDE68A;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #92400E;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary'; disabled?: boolean }>`
  flex: 1;
  padding: 12px;
  background: ${props =>
    props.variant === 'secondary' ? 'white' :
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
    background: ${props => props.variant === 'secondary' ? '#f5f5f5' : '#2563EB'};
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
`;

const WalletInfo = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
`;

const WalletInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const WalletInfoLabel = styled.span`
  color: #666;
`;

const WalletInfoValue = styled.span`
  color: #333;
  font-weight: 500;
  font-family: monospace;
`;

interface DownloadPaperWalletProps {
  onBack: () => void;
}

const DownloadPaperWallet: React.FC<DownloadPaperWalletProps> = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { address, walletName } = useSelector((state: rootState) => state.wallet);
  const { isCorrectPassword, downloadPaperWallet, isValidWallet } = useFirma();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    setError('');
    return true;
  };

  const handleDownload = async () => {
    if (!validateForm()) return;

    if (!isValidWallet()) {
      enqueueSnackbar('No wallet connected. Please connect a wallet first.', {
        variant: 'warning',
        autoHideDuration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!isCorrectPassword(password)) {
        setError('Invalid password');
        enqueueSnackbar('Invalid password', {
          variant: 'error',
          autoHideDuration: 2000,
        });
        setIsLoading(false);
        return;
      }

      const uri = await downloadPaperWallet();

      if (uri) {
        // Create download link
        const link = document.createElement('a');
        link.href = uri;
        link.download = `firma-station-paper-wallet-${Date.now()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        enqueueSnackbar('Paper wallet downloaded successfully!', {
          variant: 'success',
          autoHideDuration: 3000,
        });

        // Clear password for security
        setPassword('');
      } else {
        enqueueSnackbar('Failed to generate paper wallet', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error('Error downloading paper wallet:', error);
      enqueueSnackbar('An error occurred while generating paper wallet', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <Title>Download Paper Wallet</Title>
      </Header>

      <ContentContainer>
        <PreviewContainer>
          <PreviewImage>
            Paper Wallet Preview
          </PreviewImage>
          <PreviewDescription>
            A paper wallet is a physical document containing your wallet's private key and mnemonic phrase.
            It provides an offline backup solution for your cryptocurrency wallet.
          </PreviewDescription>
        </PreviewContainer>

        {isValidWallet() && address ? (
          <WalletInfo>
            <WalletInfoRow>
              <WalletInfoLabel>Wallet Name:</WalletInfoLabel>
              <WalletInfoValue>{walletName || 'Default Wallet'}</WalletInfoValue>
            </WalletInfoRow>
            <WalletInfoRow>
              <WalletInfoLabel>Address:</WalletInfoLabel>
              <WalletInfoValue>{address.slice(0, 10)}...{address.slice(-8)}</WalletInfoValue>
            </WalletInfoRow>
          </WalletInfo>
        ) : (
          <InfoBox>
            ⚠️ No wallet connected. Please connect a wallet to download a paper wallet.
          </InfoBox>
        )}

        <InfoBox>
          🔒 The paper wallet will contain sensitive information including your private key and mnemonic phrase.
          Store it in a secure location and never share it with anyone.
        </InfoBox>

        <InputGroup>
          <Label>Enter Password to Export</Label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your wallet password"
            disabled={!isValidWallet()}
          />
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </InputGroup>

        <ButtonGroup>
          <Button variant="secondary" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={isLoading || !isValidWallet() || password.length < 8}
          >
            {isLoading ? 'Generating...' : 'Download Paper Wallet'}
          </Button>
        </ButtonGroup>
      </ContentContainer>
    </Container>
  );
};

export default DownloadPaperWallet;