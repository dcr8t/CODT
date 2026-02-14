
import { Match, MatchStatus } from './types';

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'cod_1',
    title: 'Warzone Urzikstan Killrace',
    gameType: 'COD_WARZONE',
    gameMode: 'Killrace Duo',
    map: 'Urzikstan',
    entryFee: 25,
    totalPrizePool: 250,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    score: { teamA: 0, teamB: 0 },
    startTime: new Date().toISOString()
  },
  {
    id: 'cod_2',
    title: 'MW3 Search & Destroy Pro',
    gameType: 'COD_MW3',
    gameMode: 'S&D 5v5',
    map: 'Favela',
    entryFee: 50,
    totalPrizePool: 500,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    score: { teamA: 0, teamB: 0 },
    startTime: new Date().toISOString()
  },
  {
    id: 'cs_1',
    title: 'Mirage Premier Stakes',
    gameType: 'CS2',
    gameMode: 'Competitive',
    map: 'de_mirage',
    entryFee: 20,
    totalPrizePool: 200,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    score: { teamA: 0, teamB: 0 },
    startTime: new Date().toISOString()
  }
];

export const WINNER_PRIZE_PERCENT = 0.7; // 70% to the winner
export const PLATFORM_FEE_PERCENT = 0.3; // 30% to the platform
