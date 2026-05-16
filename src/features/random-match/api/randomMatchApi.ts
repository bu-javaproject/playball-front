import { apiClient, unwrapApiResponse } from '@/shared/api/client';

import type { RandomMatchAcceptResult, RandomMatchRequest, RandomMatchResponse } from '../types/randomMatch';

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
  return unwrapApiResponse<RandomMatchResponse>(apiClient.post('/api/matching/random', payload));
}

export function acceptRandomMatch(matchId: number) {
  return unwrapApiResponse<RandomMatchAcceptResult>(apiClient.post('/api/matching/random/accept', { matchId }));
}

export function rejectRandomMatch(matchId: number) {
  return unwrapApiResponse<null>(apiClient.post('/api/matching/random/reject', { matchId }));
}
