import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getLocalMatches } from '../api/localMatchApi';
import type { LocalMatchSearchParams } from '../types/match';
import { localMatchKeys } from './localMatchKeys';

export function useLocalMatches(params: LocalMatchSearchParams | null) {
  return useQuery({
    queryKey: localMatchKeys.list(params),
    queryFn: () => getLocalMatches(params!),
    enabled: Boolean(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
