import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import type { RandomMatchAcceptResult, RandomMatchedGame, RandomMatchRequest } from '../types/randomMatch';

export type {
  Gender,
  RandomMatchAcceptResult,
  RandomMatchedGame,
  RandomMatchRequest,
  RandomMatchResponse,
  RandomMatchStatus,
  SportType,
} from '../types/randomMatch';

export function requestRandomMatch(payload: RandomMatchRequest) {
  return unwrapApiResponse<RandomMatchedGame>(apiClient.post('/api/matches/random', payload));
}

export function acceptRandomMatch(matchId: number) {
  return unwrapApiResponse<RandomMatchAcceptResult>(apiClient.post(`/api/matches/${matchId}/join`));
}

export async function rejectRandomMatch() {
  return null;
}
