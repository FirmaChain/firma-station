# Firma Station - Desktop & Web App Wallet Service

![screen](https://user-images.githubusercontent.com/89889026/145321320-d5ae624b-0426-4203-b1c7-daae92a2b8ee.png)

## Overview

Firma Station is a desktop application for FirmaChain service like wallet, staking, voting.

This app is required for Mainnet Coin swaps service, and MainNet wallets can only be created through this app on user side.

Both Web and Desktop apps are being developed to work, and will be modularized so that they can be used in mobile wallets in the future.

It is currently under development and early stage development and provide detail features through integration with Firma-JS.

This app can also be used for TestNet and using Faucet, you can test various scenarios.

**WARNING**: The coin obtained through firma station devnet/testnet is not compatible with the coin of mainnet and has no value.

## Features

- **Wallet Management**: Create wallets, recover from mnemonic, import private keys
- **Hardware Wallet**: Ledger hardware wallet support
- **Staking**: Delegate, redelegate, undelegate tokens and claim rewards
- **Governance**: Vote on proposals and create new proposals
- **Multi-Token**: FCT and IBC token support
- **Paper Wallet**: Offline wallet generation

## How to Build Firma Station

### Prerequisites

- Node.js 18+
- Yarn

### 1. Install depdendency

```bash
git clone https://github.com/firmachain/firma-station.git
cd firma-station

nvm use
yarn install
yarn run dev
```

### 2. Configuration

Copy the sample configuration file:

```bash
cp src/config.sample.ts src/config.ts
```

Edit `src/config.ts` with your network settings.

### 3. Build for Production

```bash
yarn build
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Blockchain**: @firmachain/firma-js, Ledger support
- **State**: Redux Toolkit
- **UI**: Material-UI, Styled Components

## E2E Test

```bash
yarn cypress:open
```

## Scripts

- `yarn dev`: Start development server
- `yarn build`: Build for production
- `yarn start`: Preview production build

## Contact

- Email: info@firmachain.org
- Issues: [GitHub Issues](https://github.com/firmachain/firma-station/issues)
