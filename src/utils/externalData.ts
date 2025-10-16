import axios from 'axios';
import { NOTICE_JSON_URI } from '../config';

export const getNotice = async (): Promise<{
  isShow: boolean;
  title: string;
  content: string;
  link: string;
} | null> => {
  try {
    if (!NOTICE_JSON_URI) {
      return null;
    }
    const response = await axios.get(`${NOTICE_JSON_URI}?t=${new Date().getTime()}`);
    const maintenance = response.data?.maintenance;

    // Ensure maintenance has the required structure
    if (maintenance && typeof maintenance === 'object' && 'isShow' in maintenance) {
      return maintenance;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const getContactAddressList = async (): Promise<string[] | null> => {
  try {
    // WALLET_JSON is not defined in CHAIN_CONFIG, returning empty array for now
    // This should be configured properly when the wallet JSON endpoint is available
    return [];
  } catch {
    return null;
  }
};
