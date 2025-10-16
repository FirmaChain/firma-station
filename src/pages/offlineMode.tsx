import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
`;

const FeatureCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const FeatureTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const FeatureDescription = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const WarningBanner = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 4px;
  padding: 12px 16px;
  color: #856404;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BackButton = styled.button`
  background: #3B82F6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;

  &:hover {
    background: #2563EB;
  }
`;

const ComponentContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const OfflineMode = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const features = [
    {
      id: 'create',
      title: 'Create New Wallet',
      description: 'Generate a new wallet with a secure mnemonic phrase'
    },
    {
      id: 'recover',
      title: 'Recover Wallet',
      description: 'Recover your wallet using a mnemonic phrase or private key'
    },
    {
      id: 'paperwallet',
      title: 'Download Paper Wallet',
      description: 'Generate and download a paper wallet PDF with your wallet information'
    },
    {
      id: 'mnemonic',
      title: 'Export Mnemonic',
      description: 'Export your wallet\'s mnemonic phrase for backup purposes'
    },
    {
      id: 'privatekey',
      title: 'Export Private Key',
      description: 'Export your wallet\'s private key for advanced usage'
    },
    {
      id: 'disconnect',
      title: 'Disconnect Wallet',
      description: 'Safely disconnect and remove wallet from this browser'
    }
  ];

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
  };

  const handleBack = () => {
    setActiveFeature(null);
  };

  // Lazy load components to avoid import issues
  const renderActiveComponent = () => {
    if (!activeFeature) return null;

    switch (activeFeature) {
      case 'create': {
        const CreateWallet = React.lazy(() => import('../organisms/offlineMode/createWallet'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <CreateWallet onBack={handleBack} />
          </React.Suspense>
        );
      }
      case 'recover': {
        const RecoverWallet = React.lazy(() => import('../organisms/offlineMode/recoverWallet'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <RecoverWallet onBack={handleBack} />
          </React.Suspense>
        );
      }
      case 'paperwallet': {
        const DownloadPaperWallet = React.lazy(() => import('../organisms/offlineMode/downloadPaperWallet'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <DownloadPaperWallet onBack={handleBack} />
          </React.Suspense>
        );
      }
      case 'mnemonic': {
        const ExportMnemonic = React.lazy(() => import('../organisms/offlineMode/exportMnemonic'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ExportMnemonic onBack={handleBack} />
          </React.Suspense>
        );
      }
      case 'privatekey': {
        const ExportPrivateKey = React.lazy(() => import('../organisms/offlineMode/exportPrivateKey'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <ExportPrivateKey onBack={handleBack} />
          </React.Suspense>
        );
      }
      case 'disconnect': {
        const DisconnectWallet = React.lazy(() => import('../organisms/offlineMode/disconnectWallet'));
        return (
          <React.Suspense fallback={<div>Loading...</div>}>
            <DisconnectWallet onBack={handleBack} />
          </React.Suspense>
        );
      }
      default:
        return null;
    }
  };

  return (
    <Container>
      {!activeFeature ? (
        <>
          <div>
            <Title>Offline Wallet Management</Title>
            <Description>
              Manage your wallet securely in offline mode. You can recover wallets, export keys,
              and perform other wallet operations without connecting to the blockchain.
            </Description>
          </div>

          <WarningBanner>
            ⚠️ Warning: These operations involve sensitive wallet data. Make sure you are in a secure environment.
          </WarningBanner>

          <FeatureGrid>
            {features.map((feature) => (
              <FeatureCard
                key={feature.id}
                onClick={() => handleFeatureClick(feature.id)}
              >
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeatureGrid>
        </>
      ) : (
        <ComponentContainer>
          <BackButton onClick={handleBack}>← Back to Offline Mode</BackButton>
          {renderActiveComponent()}
        </ComponentContainer>
      )}
    </Container>
  );
};

export default OfflineMode;