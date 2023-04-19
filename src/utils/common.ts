import { FirmaUtil } from '@firmachain/firma-js';
import { CHAIN_CONFIG } from '../config';

export const isElectron = navigator.userAgent.includes('Electron');

export const isExternalConnect = (isLedger: boolean, isMobileApp: boolean) => {
  return isLedger || isMobileApp;
};

export const convertNumberFormat = (value: string | number, point: number = 2): string => {
  return convertCurrent(makeDecimalPoint(value, point));
};

export const makeDecimalPoint = (value: string | number, point: number = 2) => {
  if (value === undefined) return '0';
  const val = convertNumber(value).toString();
  const pointPos = val.indexOf('.');

  if (pointPos === -1) return Number(val).toFixed(point);

  const splitValue = val.split('.');
  const belowDecimal = splitValue[1].substring(0, point);
  return Number(`${splitValue[0]}.${belowDecimal}`).toFixed(point);
};

export const convertCurrent = (value: number | string) => {
  var val = value.toString().split('.');
  val[0] = val[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return val.join('.');
};

export const getFeesFromGas = (estimatedGas: number) => {
  const fee = Math.ceil(estimatedGas * 0.1);

  return Math.max(fee, CHAIN_CONFIG.FIRMACHAIN_CONFIG.defaultFee);
};

export const getDefaultFee = (isLedger: boolean, isMobileApp: boolean): number => {
  return isLedger || isMobileApp ? CHAIN_CONFIG.LEDGER_FEE : CHAIN_CONFIG.FIRMACHAIN_CONFIG.defaultFee;
};

export const getDefaultGas = (isLedger: boolean, isMobileApp: boolean) => {
  return isLedger || isMobileApp ? CHAIN_CONFIG.LEDGER_GAS : CHAIN_CONFIG.FIRMACHAIN_CONFIG.defaultGas;
};

export const isValid = (data: any) => {
  if (data === null) return false;
  if (data === undefined) return false;
  if (Object.keys(data).length === 0) return false;

  return true;
};

export const isValidString = (data: any) => {
  if (data === null) return false;
  if (data === undefined) return false;
  if (data === '') return false;

  return true;
};

export const getValidDefaultValue = (data: any, defaultValue: any) => {
  if (isValid(data)) return data;
  else return defaultValue;
};

export const convertNumber = (value: string | number | undefined) => {
  if (isNaN(Number(value))) return 0;

  return Number(value);
};

export const convertToTokenString = (amount: string, decimal: number) => {
  return FirmaUtil.getTokenStringFromUToken(convertNumber(amount), convertNumber(decimal));
};

export const convertToTokenNumber = (amount: number | string, decimal: string) => {
  return convertNumber(FirmaUtil.getTokenStringFromUToken(convertNumber(amount), convertNumber(decimal)));
};

export const convertToFctString = (uFctAmount: string) => {
  return FirmaUtil.getFCTStringFromUFCTStr(uFctAmount);
};

export const convertToFctNumber = (uFctAmount: number | string) => {
  return convertNumber(FirmaUtil.getFCTStringFromUFCTStr(uFctAmount.toString()));
};

export const copyToClipboard = (textToCopy: string) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(textToCopy);
    } else {
      let textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.position = 'absolute';
      textArea.style.opacity = '0';

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((res: any, rej: any) => {
        document.execCommand('copy') ? res() : rej();
        textArea.remove();
      });
    }
  } catch (error) {}
};

export const getUTCDateFormat = (date: Date) => {
  return `${date.getUTCFullYear()}-${('00' + (date.getUTCMonth() + 1)).slice(-2)}-${('00' + date.getUTCDate()).slice(
    -2
  )}`;
};

export const getRestakeStatus = (status: number, isLedger = false) => {
  if (isLedger) return 'Not supported';

  switch (status) {
    case -1:
      return 'Maintenance';
    case 0:
      return 'Inactive';
    case 1:
      return 'Active';
    case 2:
      return 'Not yet delegated';
  }
};

export const getRestakeStatusColor = (status: number, isLedger = false) => {
  if (isLedger) return '#888888';

  switch (status) {
    case -1:
      return '#D89614';
    case 0:
      return '#b08dff';
    case 1:
      return '#48b495';
    case 2:
      return '#888888';
  }
};
