export interface Match {
  gameId: number;

  queueId: number;
  gameCreation: number;
  gameDuration: number;

  teams: TeamStats[];
  participants: Participant[];
}

interface TeamStats {
  win: string;

  towerKills: number;
  dragonKills: number;
  baronKills: number;
}

interface Participant {
  accountId: string;
  summonerName: string;
  teamId: number;

  championId: number;
  champLevel: number;
  role: string;

  kills: number;
  deaths: number;
  assists: number;
  largestMultiKill: number;

  totalMinionsKilled: number;
  goldEarned: number;

  visionWardsBoughtInGame: number;
  wardsPlaced: number;
  wardsKilled: number;

  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;

  spell1Id: number;
  spell2Id: number;

  perk0: number;
  perk1: number;
  perk2: number;
  perk3: number;
  perk4: number;
  perk5: number;
  perkPrimaryStyle: number;
  perkSubStyle: number;
  statPerk0: number;
  statPerk1: number;
  statPerk2: number;

  totalDamageDealt: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
}
