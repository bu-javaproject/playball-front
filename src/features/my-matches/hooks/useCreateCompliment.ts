import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMatchCompliments } from '../api/myMatchesApi';
import type { ComplimentBulkRequest } from '../types/myMatch';
import { myMatchKeys } from './myMatchKeys';

export function useCreateCompliment(matchId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ComplimentBulkRequest) => createMatchCompliments(matchId ?? 0, payload),
    onSuccess: () => {
      if (matchId) {
        queryClient.invalidateQueries({ queryKey: myMatchKeys.participants(matchId) });
      }
    },
  });
}
