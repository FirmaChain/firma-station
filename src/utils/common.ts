import { FirmaUtil } from "@firmachain/firma-js";

export const isValid = (data: any) => {
  if (data === null) return false;
  if (data === undefined) return false;
  if (Object.keys(data).length === 0) return false;

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

export const convertToFctString = (uFctAmount: string) => {
  return FirmaUtil.getFCTStringFromUFCT(convertNumber(uFctAmount));
};

export const convertToFctNumber = (uFctAmount: number | string) => {
  return convertNumber(FirmaUtil.getFCTStringFromUFCT(convertNumber(uFctAmount)));
};
