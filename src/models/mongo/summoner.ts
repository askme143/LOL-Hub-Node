import { prop, ReturnModelType } from '@typegoose/typegoose';
import { Service } from 'typedi';

@Service()
class Summoner {
  @prop()
  public ID!: string;

  @prop()
  public accountID!: string;

  @prop()
  public puuid!: string;

  @prop()
  public name!: string;

  @prop()
  public shortName!: string;

  @prop()
  public profileIconID!: number;

  @prop()
  public revisionDate!: number;

  @prop()
  public summonerLevel!: number;

  public static async findOneByName(
    this: ReturnModelType<typeof Summoner>,
    name: string
  ) {
    const shortName = name.replace(/ /gi, '');
    return this.findOne({ shortName }).exec();
  }
}

export default Summoner;
