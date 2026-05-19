import type { ComplimentTag, MatchStatus, SportType } from '../types/myMatch';

export const sportLabel: Record<SportType, string> = {
  SOCCER: '축구',
  BASKETBALL: '농구',
  RUNNING: '러닝',
  BADMINTON: '배드민턴',
};

export const sportIcon: Record<SportType, string> = {
  SOCCER: '축구',
  BASKETBALL: '농구',
  RUNNING: '러닝',
  BADMINTON: '배드민턴',
};

export const statusLabel: Record<MatchStatus, string> = {
  OPEN: '모집 중',
  FULL: '마감',
  IN_PROGRESS: '진행 중',
  COMPLETED: '완료',
  CANCELLED: '취소',
  CLOSED: '종료',
};

export const complimentTagLabel: Record<ComplimentTag, string> = {
  MANNERS: '매너가 좋아요',
  SKILL: '실력이 좋아요',
  PUNCTUAL: '시간 약속을 잘 지켜요',
  PASSIONATE: '열정적이에요',
  MOOD_MAKER: '분위기를 살려요',
};

export const skillLabel = {
  BEGINNER: '초급',
  INTERMEDIATE: '중급',
  ADVANCED: '고급',
} as const;

export function formatMatchDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatShortDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

export function formatDateOnly(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

export function formatTimeOnly(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRating(rating?: number) {
  const score = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  return `${'★'.repeat(score)}${'☆'.repeat(5 - score)}`;
}

export function getInitial(name: string) {
  return name.trim().slice(0, 1) || 'P';
}

export function isFinishedStatus(status: MatchStatus) {
  return status === 'COMPLETED' || status === 'CLOSED';
}
