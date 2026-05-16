import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMatch } from '../api/localMatchApi';
import { localMatchKeys } from './localMatchKeys';

export function useCreateMatch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMatch,
    onSuccess: (createdMatch) => {
      queryClient.invalidateQueries({ queryKey: localMatchKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['my-matches'] });
      queryClient.setQueryData(localMatchKeys.detail(createdMatch.matchId), createdMatch);
    },
  });
}
