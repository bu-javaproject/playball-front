import type { LocalMatchSearchParams } from '../types/match';

export const localMatchKeys = {
  all: ['local-match'] as const,
  lists: () => [...localMatchKeys.all, 'list'] as const,
  list: (params: LocalMatchSearchParams | null) => [...localMatchKeys.lists(), params] as const,
  details: () => [...localMatchKeys.all, 'detail'] as const,
  detail: (matchId: number) => [...localMatchKeys.details(), matchId] as const,
};
