import type { MyMatchHistoryParams, MyMatchesParams } from '../api/myMatchesApi';

export const myMatchKeys = {
  all: ['my-matches'] as const,
  lists: () => [...myMatchKeys.all, 'list'] as const,
  list: (params: MyMatchesParams) => [...myMatchKeys.lists(), params] as const,
  history: (params: MyMatchHistoryParams) => [...myMatchKeys.all, 'history', params] as const,
  detail: (matchId: number) => [...myMatchKeys.all, 'detail', matchId] as const,
  participants: (matchId: number) => [...myMatchKeys.all, 'participants', matchId] as const,
  member: (memberId: number) => [...myMatchKeys.all, 'member', memberId] as const,
};
