import {
  index,
  prop,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose';

@index({ puuid: 1 }, { unique: true })
export class Summoner {
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
}

export const SummonerModel = getModelForClass(Summoner);
export type SummonerDoc = DocumentType<Summoner>;
