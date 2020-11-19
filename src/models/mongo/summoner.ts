import { index, prop, ReturnModelType } from '@typegoose/typegoose';

@index({ puuid: 1 }, { unique: true })
class Summoner {
  @prop()
  public puuid!: string;
  @prop()
  public name!: string;
  @prop()
  public shortName!: string;

  @prop()
  public soloTier!: string;
  @prop()
  public soloLp!: number;
  @prop()
  public soloWins!: number;
  @prop()
  public soloLosses!: number;

  @prop()
  public flexTier!: string;
  @prop()
  public flexLp!: number;
  @prop()
  public flexWins!: number;
  @prop()
  public flexLosses!: number;

  @prop()
  public profileIconID!: number;
  @prop()
  public summonerLevel!: number;

  @prop()
  public updateTime!: number;

  public static async findOneByName(
    this: ReturnModelType<typeof Summoner>,
    name: string
  ) {
    const shortName = name.replace(/ /gi, '');
    return this.findOne({ shortName }).exec();
  }

  public static async findOneByPUUID(
    this: ReturnModelType<typeof Summoner>,
    puuid: string
  ) {
    return this.findOne({ puuid }).exec();
  }
}

export default Summoner;
