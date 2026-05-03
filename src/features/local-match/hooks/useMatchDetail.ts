import { useQuery } from '@tanstack/react-query';

import { getMatchDetail } from '../api/localMatchApi';
import { localMatchKeys } from './localMatchKeys';

export function useMatchDetail(matchId: number | null) {
  return useQuery({
    queryKey: matchId ? localMatchKeys.detail(matchId) : localMatchKeys.detail(0),
    queryFn: () => getMatchDetail(matchId!),
    enabled: Boolean(matchId),
    staleTime: 30_000,
  });
}
