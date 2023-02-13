import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL;

export const getEdition4Tokens = (address: string) => {
  const url = `${BASE_URL}/api/index/tokens/e4/${address}`;
  return axios.get(url).then((res) => {
    return res.data;
  });
};

export const getEntryCoin = (address: string, tokenId: number = 3) => {
  const url = `${BASE_URL}/api/index/tokens/entrycoin/${address}/${tokenId}`;
  return axios.get(url).then((res) => {
    return res.data;
  });
};
