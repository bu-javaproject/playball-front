import { useMutation, useQueryClient } from '@tanstack/react-query';

import { leaveMatch } from '../api/localMatchApi';
import { localMatchKeys } from './localMatchKeys';

export function useLeaveMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (matchId: number) => leaveMatch(matchId),
    onSuccess: (_result, matchId) => {
      queryClient.invalidateQueries({ queryKey: localMatchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: localMatchKeys.detail(matchId) });
      queryClient.invalidateQueries({ queryKey: ['my-matches'] });
    },
  });
}
