import { formatDateTime } from '@/shared/utils/date';
import { formatDistance } from '@/shared/utils/distance';
import type { MatchStatus, SkillLevel, SportType } from '../types/match';

export const sportLabel: Record<SportType, string> = {
  SOCCER: '축구',
  BASKETBALL: '농구',
  RUNNING: '달리기',
  BADMINTON: '배드민턴',
};

export const skillLevelLabel: Record<SkillLevel, string> = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
};

export const statusLabel: Record<MatchStatus, string> = {
  OPEN: '모집 중',
  FULL: '정원 마감',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  CANCELLED: '취소됨',
};

export function formatEntryFee(entryFee: number) {
  if (entryFee === 0) return '무료';
  return `${entryFee.toLocaleString('ko-KR')}원`;
}

export { formatDateTime, formatDistance };
