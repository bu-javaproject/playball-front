import { useQuery } from '@tanstack/react-query';

import { getMyMatchHistory, getMyMatches, type MyMatchHistoryParams, type MyMatchesParams } from '../api/myMatchesApi';
import { myMatchKeys } from './myMatchKeys';

export function useMyMatches(params: MyMatchesParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: myMatchKeys.list(params),
    queryFn: () => getMyMatches(params),
  });
}

export function useMyMatchHistory(params: MyMatchHistoryParams = { page: 0, size: 20 }) {
  return useQuery({
    queryKey: myMatchKeys.history(params),
    queryFn: () => getMyMatchHistory(params),
  });
}
