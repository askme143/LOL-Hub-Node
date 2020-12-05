import { handleRiotAPIError } from './error';
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

  init(key: string, maxRequestSec: number, maxRequestMin?: number) {
    this.requestQueue =
      maxRequestMin !== undefined
        ? new RequestQueue(key, maxRequestSec, maxRequestMin)
        : new RequestQueue(key, maxRequestSec);
  }

  getSummoner(key: string, by: 'name' | 'puuid'): Promise<T.Summoner | null> {
    if (this.requestQueue === null) throw Error('RiotAPI not initialized');

    let url = 'https://kr.api.riotgames.com/lol/summoner/v4/summoners/';
    switch (by) {
      case 'name':
        url += 'by-name/';
        break;
      case 'puuid':
        url += 'by-puuid/';
        break;
    }
    url += encodeURI(key);

    return this.requestQueue
      .push(url)
      .then(null, handleRiotAPIError) as Promise<T.Summoner | null>;
  }

  getMatchList(
    accountID: string,
    queueType?: 'solo' | 'flex',
    beginTime?: number,
    beginIndex?: number
  ): Promise<T.MatchList | null> {
    if (this.requestQueue === null) throw Error('RiotAPI not initialized');

    let url =
      'https://kr.api.riotgames.com/lol/match/v4/matchlists/by-account/' +
      encodeURI(accountID);

    switch (queueType) {
      case 'solo':
        url += `?queue=${QueueType.solo}&`;
        break;
      case 'flex':
        url += `?queue=${QueueType.flex}&`;
        break;
      default:
        url +=
          `?queue=${QueueType.solo}&` +
          `queue=${QueueType.flex}&` +
          `queue=${QueueType.blind}&`;
    }

    if (beginTime !== undefined) url += `beginTime=${beginTime}&`;
    if (beginIndex !== undefined) url += `beginIndex=${beginIndex}&`;

    return this.requestQueue
      .push(url)
      .then(null, handleRiotAPIError) as Promise<T.MatchList | null>;
  }

  getMatch(gameID: number): Promise<T.Match | null> {
    if (this.requestQueue === null) throw Error('RiotAPI not initialized');

    let url =
      'https://kr.api.riotgames.com/lol/match/v4/matches/' +
      encodeURI(gameID.toString());

    return this.requestQueue
      .push(url)
      .then(null, handleRiotAPIError) as Promise<T.Match>;
  }

  getLeague(Id: string): Promise<T.LeagueEntry[] | null> {
    if (this.requestQueue === null) throw Error('RiotAPI not initialized');

    let url =
      'https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/' +
      encodeURI(Id);

    return this.requestQueue
      .push(url)
      .then(null, handleRiotAPIError) as Promise<T.LeagueEntry[] | null>;
  }
}

const riotAPI = new RiotAPI();

export default riotAPI;
export * as RiotTypes from './types';
export function getNewRiotAPI() {
  return new RiotAPI();
}
