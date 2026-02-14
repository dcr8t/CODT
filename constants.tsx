
import React from 'react';
import { Match, MatchStatus } from './types';

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'm1',
    title: 'Warzone Weekend Warriors',
    gameMode: 'Battle Royale - Solos',
    map: 'Urzikstan',
    entryFee: 10,
    totalPrizePool: 100,
    players: Array(6).fill(null).map((_, i) => ({
      id: `p${i}`,
      username: `ShadowSlayer_${i}`,
      rank: 'Diamond',
      winRate: 15.5,
      antiCheatScore: 98
    })),
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    startTime: '2023-11-20T20:00:00Z'
  },
  {
    id: 'm2',
    title: 'Search & Destroy High Stakes',
    gameMode: 'S&D - 5v5',
    map: 'Terminal',
    entryFee: 25,
    totalPrizePool: 250,
    players: Array(10).fill(null).map((_, i) => ({
      id: `f${i}`,
      username: `GhostRider_${i}`,
      rank: 'Crimson',
      winRate: 22.1,
      antiCheatScore: 99
    })),
    maxPlayers: 10,
    status: MatchStatus.FULL,
    startTime: '2023-11-20T21:30:00Z'
  },
  {
    id: 'm3',
    title: 'Resurgence Blitz',
    gameMode: 'Resurgence Solos',
    map: 'Rebirth Island',
    entryFee: 5,
    totalPrizePool: 50,
    players: [],
    maxPlayers: 10,
    status: MatchStatus.OPEN,
    startTime: '2023-11-20T22:00:00Z'
  }
];

export const PLATFORM_FEE_PERCENT = 0.3;
export const WINNER_PRIZE_PERCENT = 0.7;
