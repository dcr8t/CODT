import { Match, MatchStatus } from './types';

export const WINNER_PRIZE_PERCENT = 0.7; // 70% to the winner
export const PLATFORM_FEE_PERCENT = 0.3; // 30% to the platform

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'cod_w_1',
    title: 'Warzone: Urzikstan Duo Blitz',
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
    id: 'cod_m_1',
    title: 'MW3: S&D Competitive Pro',
    gameType: 'COD_MW3',
    gameMode: 'Search & Destroy 5v5',
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
    id: 'cod_w_2',
    title: 'Rebirth: Island Resurgence',
    gameType: 'COD_WARZONE',
    gameMode: 'Solo High-Stakes',
    map: 'Rebirth Island',
    entryFee: 100,
    totalPrizePool: 1000,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    score: { teamA: 0, teamB: 0 },
    startTime: new Date().toISOString()
  }
];