import axios from 'axios';
import { CHAIN_CONFIG } from '../config';

const useAPI = () => {
  const checkRequest = async (requestKey: string) => {
    try {
      const requestData = await getRequestStatus(requestKey);
      return requestData;
    } catch (error) {
      return 0;
    }
  };

  const generateRequestQR = async (
    module: string,
    body = {}
  ): Promise<{ requestKey: string; qrcode: string; expire: Date } | null> => {
    try {
      const requestData = await generateRequest(module, body);
      return requestData;
    } catch (error) {
      return null;
    }
  };

  const generateRequest = async (
    requestType: string,
    requestBody = {}
  ): Promise<{ requestKey: string; qrcode: string; expire: Date }> => {
    const response = await axios.post(`${CHAIN_CONFIG.API_HOST}/connect/sign${requestType}`, requestBody);
    if (response.data.code !== 0) throw new Error('INVALID REQUEST');

    const { requestKey, qrcode } = response.data.result;

    const expire = new Date();
    expire.setMinutes(expire.getMinutes() + 3);

    return {
      requestKey,
      qrcode,
      expire,
    };
  };

  const getRequestStatus = async (requestKey: string) => {
    const response = await axios.get(`${CHAIN_CONFIG.API_HOST}/connect/requests/${requestKey}`);

    if (response.data.code < 0 || response.data.status === -1) {
      throw new Error('INVALID REQUEST');
    }

    return response.data.result;
  };

  return {
    checkRequest,
    generateRequestQR,
  };
};

export default useAPI;
