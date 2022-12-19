import { CHAIN_CONFIG, HELP_URI } from '../config';
import { IMenu } from '../interfaces/sidebar';

import HomeIcon from '@mui/icons-material/Home';
import AccountsIcon from '@mui/icons-material/AccountBalanceWallet';
import HistoryIcon from '@mui/icons-material/History';
import StakingIcon from '@mui/icons-material/Inbox';
import GovernmentIcon from '@mui/icons-material/AccountBalance';
import ForumIcon from '@mui/icons-material/Forum';
import BuyFirmaIcon from '@mui/icons-material/Payment';
import ExplorerIcon from '@mui/icons-material/Public';
import DownloadIcon from '@mui/icons-material/Archive';
import HelpIcon from '@mui/icons-material/Help';

export const mainMenuList: IMenu[] = [
  { name: 'Home', path: '/', icon: HomeIcon, externalLink: '' },
  { name: 'Accounts', path: '/accounts', icon: AccountsIcon, externalLink: '' },
  { name: 'History', path: '/history', icon: HistoryIcon, externalLink: '' },
  { name: 'Staking', path: '/staking', icon: StakingIcon, externalLink: '' },
  { name: 'Governance', path: '/government', icon: GovernmentIcon, externalLink: '' },
  {
    name: 'Download',
    path: '/download',
    icon: DownloadIcon,
    externalLink: '',
  },
];

export const subMenuList: IMenu[] = [
  {
    name: 'Help',
    path: '/help',
    icon: HelpIcon,
    externalLink: HELP_URI,
  },

  { name: 'Community', path: '/community', icon: ForumIcon, externalLink: '' },
  {
    name: 'Explorer',
    path: '/explorer',
    icon: ExplorerIcon,
    externalLink: CHAIN_CONFIG.EXPLORER_URI,
  },
  {
    name: 'Buy FCT',
    path: '/market',
    icon: BuyFirmaIcon,
    externalLink: 'https://coinmarketcap.com/currencies/firmachain/markets',
  },
];

export const bottomMenuList: IMenu[] = [
  {
    name: 'Restake',
    path: '/restake',
    icon: null,
    externalLink: CHAIN_CONFIG.RESTAKE.WEB,
  },
];
