import { useQuery } from '@tanstack/react-query';

import { getMemberProfile } from '../api/myMatchesApi';
import { myMatchKeys } from './myMatchKeys';

export function useMemberProfile(memberId: number | null) {
  return useQuery({
    queryKey: memberId ? myMatchKeys.member(memberId) : myMatchKeys.member(0),
    queryFn: () => getMemberProfile(memberId ?? 0),
    enabled: Boolean(memberId),
  });
}
