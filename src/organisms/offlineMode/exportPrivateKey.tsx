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

const WarningBox = styled.div`
  background: #FEE2E2;
  border: 1px solid #FCA5A5;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #991B1B;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const InfoBox = styled.div`
  background: #EFF6FF;
  border: 1px solid #BFDBFE;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #1E40AF;
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

const PrivateKeyDisplay = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PrivateKeyText = styled.div`
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  word-break: break-all;
  line-height: 1.5;
  color: #333;
  margin-bottom: 16px;
`;

const CopyButton = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  color: #3B82F6;
  border: 1px solid #3B82F6;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3B82F6;
    color: white;
  }
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

interface ExportPrivateKeyProps {
  onBack: () => void;
}

const ExportPrivateKey: React.FC<ExportPrivateKeyProps> = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { address, walletName } = useSelector((state: rootState) => state.wallet);
  const { isCorrectPassword, getPrivateKey, isValidWallet } = useFirma();

  const [password, setPassword] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [showPrivateKey, setShowPrivateKey] = useState(false);
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

  const handleRevealPrivateKey = async () => {
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

      const key = await getPrivateKey(password);

      if (key) {
        setPrivateKey(key);
        setShowPrivateKey(true);
        enqueueSnackbar('Private key revealed successfully', {
          variant: 'success',
          autoHideDuration: 2000,
        });
      } else {
        enqueueSnackbar('Failed to retrieve private key', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error('Error retrieving private key:', error);
      enqueueSnackbar('An error occurred while retrieving private key', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPrivateKey = () => {
    if (privateKey) {
      navigator.clipboard.writeText(privateKey);
      enqueueSnackbar('Private key copied to clipboard', {
        variant: 'success',
        autoHideDuration: 2000,
      });
    }
  };

  const handleClose = () => {
    setPassword('');
    setPrivateKey('');
    setShowPrivateKey(false);
    setError('');
    onBack();
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleClose}>←</BackButton>
        <Title>Export Private Key</Title>
      </Header>

      <ContentContainer>
        <WarningBox>
          🔴 <strong>Extreme Caution:</strong> Your private key gives complete control over your wallet.
          Never share it with anyone or enter it on untrusted websites.
        </WarningBox>

        {!showPrivateKey ? (
          <>
            <InfoBox>
              Your private key is a 64-character hexadecimal string that controls your wallet.
              Only export it if you absolutely need it for advanced operations.
            </InfoBox>

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
              <WarningBox>
                No wallet connected. Please connect a wallet to export its private key.
              </WarningBox>
            )}

            <InputGroup>
              <Label>Enter Password to Reveal Private Key</Label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your wallet password"
                disabled={!isValidWallet()}
                onKeyPress={(e) => e.key === 'Enter' && handleRevealPrivateKey()}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputGroup>

            <ButtonGroup>
              <Button variant="secondary" onClick={onBack}>
                Cancel
              </Button>
              <Button
                onClick={handleRevealPrivateKey}
                disabled={isLoading || !isValidWallet() || password.length < 8}
              >
                {isLoading ? 'Revealing...' : 'Reveal Private Key'}
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <PrivateKeyDisplay>
              <Label>Your Private Key:</Label>
              <PrivateKeyText>{privateKey}</PrivateKeyText>
              <CopyButton onClick={handleCopyPrivateKey}>
                Copy to Clipboard
              </CopyButton>
            </PrivateKeyDisplay>

            <WarningBox>
              ⚠️ This private key controls your wallet completely.
              Store it securely and never share it with anyone.
              Consider deleting it from your clipboard after use.
            </WarningBox>

            <Button onClick={handleClose}>
              Done
            </Button>
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export default ExportPrivateKey;