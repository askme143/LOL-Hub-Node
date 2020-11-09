import axios, { AxiosError } from 'axios';
import config from '../../config/riot-config';
import * as T from './types';

/*  403: API Key forbidden
    404: Data not found
    429: Rate limit exceeded */

const apiKey: string | null = config.apiKey;
const requestHeader = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Whale/2.8.107.16 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Charset': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Riot-Token': apiKey,
  },
};

function checkAPIKey() {
  if (apiKey === null) {
    console.log(apiKey);
    throw Error('Invalid api key');
  }
}

async function getSummoner(name: string): Promise<T.Summoner | null> {
  checkAPIKey();

  const url =
    'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
    encodeURI(name);

  const response = await axios
    .get(url, requestHeader)
    .catch((error: AxiosError) => {
      if (error.response && error.response.status == 404) {
        return null;
      } else {
        throw error;
      }
    });

  if (response === null) {
    return null;
  } else {
    return response.data as T.Summoner;
  }
}

export default {
  getSummoner,
};
