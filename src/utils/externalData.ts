import axios from 'axios';
import { CHAIN_CONFIG, NOTICE_JSON_URI } from '../config';

export const getNotice = async (): Promise<{
  isShow: boolean;
  title: string;
  content: string;
  link: string;
} | null> => {
  try {
    const response = await axios.get(`${NOTICE_JSON_URI}?t=${new Date().getTime()}`);
    const maintenance = response.data.maintenance;

    return maintenance;
  } catch (error) {
    return null;
  }
};

export const getContactAddressList = async (): Promise<any> => {
  try {
    const response = await axios.get(`${CHAIN_CONFIG.WALLET_JSON}?t=${new Date().getTime()}`);
    const contactAddressList = response.data.contactAddressList;

    return contactAddressList;
  } catch (error) {
    return null;
  }
};
