import { SummonerModel, SummonerDoc } from '../models/mongo/summoner';
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
  const summoner = await SummonerModel.findOneByName(name);
  if (summoner === null) return null;

  return pickData(summoner);
}

export default {
  get,
};
