
// Expanded MatchStatus with OPEN and FULL for lobby management
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

// Transaction interface for wallet history
export interface Transaction {
  id: string;
  type: 'DEPOSIT' | 'ENTRY' | 'WIN';
  amount: number;
  description: string;
  timestamp: string;
}

// LinkedAccount interface for OAuth-like identity management
export interface LinkedAccount {
  provider: 'Activision' | 'PlayStation' | 'Xbox' | 'Battle.net';
  username: string;
  verified: boolean;
  linkedAt: string;
}

export interface ServerStats {
  tickrate: number;
  uptime: string;
  players_online: number;
  current_map: string;
  rcon_connected: boolean;
}

export interface Player {
  id: string;
  username: string;
  rank: string; // e.g., Global Elite, FaceIT 10
  elo: number;
  trustFactor: number;
}

// Match interface updated with gameMode, maxPlayers, and scoring
export interface Match {
  id: string;
  title: string;
  gameMode?: string;
  map: 'de_mirage' | 'de_inferno' | 'de_nuke' | 'de_ancient' | 'de_anubis' | 'de_vertigo' | 'de_overpass';
  entryFee: number;
  totalPrizePool: number;
  players: any[];
  maxPlayers: number;
  status: MatchStatus;
  score: { ct: number; t: number };
  serverIp: string;
  startTime: string;
  winnerId?: string;
}

export interface RconLog {
  timestamp: string;
  command: string;
  response: string;
  type: 'SYSTEM' | 'USER' | 'SECURITY';
}

// UserWallet updated to use Typed transactions
export interface UserWallet {
  credits: number;
  transactions: Transaction[];
}
