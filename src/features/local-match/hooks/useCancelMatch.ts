import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelMatch } from '../api/localMatchApi';
import { localMatchKeys } from './localMatchKeys';

export function useCancelMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => cancelMatch(matchId),
    onSuccess: (_result, matchId) => {
      queryClient.invalidateQueries({ queryKey: localMatchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: localMatchKeys.detail(matchId) });
      queryClient.invalidateQueries({ queryKey: ['my-matches'] });
    },
  });
}
