import { FirmaConfig } from '@firmachain/firma-js';

const CHAIN_CONFIGS = {
  MAINNET: {
    FIRMACHAIN_CONFIG: FirmaConfig.MainNetConfig,
    LEDGER_FEE: 30000,
    LEDGER_GAS: 300000,
    EXPLORER_URI: 'https://',
    GRAPHQL_CONFIG: { URI: 'https://:8080/v1/graphql' },
    PARAMS: {
      BLOCKS_PER_YEAR: 0,
      AVERAGE_BLOCK_TIME: 0,
      COMMUNITY_POOL: 0,
      DENOM: '',
      SYMBOL: '',
    },
    IS_DEFAULT_GAS: true,
    ENABLE_IBC: true,
    RESATKE: {
      API: '',
      WEB: '',
      ADDRESS: '',
    },
    VALIDATOR_IDENTITY_JSON_URI: '',
    DOWNLOAD_LINK_LIST: ['', '', '', '', '', ''],
    VESTING_ACCOUNTS: [],
  },

  TESTNET: {
    FIRMACHAIN_CONFIG: FirmaConfig.TestNetConfig,
    LEDGER_FEE: 30000,
    LEDGER_GAS: 300000,
    EXPLORER_URI: 'https://',
    GRAPHQL_CONFIG: { URI: 'https://:8080/v1/graphql' },
    PARAMS: {
      BLOCKS_PER_YEAR: 0,
      AVERAGE_BLOCK_TIME: 0,
      COMMUNITY_POOL: 0,
      DENOM: '',
      SYMBOL: '',
    },
    IS_DEFAULT_GAS: true,
    RESATKE: {
      API: '',
      WEB: '',
      ADDRESS: '',
    },
    VALIDATOR_IDENTITY_JSON_URI: '',
    DOWNLOAD_LINK_LIST: ['', '', '', '', '', ''],
    VESTING_ACCOUNTS: [],
  },

  DEVNET: {
    FIRMACHAIN_CONFIG: FirmaConfig.DevNetConfig,
    LEDGER_FEE: 30000,
    LEDGER_GAS: 300000,
    EXPLORER_URI: 'https://',
    GRAPHQL_CONFIG: { URI: 'https://:8080/v1/graphql' },
    PARAMS: {
      BLOCKS_PER_YEAR: 0,
      AVERAGE_BLOCK_TIME: 0,
      COMMUNITY_POOL: 0,
      DENOM: '',
      SYMBOL: '',
    },
    IS_DEFAULT_GAS: true,
    ENABLE_IBC: false,
    RESATKE: {
      API: '',
      WEB: '',
      ADDRESS: '',
    },
    VALIDATOR_IDENTITY_JSON_URI: '',
    DOWNLOAD_LINK_LIST: ['', '', '', '', '', ''],
    VESTING_ACCOUNTS: [],
  },
};

export const CHAIN_CONFIG = CHAIN_CONFIGS.MAINNET;

export const OSMOSIS_EXPLORER = 'https://www.mintscan.io/osmosis';

export const NOTICE_JSON_URI = '';

export const NETWORK_INFO_LIST = [];

export const SESSION_TIMOUT = 1000 * 60 * 10;

export const HELP_URI = '';
export const GUIDE_LINK_LOGIN_WALLET = '';
export const GUIDE_LINK_NEW_WALLET = '';
export const GUIDE_LINK_CONFIRM_WALLET = '';
export const GUIDE_LINK_RECOVER_FROM_MNEMONIC = '';
export const GUIDE_LINK_IMPORT_PRIVATE_KEY = '';
export const GUIDE_LINK_CONNECT_TO_LEDGER = '';
export const GUIDE_LINK_WALLET_SETTING = '';
export const GUIDE_LINK_DOWNLOAD_PAPER_WALLET = '';
export const GUIDE_LINK_EXPORT_MNEMONIC = '';
export const GUIDE_LINK_EXPORT_PRIVATE_KEY = '';
export const GUIDE_LINK_SEND = '';
export const GUIDE_LINK_DELEGATE = '';
export const GUIDE_LINK_REDELEGATE = '';
export const GUIDE_LINK_UNDELEGATE = '';
export const GUIDE_LINK_NEW_PROPOSAL = '';
