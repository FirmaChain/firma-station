import React, { useState } from 'react';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';

import useFirma from '../../utils/wallet';
import { isValidMnemonic, isValidPrivateKey } from '../../utils/common';

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

const TabContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid #e0e0e0;
`;

const Tab = styled.div<{ active: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#3B82F6' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#3B82F6' : 'transparent'};
  font-weight: ${props => props.active ? '600' : '400'};
  transition: all 0.2s ease;

  &:hover {
    color: #3B82F6;
  }
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: 'Courier New', monospace;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #3B82F6;
  }
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

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 12px;
  background: ${props => props.disabled ? '#ccc' : '#3B82F6'};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #2563EB;
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 12px;
  margin-top: 4px;
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

interface RecoverWalletProps {
  onBack: () => void;
}

const RecoverWallet: React.FC<RecoverWalletProps> = ({ onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const { recoverWalletFromMnemonic, recoverWalletFromPrivateKey } = useFirma();

  const [activeTab, setActiveTab] = useState<'mnemonic' | 'privatekey'>('mnemonic');
  const [mnemonic, setMnemonic] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [walletName, setWalletName] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateMnemonicForm = () => {
    const newErrors: any = {};

    if (!mnemonic.trim()) {
      newErrors.mnemonic = 'Mnemonic phrase is required';
    } else if (!isValidMnemonic(mnemonic.trim())) {
      newErrors.mnemonic = 'Invalid mnemonic phrase';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!walletName.trim()) {
      newErrors.walletName = 'Wallet name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePrivateKeyForm = () => {
    const newErrors: any = {};

    if (!privateKey.trim()) {
      newErrors.privateKey = 'Private key is required';
    } else if (!isValidPrivateKey(privateKey.trim())) {
      newErrors.privateKey = 'Invalid private key';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!walletName.trim()) {
      newErrors.walletName = 'Wallet name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRecoverFromMnemonic = async () => {
    if (!validateMnemonicForm()) return;

    setIsLoading(true);
    try {
      // Normalize the mnemonic - trim and ensure single spaces between words
      const normalizedMnemonic = mnemonic.trim().toLowerCase().replace(/\s+/g, ' ');

      const success = await recoverWalletFromMnemonic(
        normalizedMnemonic,
        walletName.trim(),
        password
      );

      if (success) {
        enqueueSnackbar('Wallet recovered successfully!', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        onBack(); // Return to offline mode menu instead of navigating to root
      } else {
        enqueueSnackbar('Failed to recover wallet', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred while recovering wallet', {
        variant: 'error',
        autoHideDuration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverFromPrivateKey = async () => {
    if (!validatePrivateKeyForm()) return;

    setIsLoading(true);
    try {
      const success = await recoverWalletFromPrivateKey(
        privateKey.trim(),
        walletName.trim(),
        password
      );

      if (success) {
        enqueueSnackbar('Wallet recovered successfully!', {
          variant: 'success',
          autoHideDuration: 3000,
        });
        onBack(); // Return to offline mode menu instead of navigating to root
      } else {
        enqueueSnackbar('Failed to recover wallet', {
          variant: 'error',
          autoHideDuration: 3000,
        });
      }
    } catch (error) {
      enqueueSnackbar('An error occurred while recovering wallet', {
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
        <Title>Recover Wallet</Title>
      </Header>

      <TabContainer>
        <Tab
          active={activeTab === 'mnemonic'}
          onClick={() => setActiveTab('mnemonic')}
        >
          Mnemonic Phrase
        </Tab>
        <Tab
          active={activeTab === 'privatekey'}
          onClick={() => setActiveTab('privatekey')}
        >
          Private Key
        </Tab>
      </TabContainer>

      {activeTab === 'mnemonic' ? (
        <FormContainer>
          <InfoBox>
            Enter your 12 or 24 word mnemonic phrase to recover your wallet.
            Make sure to enter the words in the correct order.
          </InfoBox>

          <InputGroup>
            <Label>Mnemonic Phrase</Label>
            <TextArea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value)}
              placeholder="Enter your mnemonic phrase..."
            />
            {errors.mnemonic && <ErrorMessage>{errors.mnemonic}</ErrorMessage>}
          </InputGroup>

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
            <Label>New Password</Label>
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
            onClick={handleRecoverFromMnemonic}
            disabled={isLoading}
          >
            {isLoading ? 'Recovering...' : 'Recover Wallet'}
          </Button>
        </FormContainer>
      ) : (
        <FormContainer>
          <InfoBox>
            Enter your private key to recover your wallet.
            Your private key should be a 64-character hexadecimal string.
          </InfoBox>

          <InputGroup>
            <Label>Private Key</Label>
            <TextArea
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              placeholder="Enter your private key..."
              style={{ fontFamily: 'monospace' }}
            />
            {errors.privateKey && <ErrorMessage>{errors.privateKey}</ErrorMessage>}
          </InputGroup>

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
            <Label>New Password</Label>
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
            onClick={handleRecoverFromPrivateKey}
            disabled={isLoading}
          >
            {isLoading ? 'Recovering...' : 'Recover Wallet'}
          </Button>
        </FormContainer>
      )}
    </Container>
  );
};

export default RecoverWallet;