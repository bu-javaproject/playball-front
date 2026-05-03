import { useRef, useState, type PointerEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/utils/cn';

import type { LocalMatch } from '../types/match';
import {
  formatDateTime,
  formatDistance,
  formatEntryFee,
  formatMatchDate,
  formatMatchTime,
  skillLevelLabel,
  sportLabel,
  statusLabel,
} from '../utils/matchFormat';

export type MatchUserRelation = 'NONE' | 'CREATED' | 'JOINED';

interface MatchBottomSheetProps {
  match: LocalMatch | null;
  onClose: () => void;
  onJoin: (matchId: number) => void;
  isJoining?: boolean;
  userRelation?: MatchUserRelation;
}

type BottomSheetSnap = 'collapsed' | 'summary' | 'detail';

const snapOrder: BottomSheetSnap[] = ['collapsed', 'summary', 'detail'];

const snapClass: Record<BottomSheetSnap, string> = {
  collapsed: 'h-[86px]',
  summary: 'max-h-[48vh]',
  detail: 'h-[78vh]',
};

function getNextSnap(currentSnap: BottomSheetSnap) {
  const index = snapOrder.indexOf(currentSnap);
  return snapOrder[Math.min(index + 1, snapOrder.length - 1)];
}

function getPreviousSnap(currentSnap: BottomSheetSnap) {
  const index = snapOrder.indexOf(currentSnap);
  return snapOrder[Math.max(index - 1, 0)];
}

function getJoinButtonLabel(match: LocalMatch, userRelation: MatchUserRelation, isJoining: boolean) {
  if (isJoining) return '참가 신청 중';
  if (userRelation === 'CREATED') return '내가 만든 경기';
  if (userRelation === 'JOINED') return '참가 완료';
  if (match.status !== 'OPEN') return statusLabel[match.status];
  return '참가하기';
}

export default function MatchBottomSheet({
  match,
  onClose,
  onJoin,
  isJoining = false,
  userRelation = 'NONE',
}: MatchBottomSheetProps) {
  const [snap, setSnap] = useState<BottomSheetSnap>('summary');
  const dragStartYRef = useRef<number | null>(null);

  if (!match) {
    return null;
  }

  const canJoin = match.status === 'OPEN' && userRelation === 'NONE';

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    dragStartYRef.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLElement>) => {
    const startY = dragStartYRef.current;
    dragStartYRef.current = null;

    if (startY === null) {
      return;
    }

    const deltaY = event.clientY - startY;

    if (deltaY < -42) {
      setSnap((currentSnap) => getNextSnap(currentSnap));
      return;
    }

    if (deltaY > 42) {
      setSnap((currentSnap) => getPreviousSnap(currentSnap));
    }
  };

  const handleClose = () => {
    setSnap('summary');
    onClose();
  };

  return (
    <section
      className={cn(
        'absolute bottom-0 left-0 right-0 z-30 mx-auto flex w-full flex-col overflow-hidden rounded-t-[28px] bg-white px-5 pb-6 pt-3 shadow-2xl transition-[height,max-height] duration-200 ease-out md:left-6 md:right-6 md:w-auto md:max-w-5xl md:px-8',
        snapClass[snap],
      )}
      aria-label="선택한 경기 정보"
    >
      <header
        className="shrink-0 touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragStartYRef.current = null;
        }}
      >
        <button
          type="button"
          onClick={() => setSnap((currentSnap) => getNextSnap(currentSnap))}
          aria-label="하단 경기 정보 펼치기"
          className="mx-auto mb-3 flex h-7 w-16 items-center justify-center rounded-full"
        >
          <span className="h-1.5 w-12 rounded-full bg-slate-300" />
        </button>
      </header>

      {snap === 'collapsed' ? (
        <button type="button" onClick={() => setSnap('summary')} className="block w-full text-left">
          <p className="truncate text-lg font-black text-slate-950">{match.title}</p>
        </button>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                  {sportLabel[match.sportType]} · {statusLabel[match.status]}
                </span>
                <h2 className="mt-3 truncate text-2xl font-black text-slate-950">{match.title}</h2>
                <p className="mt-2 text-base font-black text-slate-500">
                  {match.creatorNickname ?? '주최자'} · {formatDistance(match.distance)}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="경기 정보 닫기"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-700"
              >
                ×
              </button>
            </div>

            <dl className="mt-7 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="font-black text-slate-500">시간</dt>
                <dd className="mt-3 font-black text-slate-950">{formatDateTime(match.matchDate)}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="font-black text-slate-500">모집 인원</dt>
                <dd className="mt-3 font-black text-slate-950">
                  {match.currentPlayers}/{match.maxPlayers}명
                </dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="font-black text-slate-500">실력</dt>
                <dd className="mt-3 font-black text-slate-950">{skillLevelLabel[match.skillLevel]}</dd>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <dt className="font-black text-slate-500">참가비</dt>
                <dd className="mt-3 font-black text-slate-950">{formatEntryFee(match.entryFee)}</dd>
              </div>
            </dl>

            {snap === 'detail' && (
              <div className="mt-6 text-sm">
                <dl className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <dt className="text-xs font-black text-slate-400">정확한 장소 주소</dt>
                    <dd className="mt-3 font-black text-slate-950">{match.locationName}</dd>
                    <dd className="mt-2 leading-6 text-slate-600">
                      {match.address || '지도에서 선택한 위치입니다.'}
                    </dd>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <dt className="text-xs font-black text-slate-400">날짜 / 시간</dt>
                    <dd className="mt-3 font-black text-slate-950">{formatMatchDate(match.matchDate)}</dd>
                    <dd className="mt-2 text-slate-600">{formatMatchTime(match.matchDate)}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <dt className="text-xs font-black text-slate-400">종목 / 실력</dt>
                    <dd className="mt-3 font-black text-slate-950">{sportLabel[match.sportType]}</dd>
                    <dd className="mt-2 text-slate-600">{skillLevelLabel[match.skillLevel]}</dd>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-4">
                    <dt className="text-xs font-black text-slate-400">인원 / 참가비</dt>
                    <dd className="mt-3 font-black text-slate-950">
                      {match.currentPlayers}/{match.maxPlayers}명
                    </dd>
                    <dd className="mt-2 text-slate-600">{formatEntryFee(match.entryFee)}</dd>
                  </div>
                </dl>

                <section className="mt-5 rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-xs font-black text-slate-400">요구사항 / 공지</h3>
                  <p className="mt-3 leading-7 text-slate-700">
                    {match.description || '등록된 요구사항이 없습니다.'}
                  </p>
                </section>

                <section className="mt-5 rounded-2xl border border-slate-100 p-4">
                  <h3 className="text-xs font-black text-slate-400">주최자 정보</h3>
                  <p className="mt-3 font-black text-slate-950">{match.creatorNickname ?? '주최자'}</p>
                </section>
              </div>
            )}

            {snap === 'summary' && (
              <button
                type="button"
                onClick={() => setSnap('detail')}
                className="mt-5 w-full rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-700"
              >
                위로 밀거나 눌러 상세 정보 보기
              </button>
            )}
          </div>

          <Button
            type="button"
            disabled={!canJoin || isJoining}
            onClick={() => onJoin(match.matchId)}
            className="mt-4 h-14 w-full shrink-0 rounded-2xl bg-play-primary text-base hover:bg-play-primary-dark"
          >
            {getJoinButtonLabel(match, userRelation, isJoining)}
          </Button>
        </div>
      )}
    </section>
  );
}
