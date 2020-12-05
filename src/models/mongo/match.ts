import { getModelForClass, prop } from '@typegoose/typegoose';

export class TeamStats {
  @prop()
  win!: string;

  @prop()
  towerKills!: number;
  @prop()
  dragonKills!: number;
  @prop()
  baronKills!: number;
}

export class Participant {
  @prop()
  puuid?: string;

  @prop()
  accountId!: string;
  @prop()
  summonerName!: string;
  @prop()
  teamId!: number;

  @prop()
  championId!: number;
  @prop()
  champLevel!: number;
  @prop()
  role!: string;

  @prop()
  kills!: number;
  @prop()
  deaths!: number;
  @prop()
  assists!: number;
  @prop()
  largestMultiKill!: number;

  @prop()
  totalMinionsKilled!: number;
  @prop()
  goldEarned!: number;

  @prop()
  visionWardsBoughtInGame!: number;
  @prop()
  wardsPlaced!: number;
  @prop()
  wardsKilled!: number;

  @prop()
  item0!: number;
  @prop()
  item1!: number;
  @prop()
  item2!: number;
  @prop()
  item3!: number;
  @prop()
  item4!: number;
  @prop()
  item5!: number;
  @prop()
  item6!: number;

  @prop()
  spell1Id!: number;
  @prop()
  spell2Id!: number;

  @prop()
  perk0!: number;
  @prop()
  perk1!: number;
  @prop()
  perk2!: number;
  @prop()
  perk3!: number;
  @prop()
  perk4!: number;
  @prop()
  perk5!: number;
  @prop()
  perkPrimaryStyle!: number;
  @prop()
  perkSubStyle!: number;
  @prop()
  statPerk0!: number;
  @prop()
  statPerk1!: number;
  @prop()
  statPerk2!: number;

  @prop()
  totalDamageDealt!: number;
  @prop()
  totalDamageDealtToChampions!: number;
  @prop()
  totalDamageTaken!: number;
}

export class Match {
  @prop({ unique: true })
  gameID!: number;

  @prop()
  queueID!: number;
  @prop()
  gameCreation!: number;
  @prop()
  gameDuration!: number;

  @prop({ _id: false, type: TeamStats })
  teams!: TeamStats[];
  @prop({ _id: false, type: Participant })
  participants!: Participant[];
}

export const TeamStatsModel = getModelForClass(TeamStats);
export const participantModel = getModelForClass(Participant);
export const MatchModel = getModelForClass(Match);
