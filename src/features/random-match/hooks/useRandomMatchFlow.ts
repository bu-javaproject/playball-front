import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useAuth } from '@/app/providers/AuthContext';

import { acceptRandomMatch, rejectRandomMatch, requestRandomMatch } from '../api/randomMatchApi';
import type { RandomMatchedGame, RandomMatchRequest, RandomMatchStatus } from '../types/randomMatch';

const today = new Date().toISOString().slice(0, 10);

const initialRandomMatchForm: RandomMatchRequest = {
  latitude: 36.8416,
  longitude: 127.1851,
  radius: 5,
  address: '충청남도 천안시 동남구 안서동',
  date: today,
  sportType: 'SOCCER',
  preferredPosition: 'ST',
  gender: 'M',
  ageRange: 20,
  skillLevel: 3,
  maxFee: 999999,
};

export function useRandomMatchFlow() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<RandomMatchStatus>('FORM');
  const [matchedGame, setMatchedGame] = useState<RandomMatchedGame | null>(null);
  const [form, setForm] = useState<RandomMatchRequest>(initialRandomMatchForm);

  const updateForm = <K extends keyof RandomMatchRequest>(key: K, value: RandomMatchRequest[K]) => {
    setForm((previousForm) => ({ ...previousForm, [key]: value }));
  };

  const requestMatch = async () => {
    if (!isAuthenticated) {
      window.alert('로그인 후 랜덤 매칭을 시작할 수 있습니다.');
      return;
    }

    setStatus('SEARCHING');

    try {
      const result = await requestRandomMatch(form);
      setMatchedGame(result);
      setStatus('FOUND');
    } catch {
      setStatus('FAIL');
    }
  };

  const acceptMatch = async () => {
    if (!matchedGame) return;

    if (!isAuthenticated) {
      window.alert('로그인 후 경기 참가를 신청할 수 있습니다.');
      return;
    }

    try {
      await acceptRandomMatch(matchedGame.matchId);
      queryClient.invalidateQueries({ queryKey: ['my-matches'] });
      setStatus('SUCCESS');
    } catch {
      window.alert('참가 요청에 실패했습니다.');
    }
  };

  const rejectMatch = async () => {
    if (!matchedGame) return;

    try {
      await rejectRandomMatch();
      setStatus('FAIL');
    } catch {
      window.alert('매칭 거절 처리에 실패했습니다.');
    }
  };

  const resetToForm = () => {
    setStatus('FORM');
  };

  return {
    status,
    form,
    matchedGame,
    updateForm,
    requestMatch,
    acceptMatch,
    rejectMatch,
    resetToForm,
  };
}
