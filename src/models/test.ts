import { SummonerDoc, SummonerModel } from './mongo/summoner';
describe('summoner model test', () => {
  const validSummoner = {
    puuid: '',
    name: '',
    shortName: '',
    soloTier: '',
    soloLp: 0,
    soloWins: 0,
    soloLosses: 0,
    flexTier: '',
    flexLp: 0,
    flexWins: 0,
    flexLosses: 0,
    profileIconID: 0,
    summonerLevel: 0,
    updateTime: 0,
  } as SummonerDoc;

  it('valid summoner', async () => {
    const summoner = new SummonerModel();
    Object.assign(summoner, validSummoner);

    const error = summoner.validateSync();
  });
  it('some properties needed', () => {
    const summoner = new SummonerModel();

    const error = summoner.validateSync();
  });
});

export default '1';
