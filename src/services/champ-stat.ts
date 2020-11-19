import ChampStat from '../models/mongo/champ-stat';
import { getModelForClass } from '@typegoose/typegoose';

interface ChampStatRawData {
  championID: number;

  kill: number;
  death: number;
  assist: number;

  win: number;
  loose: number;

  totalCS: number;
  totalDuration: number;

  tripleKill: number;
  quadraKill: number;
  pentaKill: number;
}

interface ChampStatData {
  championID: number;

  kill: number;
  death: number;
  assist: number;

  win: number;
  loose: number;
  winRate: string;

  averageCS: string;
  csPerMin: string;

  tripleKill: number;
  quadraKill: number;
  pentaKill: number;
}

function makeChampStatData({
  championID,
  kill,
  death,
  assist,
  win,
  loose,
  totalCS,
  totalDuration,
  tripleKill,
  quadraKill,
  pentaKill,
}: ChampStatRawData) {
  return {
    championID,
    kill,
    death,
    assist,
    win,
    loose,
    winRate: (win / (win + loose)).toFixed(1),
    averageCS: (totalCS / (win + loose)).toFixed(1),
    csPerMin: ((totalCS * 60) / totalDuration).toFixed(1),
    totalDuration,
    tripleKill,
    quadraKill,
    pentaKill,
  } as ChampStatData;
}

const ChampStatModel = getModelForClass(ChampStat);

async function getChampStat(name: string) {
  const champStats = await ChampStatModel.findByName(name);
  const champStatDatas: ChampStatData[] = [];

  if (champStats === null) return [];
  for (let i = 0; i < champStats.length; i++) {
    champStatDatas.push(makeChampStatData(champStats[i]));
  }
  return champStatDatas;
}

export default {
  getChampStat,
};
