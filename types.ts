
export enum MatchStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  LIVE = 'LIVE',
  COMPLETED = 'COMPLETED'
}

export interface Player {
  id: string;
  username: string;
  rank: string;
  winRate: number;
  antiCheatScore: number;
}

export interface Match {
  id: string;
  title: string;
  gameMode: string;
  map: string;
  entryFee: number;
  totalPrizePool: number;
  players: Player[];
  maxPlayers: number;
  status: MatchStatus;
  startTime: string;
}

export interface UserWallet {
  credits: number;
}
