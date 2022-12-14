export interface IHistoryByAddressState {
  historyList: IHistory[];
}

interface IHistory {
  height: number;
  hash: string;
  type: string;
  timestamp: string;
  success: boolean;
}

export interface ITokensState {
  [key: string]: IToken;
}

export interface ITransferHistoryByAddressState {
  historyList: IHistoryTransfer[];
}

interface IHistoryTransfer {
  height: number;
  hash: string;
  type: string;
  from: string;
  to: string;
  denom: string;
  amount: string;
  memo: string;
  timestamp: string;
  success: boolean;
}

interface IToken {
  denom: string;
  symbol: string;
  decimal: number;
}
