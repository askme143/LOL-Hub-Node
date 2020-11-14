import RequestQueue from './request-queue';
import * as T from './types';

/*  403: API Key forbidden
    404: Data not found
    429: Rate limit exceeded */

class RiotAPI {
  private requestQueue: RequestQueue | null = null;

  init(key: string, maxRequestRate: number) {
    this.requestQueue = new RequestQueue(key, maxRequestRate);
  }

  async getSummoner(name: string): Promise<T.Summoner | null> {
    if (this.requestQueue === null) {
      throw Error('RiotAPI not initialized');
    }

    const url =
      'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
      encodeURI(name);

    const response = await this.requestQueue.push(url);

    return response as T.Summoner | null;
  }
}

const riotAPI = new RiotAPI();

export default riotAPI;
export const getNewRiotAPI = function () {
  return new RiotAPI();
};
