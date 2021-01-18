import config from '../config/service-config';

import RiotAPI from './riot-api';
import { RiotTypes } from './riot-api';

import { Summoner, SummonerModel } from '../models/mongo/summoner';
import { ChampStat, ChampStatModel } from '../models/mongo/champ-stat';
import { DocumentType } from '@typegoose/typegoose';

async function update(name: string): Promise<boolean> {
  /* Get summoner info */
  const summonerInfo = await RiotAPI.getSummoner(name, 'name');
  if (summonerInfo === null) return false;

  /* Get old data of summoner from DB */
  const oldSummoner = await SummonerModel.findOne({
    puuid: summonerInfo.puuid,
  }).exec();

  /* Decide beginning point of a history searching */
  let beginTime: number;
  if (oldSummoner === null) {
    beginTime = Date.now() - 1209600000;
  } else {
    beginTime = Math.max(oldSummoner.updateTime + 1, Date.now() - 1209600000);
  }

  /* Update summoner tier*/
  const summonerPromise = updateSummoner(summonerInfo, oldSummoner);

  /* Get all match infos */
  const matchInfoPromises: Promise<RiotTypes.Match>[] = [];
  while (true) {
    const matchList = await RiotAPI.getMatchList(
      summonerInfo.accountId,
      undefined,
      beginTime,
      0
    ).then(
      (data) => data,
      (reason) => {
        console.log(reason);
        throw reason;
      }
    );

    if (matchList === null) break;

    for (let i = 0; i < matchList.matches.length; i++) {
      const gameID = matchList.matches[i].gameId;
      matchInfoPromises.push(
        RiotAPI.getMatch(gameID) as Promise<RiotTypes.Match>
      );
    }

    if (matchList.totalGames === matchList.endIndex) break;
  }
  const matchInfos = await Promise.all(matchInfoPromises);

  /* Get participant indexes */
  const indexes: number[] = [];
  for (let i = 0; i < matchInfos.length; i++) {
    const matchInfo = matchInfos[i];

    let index: number;
    for (index = 0; index < matchInfo.participants.length; index++) {
      if (
        matchInfo.participantIdentities[index].player.accountId ===
        summonerInfo.accountId
      ) {
        indexes.push(index);
        break;
      }
    }
  }

  /* Update champ stats */
  const champStatPromise = updateChampStat(matchInfos, indexes, summonerInfo);

  /* If everything is done until here, save updates in the DB */
  /* Crash can be occurred here. TODO: Implement proper way to do all or nothing. */
  const summoner = await summonerPromise;
  const champStats = await champStatPromise;

  const savePromises: Promise<DocumentType<any>>[] = [];
  for (let champStat of champStats) {
    savePromises.push(champStat.save());
  }
  savePromises.push(summoner.save());

  await Promise.all(savePromises);

  return true;
}

async function updateSummoner(
  summonerInfo: RiotTypes.Summoner,
  summoner: DocumentType<Summoner> | null
) {
  if (summoner === null) summoner = new SummonerModel();

  const leagueInfo = await RiotAPI.getLeague(summonerInfo.id).then(
    null,
    (reason) => {
      console.log(reason);
      throw reason;
    }
  );

  let solo = false;
  let flex = false;

  if (leagueInfo !== null)
    for (let i = 0; i < leagueInfo.length; i++) {
      const leagueEntry = leagueInfo[i];

      if (leagueEntry.queueType.includes('FLEX')) {
        summoner.flexTier = leagueEntry.tier + ' ' + leagueEntry.rank;
        summoner.flexLp = leagueEntry.leaguePoints;
        summoner.flexWins = leagueEntry.wins;
        summoner.flexLosses = leagueEntry.losses;
        flex = true;
      } else {
        summoner.soloTier = leagueEntry.tier + ' ' + leagueEntry.rank;
        summoner.soloLp = leagueEntry.leaguePoints;
        summoner.soloWins = leagueEntry.wins;
        summoner.soloLosses = leagueEntry.losses;
        solo = true;
      }
    }

  if (!flex) {
    summoner.flexTier = 'unranked';
    summoner.flexLp = 0;
    summoner.flexWins = 0;
    summoner.flexLosses = 0;
  }
  if (!solo) {
    summoner.soloTier = 'unranked';
    summoner.soloLp = 0;
    summoner.soloWins = 0;
    summoner.soloLosses = 0;
  }

  summoner.puuid = summonerInfo.puuid;
  summoner.name = summonerInfo.name;
  summoner.shortName = summonerInfo.name.replace(/ /gi, '');
  summoner.profileIconID = summonerInfo.profileIconId;
  summoner.summonerLevel = summonerInfo.summonerLevel;
  summoner.updateTime = Date.now();

  return summoner;
}

async function updateChampStat(
  matchInfos: RiotTypes.Match[],
  indexes: number[],
  summonerInfo: RiotTypes.Summoner
) {
  interface Key {
    puuid: string;
    championID: number;
    queueType: number;
    season: number;
  }

  const champStatMap: Map<string, DocumentType<ChampStat>> = new Map();
  const name = summonerInfo.name;
  const puuid = summonerInfo.puuid;
  const season = config.currentSeason;

  for (let i = 0; i < matchInfos.length; i++) {
    const matchInfo = matchInfos[i];
    const index = indexes[i];

    const participant = matchInfo.participants[index];
    const stats = participant.stats;

    const key: Key = {
      puuid,
      championID: participant.championId,
      queueType: matchInfo.queueId,
      season,
    };
    const keyStr = JSON.stringify(key);

    /* Find or make champ stat document */
    let champStat: DocumentType<ChampStat>;
    const temp = champStatMap.get(keyStr);
    if (temp === undefined) {
      const temp = await ChampStatModel.findOne(key)
        .exec()
        .catch((error) => {
          console.log;
          throw error;
        });

      if (temp === null) {
        champStat = ChampStatModel.makeDefault(
          puuid,
          key.championID,
          key.queueType,
          season
        );
      } else {
        champStat = temp;
      }

      champStatMap.set(keyStr, champStat);
    } else {
      champStat = temp;
    }

    champStat.kill += stats.kills;
    champStat.death += stats.deaths;
    champStat.assist += stats.assists;

    champStat.win += stats.win ? 1 : 0;
    champStat.loose += stats.win ? 0 : 1;

    champStat.totalCS += stats.totalMinionsKilled + stats.neutralMinionsKilled;
    champStat.totalDuration += matchInfo.gameDuration;

    champStat.tripleKill += stats.tripleKills;
    champStat.quadraKill += stats.quadraKills;
    champStat.pentaKill += stats.pentaKills;
  }

  return champStatMap.values();
}

export default {
  update,
};
