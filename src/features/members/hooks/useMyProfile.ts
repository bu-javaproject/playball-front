import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getMyProfile, updateMyProfile } from '../api/memberApi';
import type { MyProfile } from '../types/member';

export const memberKeys = {
  all: ['members'] as const,
  me: () => [...memberKeys.all, 'me'] as const,
};

export function useMyProfile(enabled: boolean) {
  return useQuery({
    queryKey: memberKeys.me(),
    queryFn: getMyProfile,
    enabled,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: (profile: MyProfile) => {
      queryClient.setQueryData(memberKeys.me(), profile);
    },
  });
}
