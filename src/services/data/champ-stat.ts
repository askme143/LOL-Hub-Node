import { ChampStatModel, ChampStatDoc } from '../../models/mongo/champ-stat';
import { pick } from '../utils/pick';

interface ChampStatData {
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
const keysOfChampStatData: Array<keyof ChampStatData> = [
  'championID',
  'kill',
  'death',
  'assist',
  'win',
  'loose',
  'totalCS',
  'totalDuration',
  'tripleKill',
  'quadraKill',
  'pentaKill',
];

function pickData(champStat: ChampStatDoc) {
  return pick(champStat, keysOfChampStatData);
}

async function get(name: string) {
  const champStats = await ChampStatModel.findByName(name);

  if (champStats === null) return [];

  const champStatDatas = champStats.reduce((prev, curr) => {
    prev.push(pickData(curr));
    return prev;
  }, [] as ChampStatData[]);

  return champStatDatas;
}

export default {
  get,
};
