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
  color: #efefef;

  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: #efefef;
`;

const ContentContainer = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
`;

const WarningBox = styled.div`
  background: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #991b1b;
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

const InfoBox = styled.div`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #1e40af;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #000;
`;

const PasswordInput = styled.input.attrs({ type: 'password' })`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;

  ::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const MnemonicDisplay = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
`;

const MnemonicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const MnemonicWord = styled.div`
  padding: 8px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WordNumber = styled.span`
  color: #aaa;
  font-size: 12px;
`;

const WordText = styled.span`
  color: #a0a0a0;
  font-weight: 500;
`;

const CopyButton = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3b82f6;
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
  background: ${(props) => (props.variant === 'secondary' ? 'white' : props.disabled ? '#ccc' : '#3B82F6')};
  color: ${(props) => (props.variant === 'secondary' ? '#aaa' : 'white')};
  border: ${(props) => (props.variant === 'secondary' ? '1px solid #e0e0e0' : 'none')};
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.variant === 'secondary' ? '#f5f5f5' : '#2563EB')};
  }
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
`;

interface ExportMnemonicProps {
  onBack: () => void;
}

const ExportMnemonic: React.FC<ExportMnemonicProps> = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { address } = useSelector((state: rootState) => state.wallet);
  const { isCorrectPassword, getMnemonic, isValidWallet } = useFirma();

  const [password, setPassword] = useState('');
  const [mnemonic, setMnemonic] = useState<string[]>([]);
  const [showMnemonic, setShowMnemonic] = useState(false);
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

  const handleRevealMnemonic = async () => {
    if (!validateForm()) return;

    if (!isValidWallet()) {
      enqueueSnackbar('No wallet connected. Please connect a wallet first.', {
        variant: 'warning',
        autoHideDuration: 3000
      });
      return;
    }

    setIsLoading(true);
    try {
      if (!isCorrectPassword(password)) {
        setError('Invalid password');
        enqueueSnackbar('Invalid password', {
          variant: 'error',
          autoHideDuration: 2000
        });
        setIsLoading(false);
        return;
      }

      const mnemonicPhrase = await getMnemonic(password);

      if (mnemonicPhrase) {
        const words = mnemonicPhrase.split(' ');
        setMnemonic(words);
        setShowMnemonic(true);
        enqueueSnackbar('Mnemonic revealed successfully', {
          variant: 'success',
          autoHideDuration: 2000
        });
      } else {
        enqueueSnackbar('Failed to retrieve mnemonic', {
          variant: 'error',
          autoHideDuration: 3000
        });
      }
    } catch (error) {
      console.error('Error retrieving mnemonic:', error);
      enqueueSnackbar('An error occurred while retrieving mnemonic', {
        variant: 'error',
        autoHideDuration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMnemonic = () => {
    if (mnemonic.length > 0) {
      navigator.clipboard.writeText(mnemonic.join(' '));
      enqueueSnackbar('Mnemonic copied to clipboard', {
        variant: 'success',
        autoHideDuration: 2000
      });
    }
  };

  const handleClose = () => {
    setPassword('');
    setMnemonic([]);
    setShowMnemonic(false);
    setError('');
    onBack();
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={handleClose}>←</BackButton>
        <Title>Export Mnemonic Phrase</Title>
      </Header>

      <ContentContainer>
        <WarningBox>
          ⚠️ <strong>Warning:</strong> Never share your mnemonic phrase with anyone. Anyone with access to your mnemonic
          can control your wallet and funds.
        </WarningBox>

        {!showMnemonic ? (
          <>
            <InfoBox>
              Your mnemonic phrase is the master key to your wallet. Write it down and store it in a secure location.
              You will need it to recover your wallet if you lose access.
            </InfoBox>

            {!isValidWallet() && (
              <WarningBox>No wallet connected. Please connect a wallet to export its mnemonic phrase.</WarningBox>
            )}

            <InputGroup>
              <Label>Enter Password to Reveal Mnemonic</Label>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your wallet password"
                disabled={!isValidWallet()}
                onKeyPress={(e) => e.key === 'Enter' && handleRevealMnemonic()}
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </InputGroup>

            <ButtonGroup>
              <Button variant="secondary" onClick={onBack}>
                Cancel
              </Button>
              <Button onClick={handleRevealMnemonic} disabled={isLoading || !isValidWallet() || password.length < 8}>
                {isLoading ? 'Revealing...' : 'Reveal Mnemonic'}
              </Button>
            </ButtonGroup>
          </>
        ) : (
          <>
            <MnemonicDisplay>
              <MnemonicGrid>
                {mnemonic.map((word, index) => (
                  <MnemonicWord key={index}>
                    <WordNumber>{index + 1}.</WordNumber>
                    <WordText>{word}</WordText>
                  </MnemonicWord>
                ))}
              </MnemonicGrid>
              <CopyButton onClick={handleCopyMnemonic}>Copy to Clipboard</CopyButton>
            </MnemonicDisplay>

            <WarningBox>
              Make sure to write down these words in the exact order. Store them securely and never share them online.
            </WarningBox>

            <Button onClick={handleClose}>Done</Button>
          </>
        )}
      </ContentContainer>
    </Container>
  );
};

export default ExportMnemonic;
