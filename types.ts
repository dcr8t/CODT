export enum MatchStatus {
  OPEN = 'OPEN',
  FULL = 'FULL',
  READY_CHECK = 'READY_CHECK',
  LIVE = 'LIVE',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED'
}

export type GameType = 'COD_WARZONE' | 'COD_MW3' | 'CS2';

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'ENTRY' | 'WIN' | 'WITHDRAW';
  amount: number;
  description: string;
  timestamp: string;
  provider?: string;
}

export interface Player {
  id: string;
  username: string;
  rank: string;
  elo: number;
  isReady: boolean;
  trustFactor: number;
}

export interface LinkedAccount {
  provider: 'Activision' | 'Steam' | 'FaceIT' | 'Discord' | 'Paystack';
  username: string;
  id64?: string;
  verified: boolean;
  linkedAt: string;
}

export interface Match {
  id: string;
  title: string;
  gameType: GameType;
  gameMode: string;
  map: string;
  entryFee: number;
  totalPrizePool: number;
  players: Player[];
  maxPlayers: number;
  status: MatchStatus;
  score: { teamA: number; teamB: number };
  startTime: string;
  winnerId?: string;
  verificationReport?: string;
}

export interface UserWallet {
  credits: number;
  transactions: Transaction[];
  escrowLinked: boolean;
  escrowProvider?: 'Paystack' | 'Stripe' | 'Crypto';
}

export interface TelemetryLog {
  timestamp: string;
  event: string;
  data: string;
  type: 'SYSTEM' | 'GAME_EVENT';
}