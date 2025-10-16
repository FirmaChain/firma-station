import { FirmaConfig } from '@firmachain/firma-js';

const CHAIN_CONFIGS = {
  MAINNET: {
    FIRMACHAIN_CONFIG: FirmaConfig.MainNetConfig,
    LEDGER_FEE: 30000,
    LEDGER_GAS: 300000,
    API_HOST: 'https://',
    EXPLORER_URI: 'https://',
    GRAPHQL_CONFIG: { URI: 'https://:8080/v1/graphql' },
    PARAMS: {
      BLOCKS_PER_YEAR: 0,
      AVERAGE_BLOCK_TIME: 0,
      COMMUNITY_POOL: 0,
      DENOM: '',
      SYMBOL: ''
    },
    IS_DEFAULT_GAS: true,
    ENABLE_IBC: true,
    RESTAKE: {
      API: 'https://',
      WEB: 'https://',
      ADDRESS: ''
    },
    PROPOSAL_JSON: 'https://',
    WALLET_JSON: 'https://',
    VALIDATOR_IDENTITY_JSON_URI: 'https://',
    DOWNLOAD_LINK_LIST: ['', '', '', '', '', ''],
    VESTING_ACCOUNTS: []
  },

  TESTNET: {
    FIRMACHAIN_CONFIG: FirmaConfig.TestNetConfig,
    LEDGER_FEE: 30000,
    LEDGER_GAS: 300000,
    API_HOST: 'https://',
    EXPLORER_URI: 'https://',
    GRAPHQL_CONFIG: { URI: 'https://:8080/v1/graphql' },
    PARAMS: {
      BLOCKS_PER_YEAR: 0,
      AVERAGE_BLOCK_TIME: 0,
      COMMUNITY_POOL: 0,
      DENOM: '',
      SYMBOL: ''
    },
    IS_DEFAULT_GAS: true,
    ENABLE_IBC: false,
    RESTAKE: {
      API: 'https://',
      WEB: 'https://',
      ADDRESS: ''
    },
    PROPOSAL_JSON: 'https://',
    WALLET_JSON: 'https://',
    VALIDATOR_IDENTITY_JSON_URI: '',
    DOWNLOAD_LINK_LIST: ['', '', '', '', '', ''],
    VESTING_ACCOUNTS: []
  },

  DEVNET: {
    FIRMACHAIN_CONFIG: FirmaConfig.DevNetConfig,
    LEDGER_FEE: 30000,
    LEDGER_GAS: 300000,
    API_HOST: 'http://',
    EXPLORER_URI: 'http://',
    GRAPHQL_CONFIG: { URI: 'http://:8080/v1/graphql' },
    PARAMS: {
      BLOCKS_PER_YEAR: 0,
      AVERAGE_BLOCK_TIME: 0,
      COMMUNITY_POOL: 0,
      DENOM: '',
      SYMBOL: ''
    },
    IS_DEFAULT_GAS: true,
    ENABLE_IBC: false,
    RESTAKE: {
      API: 'http://',
      WEB: 'http://',
      ADDRESS: ''
    },
    PROPOSAL_JSON: '',
    WALLET_JSON: '',
    VALIDATOR_IDENTITY_JSON_URI: '',
    DOWNLOAD_LINK_LIST: ['', '', '', '', '', ''],
    VESTING_ACCOUNTS: []
  }
};

export const OSMOSIS_EXPLORER = '';

export const SESSION_TIMOUT = 1000 * 60 * 10;

export const NOTICE_JSON_URI = '';

export const CHAIN_CONFIG = CHAIN_CONFIGS.MAINNET;

export const IBC_CONFIG: { [key: string]: { symbol: string; decimal: number; channel: string; port: string } } = {
  // Add IBC configurations as needed
  // Example:
  // 'ibc/0471F1C4E7AFD3F07702BEF6DC365268D64570F7C1FDC98EA6098DD6DE59817B': {
  //   symbol: 'OSMO',
  //   decimal: 6,
  //   channel: 'channel-1',
  //   port: 'transfer'
  // }
};

export const COMMON_KEY = '';

export const NETWORK_INFO_LIST = [];

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