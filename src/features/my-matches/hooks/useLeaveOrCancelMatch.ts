import { useMutation, useQueryClient } from '@tanstack/react-query';

import { cancelMatch, leaveMatch } from '../api/myMatchesApi';
import { myMatchKeys } from './myMatchKeys';

interface LeaveOrCancelPayload {
  matchId: number;
  isCreator?: boolean;
}

export function useLeaveOrCancelMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ matchId, isCreator }: LeaveOrCancelPayload) => (isCreator ? cancelMatch(matchId) : leaveMatch(matchId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myMatchKeys.all });
    },
  });
}

