import RequestQueue from './request-queue';
import * as T from './types';

/*  403: API Key forbidden
    404: Data not found
    429: Rate limit exceeded */

enum QueueType {
  solo = 420,
  flex = 440,
  blind = 430,
}

class RiotAPI {
  private requestQueue: RequestQueue | null = null;

  init(key: string, maxRequest: number, maxRequestMinute?: number) {
    if (maxRequestMinute === undefined) {
      this.requestQueue = new RequestQueue(key, maxRequest);
    } else {
      this.requestQueue = new RequestQueue(key, maxRequest, maxRequestMinute);
    }
  }

  async getSummoner(name: string): Promise<T.Summoner> {
    if (this.requestQueue === null) {
      throw Error('RiotAPI not initialized');
    }

    const url =
      'https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/' +
      encodeURI(name);
    const response = await this.requestQueue.push(url);

    return response as T.Summoner;
  }

  async getMatchList(
    accountID: string,
    queueType?: 'solo' | 'flex' | 'total',
    beginTime?: number,
    beginIndex?: number
  ) {
    if (this.requestQueue === null) {
      throw Error('RiotAPI not initialized');
    }

    let url =
      'https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/' +
      encodeURI(accountID);

    if (queueType === 'solo') {
      url += `?queue=${QueueType.solo}&`;
    } else if (queueType === 'flex') {
      url += `?queue=${QueueType.flex}&`;
    } else {
      url +=
        `?queue=${QueueType.solo}&` +
        `queue=${QueueType.flex}&` +
        `queue=${QueueType.blind}&`;
    }

    if (beginTime !== undefined) {
      url += `beginTime=${beginTime}&`;
    }

    if (beginIndex !== undefined) {
      url += `beginIndex=${beginIndex}&`;
    }

    const response = await this.requestQueue.push(url);

    return response as T.MatchList;
  }

  async getMatch(gameID: number) {
    if (this.requestQueue === null) {
      throw Error('RiotAPI not initialized');
    }

    let url =
      'https://kr.api.riotgames.com/lol/match/v4/matches/' +
      encodeURI(gameID.toString());
    const response = await this.requestQueue.push(url);

    return response as T.Match;
  }

  async getLeague(Id: string) {
    if (this.requestQueue === null) {
      throw Error('RiotAPI not initialized');
    }

    let url =
      'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' +
      encodeURI(Id.toString());
    const response = await this.requestQueue.push(url);

    return response as T.LeagueEntry[];
  }
}

const riotAPI = new RiotAPI();

export default riotAPI;
export * as RiotTypes from './types';
export const getNewRiotAPI = function () {
  return new RiotAPI();
};
