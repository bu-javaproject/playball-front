import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import type { RandomMatchAcceptResult, RandomMatchedGame, RandomMatchRequest, RandomSkillLevel } from '../types/randomMatch';

export type {
  Gender,
  RandomMatchAcceptResult,
  RandomMatchedGame,
  RandomMatchRequest,
  RandomMatchResponse,
  RandomMatchStatus,
  SportType,
} from '../types/randomMatch';

type BackendRandomMatchRequest = {
  latitude: number;
  longitude: number;
  radius: number;
  sportType: string;
  date?: string;
  maxFee?: number;
  skillLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  gender?: 'M' | 'F';
  ageRange?: number;
};

type BackendRandomMatch = {
  matchId: number;
  title: string;
  sportType: RandomMatchedGame['sportType'];
  matchDate: string;
  locationName: string;
  entryFee?: number;
  currentPlayers: number;
  maxPlayers: number;
  distance: number;
};

type BackendJoinResult = {
  matchId: number;
  currentPlayers: number;
  maxPlayers: number;
  status: string;
};

function toSkillLevel(skillLevel: RandomSkillLevel): BackendRandomMatchRequest['skillLevel'] {
  if (skillLevel <= 2) return 'BEGINNER';
  if (skillLevel === 3) return 'INTERMEDIATE';
  return 'ADVANCED';
}

function toBackendRandomMatchRequest(payload: RandomMatchRequest): BackendRandomMatchRequest {
  return {
    latitude: payload.latitude,
    longitude: payload.longitude,
    radius: payload.radius ?? 5,
    sportType: payload.sportType,
    date: payload.date || undefined,
    maxFee: payload.maxFee === 999999 ? undefined : payload.maxFee,
    skillLevel: toSkillLevel(payload.skillLevel),
    gender: payload.gender,
    ageRange: payload.ageRange,
  };
}

function toRandomMatchedGame(match: BackendRandomMatch): RandomMatchedGame {
  return {
    matchId: match.matchId,
    title: match.title,
    sportType: match.sportType,
    matchDate: match.matchDate,
    locationName: match.locationName,
    latitude: 0,
    longitude: 0,
    entryFee: match.entryFee,
    maxPlayers: match.maxPlayers,
    currentPlayers: match.currentPlayers,
    distance: match.distance,
    creatorNickname: '주최자',
  };
}

export async function requestRandomMatch(payload: RandomMatchRequest): Promise<RandomMatchedGame> {
  const match = await unwrapApiResponse<BackendRandomMatch>(
    apiClient.post('/api/matches/random', toBackendRandomMatchRequest(payload)),
  );

  return toRandomMatchedGame(match);
}

export async function acceptRandomMatch(matchId: number): Promise<RandomMatchAcceptResult> {
  const result = await unwrapApiResponse<BackendJoinResult>(apiClient.post(`/api/matches/${matchId}/join`));

  return {
    matchId: result.matchId ?? matchId,
    currentPlayers: result.currentPlayers,
    maxPlayers: result.maxPlayers,
    status: 'APPROVED',
  };
}

export function rejectRandomMatch(): Promise<null> {
  return Promise.resolve(null);
}
