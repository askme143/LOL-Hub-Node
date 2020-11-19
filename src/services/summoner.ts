import Summoner from '../models/mongo/summoner';
import { getModelForClass } from '@typegoose/typegoose';

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

const makeSummonerData = ({
  name,
  profileIconID,
  summonerLevel,
  soloTier,
  soloLp,
  soloWins,
  soloLosses,
  flexTier,
  flexLp,
  flexWins,
  flexLosses,
  updateTime,
}: SummonerData) =>
  ({
    name,
    profileIconID,
    summonerLevel,
    soloTier,
    soloLp,
    soloWins,
    soloLosses,
    flexTier,
    flexLp,
    flexWins,
    flexLosses,
    updateTime,
  } as SummonerData);

const SummonerModel = getModelForClass(Summoner);

async function getSummoner(name: string): Promise<SummonerData | null> {
  const summoner = await SummonerModel.findOneByName(name);

  if (summoner === null) return null;
  return makeSummonerData(summoner);
}

export default {
  getSummoner,
};
