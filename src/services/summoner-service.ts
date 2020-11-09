import { getModelForClass } from '@typegoose/typegoose';
import { Service } from 'typedi';
import Summoner from '../models/mongo/summoner';
import RiotAPI from '../models/riot-api';

interface SummonerData {
  name: string;
  profileIconID: number;
  summonerLevel: number;
}

@Service()
class SummonerService {
  private SummonerModel = getModelForClass(Summoner);

  constructor() {}

  async getSummoner(name: string): Promise<SummonerData | null> {
    name = name.replace(/ /gi, '');

    let summoner = await this.SummonerModel.findOneByName(name).catch(() => {
      /* Cannot handle. LOG error */
      return null;
    });

    /* In mongodb */
    if (summoner) {
      return {
        name: summoner.name,
        profileIconID: summoner.profileIconID,
        summonerLevel: summoner.summonerLevel,
      };
    }

    summoner = new this.SummonerModel();
    const summonerInfo = await RiotAPI.getSummoner(name);

    if (summonerInfo === null) {
      /* Summoner not found */
      return null;
    } else {
      /* Summoner found */
      /* Save on local mongodb */

      summoner.ID = summonerInfo.id;
      summoner.accountID = summonerInfo.accountId;
      summoner.puuid = summonerInfo.puuid;
      summoner.name = summonerInfo.name;
      summoner.shortName = summonerInfo.name.replace(/ /gi, '');
      summoner.profileIconID = summonerInfo.profileIconId;
      summoner.revisionDate = summonerInfo.revisionDate;
      summoner.summonerLevel = summonerInfo.summonerLevel;

      summoner.save();

      return {
        name: summoner.name,
        profileIconID: summoner.profileIconID,
        summonerLevel: summoner.summonerLevel,
      };
    }
  }

  async findSummoner(name: string) {}
  async addSummoner(name: string) {}
}

export default SummonerService;
