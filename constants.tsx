
import { Match, MatchStatus } from './types';

// Updated initial matches with required fields like maxPlayers and startTime
export const INITIAL_MATCHES: Match[] = [
  {
    id: 'cs_1',
    title: 'Mirage Premier Grudge',
    gameMode: 'Competitive',
    map: 'de_mirage',
    entryFee: 15,
    totalPrizePool: 150,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    score: { ct: 0, t: 0 },
    serverIp: '192.168.1.100:27015',
    startTime: new Date().toISOString()
  },
  {
    id: 'cs_2',
    title: 'Inferno Night Cup',
    gameMode: 'Competitive',
    map: 'de_inferno',
    entryFee: 50,
    totalPrizePool: 500,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    score: { ct: 0, t: 0 },
    serverIp: '192.168.1.101:27015',
    startTime: new Date().toISOString()
  }
];

export const WINNER_PRIZE_PERCENT = 0.7;
export const PLATFORM_FEE_PERCENT = 0.3;
