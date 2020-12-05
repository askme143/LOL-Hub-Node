import { SummonerModel, SummonerDoc } from '../models/mongo/summoner';
import { SummonerError } from './errors';
import RiotAPI, { RiotTypes } from './riot-api';
import { pick } from './utils/pick';

interface SummonerData {
  name: string;
  profileIconID: number;
  summonerLevel: number;

  soloTier: string;
  soloLp: number;
  soloWins: number;
  soloLosses: number;

  flexTier: string;
  flexLp: number;
  flexWins: number;
  flexLosses: number;

  updateTime: number;
}

const keysOfSummonerData: Array<keyof SummonerData> = [
  'name',
  'profileIconID',
  'summonerLevel',
  'soloTier',
  'soloLp',
  'soloWins',
  'soloLosses',
  'flexTier',
  'flexLp',
  'flexWins',
  'flexLosses',
  'updateTime',
];

function pickData(summoner: SummonerDoc): SummonerData {
  return pick(summoner, keysOfSummonerData);
}

async function get(name: string) {
  const shortName = name.replace(/ /gi, '');
  const summoner = await SummonerModel.findOne({ shortName }).exec();

  if (summoner === null) throw new SummonerError('NoSuchSummoner');

  return pickData(summoner);
}

async function remove(puuid: string) {
  const removal = await SummonerModel.findOneAndDelete({ puuid }).exec();
  if (removal === null) throw new SummonerError('NoSuchSummoner');

  return true;
}

function fillSummonerField(
  summoner: SummonerDoc,
  riotSummoner: RiotTypes.Summoner,
  riotLeague: RiotTypes.LeagueEntry[] | null
) {
  summoner.soloTier = 'unranked';
  summoner.soloLp = 0;
  summoner.soloWins = 0;
  summoner.soloLosses = 0;
  summoner.flexTier = 'unranked';
  summoner.flexLp = 0;
  summoner.flexWins = 0;
  summoner.flexLosses = 0;

  if (riotLeague !== null)
    for (let i = 0; i < riotLeague.length; i++) {
      const leagueEntry = riotLeague[i];

      if (leagueEntry.queueType.includes('FLEX')) {
        summoner.flexTier = leagueEntry.tier + ' ' + leagueEntry.rank;
        summoner.flexLp = leagueEntry.leaguePoints;
        summoner.flexWins = leagueEntry.wins;
        summoner.flexLosses = leagueEntry.losses;
      } else {
        summoner.soloTier = leagueEntry.tier + ' ' + leagueEntry.rank;
        summoner.soloLp = leagueEntry.leaguePoints;
        summoner.soloWins = leagueEntry.wins;
        summoner.soloLosses = leagueEntry.losses;
      }
    }

  summoner.puuid = riotSummoner.puuid;
  summoner.name = riotSummoner.name;
  summoner.shortName = riotSummoner.name.replace(/ /gi, '');
  summoner.profileIconID = riotSummoner.profileIconId;
  summoner.summonerLevel = riotSummoner.summonerLevel;
  summoner.updateTime = Date.now();
}

async function create(name: string) {
  const shortName = name.replace(/ /gi, '');
  if ((await SummonerModel.findOne({ shortName }).exec()) !== null)
    throw new SummonerError('AlreadyExists');

  const riotSummoner = await RiotAPI.getSummoner(shortName, 'name');
  if (riotSummoner === null) throw new SummonerError('NoSuchSummoner');

  const summoner = new SummonerModel();
  const riotLeague = await RiotAPI.getLeague(riotSummoner.id);

  fillSummonerField(summoner, riotSummoner, riotLeague);

  return summoner;
}

async function update(name: string) {
  const shortName = name.replace(/ /gi, '');

  const summoner = await SummonerModel.findOne({ shortName }).exec();
  if (summoner === null) throw new SummonerError('NoSuchSummoner');

  const riotSummoner = await RiotAPI.getSummoner(summoner.puuid, 'puuid');
  if (riotSummoner === null) throw new SummonerError('WithdrawnSummoner');

  const riotLeague = await RiotAPI.getLeague(riotSummoner.id);

  fillSummonerField(summoner, riotSummoner, riotLeague);

  return summoner;
}

export default {
  create,
  get,
  update,
  remove,
};
