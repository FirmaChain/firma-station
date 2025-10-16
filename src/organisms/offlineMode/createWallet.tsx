import React, { useState } from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { FirmaSDK } from '@firmachain/firma-js';

import useFirma from '../../utils/wallet';
import { CHAIN_CONFIG } from '../../config';

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

const FormContainer = styled.div`
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
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

const Input = styled.input`
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

const PasswordInput = styled(Input).attrs({ type: 'password' })``;

const Button = styled.button<{ disabled?: boolean; variant?: 'primary' | 'secondary' }>`
  width: 100%;
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
  margin-bottom: ${props => props.variant === 'secondary' ? '20px' : '0'};

  &:hover:not(:disabled) {
    background: ${props =>
      props.variant === 'secondary' ? '#f5f5f5' : '#2563EB'
    };
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
`;

const SuccessBox = styled.div`
  background: #F0FDF4;
  border: 1px solid #86EFAC;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
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

const MnemonicDisplay = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 16px;
  margin-bottom: 20px;
`;

const MnemonicGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const MnemonicWord = styled.div`
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const WordNumber = styled.span`
  color: #666;
  font-size: 12px;
`;

const CopyButton = styled.button`
  width: 100%;
  padding: 10px;
  background: white;
  color: #3B82F6;
  border: 1px solid #3B82F6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: #EFF6FF;
  }
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

const CheckBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 14px;

  input {
    cursor: pointer;
  }

  label {
    cursor: pointer;
    color: #333;
  }
`;

interface CreateWalletProps {
  onBack: () => void;
}

const CreateWallet: React.FC<CreateWalletProps> = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { recoverWalletFromMnemonic } = useFirma();

  const [step, setStep] = useState<'form' | 'mnemonic' | 'confirm'>('form');
  const [walletName, setWalletName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [confirmedSave, setConfirmedSave] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!walletName.trim()) {
      newErrors.walletName = 'Wallet name is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateWallet = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Initialize FirmaSDK with proper config
      const firmaSDK = new FirmaSDK(CHAIN_CONFIG.FIRMACHAIN_CONFIG);

      // Generate new wallet with mnemonic
      const newWallet = await firmaSDK.Wallet.newWallet();
      const newMnemonic = newWallet.getMnemonic();
      const address = await newWallet.getAddress();

      setMnemonic(newMnemonic);
      setWalletAddress(address);
      setStep('mnemonic');
    } catch (error) {
      console.error('Error generating wallet:', error);
      enqueueSnackbar('Failed to generate wallet', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    enqueueSnackbar('Mnemonic copied to clipboard', {
      variant: 'success',
      autoHideDuration: 2000,
    });
  };

  const handleConfirmAndSave = async () => {
    if (!confirmedSave) {
      enqueueSnackbar('Please confirm that you have saved your mnemonic', {
        variant: 'warning',
        autoHideDuration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Store the wallet using the existing recoverWalletFromMnemonic function
      const success = await recoverWalletFromMnemonic(
        mnemonic,
        walletName.trim(),
        password
      );

      if (success) {
        setStep('confirm');
      } else {
        enqueueSnackbar('Failed to create wallet', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      enqueueSnackbar('An error occurred while creating wallet', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderMnemonicWords = () => {
    const words = mnemonic.split(' ');
    return words.map((word, index) => (
      <MnemonicWord key={index}>
        <WordNumber>{index + 1}.</WordNumber>
        <span>{word}</span>
      </MnemonicWord>
    ));
  };

  if (step === 'confirm') {
    return (
      <Container>
        <Header>
          <BackButton onClick={onBack}>←</BackButton>
          <Title>Wallet Created Successfully</Title>
        </Header>

        <FormContainer>
          <SuccessBox>
            <h3 style={{ margin: '0 0 12px 0', color: '#166534' }}>
              ✓ Your wallet has been created!
            </h3>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#166534' }}>
              Wallet Name: <strong>{walletName}</strong>
            </p>
            <p style={{ margin: '0', fontSize: '14px', color: '#166534' }}>
              Address: <strong style={{ fontFamily: 'monospace', fontSize: '12px' }}>{walletAddress}</strong>
            </p>
          </SuccessBox>

          <InfoBox>
            Your wallet has been successfully created and stored in offline mode.
            You can now use it to sign transactions or export your keys.
          </InfoBox>

          <Button onClick={onBack}>
            Return to Offline Mode Menu
          </Button>
        </FormContainer>
      </Container>
    );
  }

  if (step === 'mnemonic') {
    return (
      <Container>
        <Header>
          <BackButton onClick={() => setStep('form')}>←</BackButton>
          <Title>Save Your Recovery Phrase</Title>
        </Header>

        <FormContainer>
          <WarningBox>
            <strong>⚠️ Important:</strong> Write down these words in order and store them safely.
            This is the ONLY way to recover your wallet. Never share this phrase with anyone!
          </WarningBox>

          <MnemonicDisplay>
            <MnemonicGrid>
              {renderMnemonicWords()}
            </MnemonicGrid>
            <CopyButton onClick={handleCopyMnemonic}>
              📋 Copy to Clipboard
            </CopyButton>
          </MnemonicDisplay>

          <InfoBox>
            <strong>Your wallet address:</strong><br />
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{walletAddress}</span>
          </InfoBox>

          <CheckBox>
            <input
              type="checkbox"
              id="confirmSave"
              checked={confirmedSave}
              onChange={(e) => setConfirmedSave(e.target.checked)}
            />
            <label htmlFor="confirmSave">
              I have safely written down and stored my recovery phrase
            </label>
          </CheckBox>

          <Button
            onClick={handleConfirmAndSave}
            disabled={!confirmedSave || isLoading}
          >
            {isLoading ? 'Creating Wallet...' : 'Confirm & Create Wallet'}
          </Button>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>←</BackButton>
        <Title>Create New Wallet</Title>
      </Header>

      <FormContainer>
        <InfoBox>
          Create a new wallet with a randomly generated mnemonic phrase.
          Make sure to save your mnemonic phrase in a secure location.
        </InfoBox>

        <InputGroup>
          <Label>Wallet Name</Label>
          <Input
            value={walletName}
            onChange={(e) => setWalletName(e.target.value)}
            placeholder="Enter a name for your wallet"
          />
          {errors.walletName && <ErrorMessage>{errors.walletName}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label>Password</Label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password (min 8 characters)"
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>

        <InputGroup>
          <Label>Confirm Password</Label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
        </InputGroup>

        <Button
          onClick={handleGenerateWallet}
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate New Wallet'}
        </Button>
      </FormContainer>
    </Container>
  );
};

export default CreateWallet;