import { FirmaUtil } from "@firmachain/firma-js";
import { FIRMACHAIN_CONFIG } from "../config";

export const isElectron = navigator.userAgent.includes("Electron");

export const getFeesFromGas = (estimatedGas: number) => {
  const fee = Math.ceil(estimatedGas * 0.1);

  return Math.max(fee, FIRMACHAIN_CONFIG.defaultFee);
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
  if (data === "") return false;

  return true;
};

export const getValidDefaultValue = (data: any, defaultValue: any) => {
  if (isValid(data)) return data;
  else return defaultValue;
};

export const convertNumber = (value: string | number) => {
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
      let textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      textArea.style.position = "absolute";
      textArea.style.opacity = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((res: any, rej: any) => {
        document.execCommand("copy") ? res() : rej();
        textArea.remove();
      });
    }
  } catch (e) {}
};
