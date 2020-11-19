import {
  getModelForClass,
  ReturnModelType,
  prop,
  index,
} from '@typegoose/typegoose';

@index({ puuid: 1, championID: 1, queueType: 1 }, { unique: true })
class ChampStat {
  @prop()
  public shortName!: string;
  @prop()
  public name!: string;

  @prop()
  public puuid!: string;
  @prop()
  public championID!: number;
  @prop()
  public queueType!: number;
  @prop()
  public season!: number;

  @prop()
  public kill!: number;
  @prop()
  public death!: number;
  @prop()
  public assist!: number;

  @prop()
  public win!: number;
  @prop()
  public loose!: number;

  @prop()
  public totalCS!: number;
  @prop()
  public totalDuration!: number;

  @prop()
  public tripleKill!: number;
  @prop()
  public quadraKill!: number;
  @prop()
  public pentaKill!: number;

  public static makeDefault(
    this: ReturnModelType<typeof ChampStat>,
    name: string,
    puuid: string,
    championID: number,
    queueType: number,
    season: number
  ) {
    const ChampStatModel = getModelForClass(ChampStat);
    const champStat = new ChampStatModel();

    champStat.name = name;
    champStat.shortName = name.replace(/ /gi, '');

    champStat.puuid = puuid;
    champStat.championID = championID;
    champStat.queueType = queueType;
    champStat.season = season;

    champStat.kill = 0;
    champStat.death = 0;
    champStat.assist = 0;
    champStat.win = 0;
    champStat.loose = 0;
    champStat.totalCS = 0;
    champStat.totalDuration = 0;
    champStat.tripleKill = 0;
    champStat.quadraKill = 0;
    champStat.pentaKill = 0;

    return champStat;
  }

  public static async findByName(
    this: ReturnModelType<typeof ChampStat>,
    name: string
  ) {
    const shortName = name.replace(/ /gi, '');
    return this.find({ shortName }).exec();
  }
}

export default ChampStat;
