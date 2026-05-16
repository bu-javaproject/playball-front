import { useQuery } from '@tanstack/react-query';

import { getMatchDetail } from '../api/myMatchesApi';
import { myMatchKeys } from './myMatchKeys';

export function useMatchDetail(matchId: number | null) {
  return useQuery({
    queryKey: matchId ? myMatchKeys.detail(matchId) : myMatchKeys.detail(0),
    queryFn: () => getMatchDetail(matchId ?? 0),
    enabled: Boolean(matchId),
  });
}
