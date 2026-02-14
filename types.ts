
export enum MatchStatus {
  LOBBY = 'LOBBY',
  WARMUP = 'WARMUP',
  LIVE = 'LIVE',
  PAUSED = 'PAUSED',
  VERIFYING = 'VERIFYING',
  COMPLETED = 'COMPLETED',
  OPEN = 'OPEN',
  FULL = 'FULL'
}

export interface GsiState {
  connected: boolean;
  lastPacket: string;
  round: number;
  phase: 'warmup' | 'live' | 'intermission' | 'gameover';
}

export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'ENTRY' | 'WIN';
  amount: number;
  description: string;
  timestamp: string;
}

export interface LinkedAccount {
  provider: 'Steam' | 'Discord' | 'FaceIT';
  username: string;
  id64: string;
  verified: boolean;
  linkedAt: string;
}

export interface Player {
  id: string;
  username: string;
  rank: string;
  elo: number;
  trustFactor: number;
  steamId?: string;
}

export interface Match {
  id: string;
  title: string;
  gameMode?: string;
  map: 'de_mirage' | 'de_inferno' | 'de_nuke' | 'de_ancient' | 'de_anubis' | 'de_vertigo' | 'de_overpass';
  entryFee: number;
  totalPrizePool: number;
  players: Player[];
  maxPlayers: number;
  status: MatchStatus;
  score: { ct: number; t: number };
  serverIp: string;
  rconPassword?: string;
  startTime: string;
  winnerId?: string;
}

export interface UserWallet {
  credits: number;
  transactions: Transaction[];
}

// Added missing RconLog interface to resolve the import error in LiveMatch.tsx
export interface RconLog {
  timestamp: string;
  command: string;
  response: string;
  type: 'SYSTEM' | 'USER';
}
