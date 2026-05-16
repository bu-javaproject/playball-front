import { useQuery } from '@tanstack/react-query';

import { getMatchParticipants } from '../api/myMatchesApi';
import { myMatchKeys } from './myMatchKeys';

export function useMatchParticipants(matchId: number | null) {
  return useQuery({
    queryKey: matchId ? myMatchKeys.participants(matchId) : myMatchKeys.participants(0),
    queryFn: () => getMatchParticipants(matchId ?? 0),
    enabled: Boolean(matchId),
  });
}
