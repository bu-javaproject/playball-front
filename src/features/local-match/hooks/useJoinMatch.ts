import { useMutation, useQueryClient } from '@tanstack/react-query';

import { joinMatch } from '../api/localMatchApi';
import { localMatchKeys } from './localMatchKeys';

export function useJoinMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => joinMatch(matchId),
    onSuccess: (_result, matchId) => {
      queryClient.invalidateQueries({ queryKey: localMatchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: localMatchKeys.detail(matchId) });
    },
  });
}
