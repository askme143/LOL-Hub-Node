export interface Summoner {
  accountId: string;
  profileIconId: number;
  revisionDate: number;
  name: string;
  id: string;
  puuid: string;
  summonerLevel: number;
}

export interface MatchList {
  startIndex: number;
  totalGames: number;
  endIndex: number;
  matches: MatchReference[];
}

interface MatchReference {
  gameId: number;
  role: string;
  season: number;
  platformId: string;
  champion: number;
  queue: number;
  lane: string;
  timestamp: number;
}

export interface Match {
  gameId: number;
  participantIdentities: ParticipantIdentity[];
  queueId: number;
  gameType: string;
  gameDuration: number;
  teams: TeamStats[];
  platformId: string;
  gameCreation: number;
  seasonId: number;
  gameVersion: string;
  mapId: number;
  gameMode: string;
  participants: Participant[];
}

interface ParticipantIdentity {
  participantId: number;
  player: Player;
}

interface Player {
  profileIcon: number;
  accountId: string;
  matchHistoryUri: string;
  currentAccountId: string;
  currentPlatformId: string;
  summonerName: string;
  summonerId: string;
  platformId: string;
}

interface TeamStats {
  towerKills: number;
  riftHeraldKills: number;
  firstBlood: boolean;
  inhibitorKills: number;
  bans: TeamBans[];
  firstBaron: boolean;
  firstDragon: boolean;
  dominionVictoryScore: number;
  dragonKills: number;
  baronKills: number;
  firstInhibitor: boolean;
  firstTower: boolean;
  vilemawKills: number;
  firstRiftHerald: boolean;
  teamId: number;
  win: string;
}

interface TeamBans {
  championId: number;
  pickTurn: number;
}

interface Participant {
  participantId: number;
  championId: number;
  runes: Rune[];
  stats: ParticipantStats;
  teamId: number;
  timeline: ParticipantTimeline;
  spell1Id: number;
  spell2Id: number;
  highestAchievedSeasonTier: string;
  masteries: Mastery[];
}

interface Rune {
  runeId: number;
  rank: number;
}

interface ParticipantStats {
  item0: number;
  item2: number;
  totalUnitsHealed: number;
  item1: number;
  largestMultiKill: number;
  goldEarned: number;
  firstInhibitorKill: boolean;
  physicalDamageTaken: number;
  nodeNeutralizeAssist: number;
  totalPlayerScore: number;
  champLevel: number;
  damageDealtToObjectives: number;
  totalDamageTaken: number;
  neutralMinionsKilled: number;
  deaths: number;
  tripleKills: number;
  magicDamageDealtToChampions: number;
  wardsKilled: number;
  pentaKills: number;
  damageSelfMitigated: number;
  largestCriticalStrike: number;
  nodeNeutralize: number;
  totalTimeCrowdControlDealt: number;
  firstTowerKill: boolean;
  magicDamageDealt: number;
  totalScoreRank: number;
  nodeCapture: number;
  wardsPlaced: number;
  totalDamageDealt: number;
  timeCCingOthers: number;
  magicalDamageTaken: number;
  largestKillingSpree: number;
  totalDamageDealtToChampions: number;
  physicalDamageDealtToChampions: number;
  neutralMinionsKilledTeamJungle: number;
  totalMinionsKilled: number;
  firstInhibitorAssist: boolean;
  visionWardsBoughtInGame: number;
  objectivePlayerScore: number;
  kills: number;
  firstTowerAssist: boolean;
  combatPlayerScore: number;
  inhibitorKills: number;
  turretKills: number;
  participantId: number;
  trueDamageTaken: number;
  firstBloodAssist: boolean;
  nodeCaptureAssist: number;
  assists: number;
  teamObjective: number;
  altarsNeutralized: number;
  goldSpent: number;
  damageDealtToTurrets: number;
  altarsCaptured: number;
  win: boolean;
  totalHeal: number;
  unrealKills: number;
  visionScore: number;
  physicalDamageDealt: number;
  firstBloodKill: boolean;
  longestTimeSpentLiving: number;
  killingSprees: number;
  sightWardsBoughtInGame: number;
  trueDamageDealtToChampions: number;
  neutralMinionsKilledEnemyJungle: number;
  doubleKills: number;
  trueDamageDealt: number;
  quadraKills: number;
  item4: number;
  item3: number;
  item6: number;
  item5: number;
  playerScore0: number;
  playerScore1: number;
  playerScore2: number;
  playerScore3: number;
  playerScore4: number;
  playerScore5: number;
  playerScore6: number;
  playerScore7: number;
  playerScore8: number;
  playerScore9: number;
  perk0: number;
  perk0Var1: number;
  perk0Var2: number;
  perk0Var3: number;
  perk1: number;
  perk1Var1: number;
  perk1Var2: number;
  perk1Var3: number;
  perk2: number;
  perk2Var1: number;
  perk2Var2: number;
  perk2Var3: number;
  perk3: number;
  perk3Var1: number;
  perk3Var2: number;
  perk3Var3: number;
  perk4: number;
  perk4Var1: number;
  perk4Var2: number;
  perk4Var3: number;
  perk5: number;
  perk5Var1: number;
  perk5Var2: number;
  perk5Var3: number;
  perkPrimaryStyle: number;
  perkSubStyle: number;
  statPerk0: number;
  statPerk1: number;
  statPerk2: number;
}

interface ParticipantTimeline {
  participantId: number;
  csDiffPerMinDeltas: Map<String, number>;
  damageTakenPerMinDeltas: Map<String, number>;
  role: string;
  damageTakenDiffPerMinDeltas: Map<String, number>;
  xpPerMinDeltas: Map<String, number>;
  xpDiffPerMinDeltas: Map<String, number>;
  lane: string;
  creepsPerMinDeltas: Map<String, number>;
  goldPerMinDeltas: Map<String, number>;
}

interface Mastery {
  rank: number;
  masteryId: number;
}

export interface LeagueEntry {
  leagueId: string;
  summonerId: string;
  summonerName: string;
  queueType: string;
  tier: string;
  rank: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
  veteran: boolean;
  freshBlood: boolean;
  inactive: boolean;
  miniSeries: MiniSeries;
}

interface MiniSeries {
  losses: number;
  progress: string;
  target: number;
  wins: number;
}
