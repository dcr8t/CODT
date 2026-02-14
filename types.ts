
export enum MatchStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  LIVE = 'LIVE',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED'
}

export interface LinkedAccount {
  provider: 'Activision' | 'Battle.net' | 'PlayStation' | 'Xbox';
  username: string;
  verified: boolean;
  linkedAt: string;
}

export interface Player {
  id: string;
  username: string;
  rank: string;
  winRate: number;
  antiCheatScore: number;
  linkedAccounts?: LinkedAccount[];
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
  winnerId?: string;
  externalMatchId?: string;
}

export interface Transaction {
  id: string;
  type: 'ENTRY' | 'WIN' | 'DEPOSIT';
  amount: number;
  description: string;
  timestamp: string;
}

export interface UserWallet {
  credits: number;
  transactions: Transaction[];
}
