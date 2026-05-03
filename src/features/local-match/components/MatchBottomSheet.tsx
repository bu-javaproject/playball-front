import { useRef, useState, type PointerEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/utils/cn';

import type { LocalMatch } from '../types/match';
import {
  formatDateTime,
  formatDistance,
  formatEntryFee,
  skillLevelLabel,
  sportLabel,
  statusLabel,
} from '../utils/matchFormat';

interface MatchBottomSheetProps {
  match: LocalMatch | null;
  onClose: () => void;
  onJoin: (matchId: number) => void;
  isJoining?: boolean;
}

type BottomSheetSnap = 'collapsed' | 'summary' | 'detail';

const snapOrder: BottomSheetSnap[] = ['collapsed', 'summary', 'detail'];

const snapClass: Record<BottomSheetSnap, string> = {
  collapsed: 'h-[92px]',
  summary: 'max-h-[48vh]',
  detail: 'h-[82vh]',
};

function getNextSnap(currentSnap: BottomSheetSnap) {
  const index = snapOrder.indexOf(currentSnap);
  return snapOrder[Math.min(index + 1, snapOrder.length - 1)];
}

function getPreviousSnap(currentSnap: BottomSheetSnap) {
  const index = snapOrder.indexOf(currentSnap);
  return snapOrder[Math.max(index - 1, 0)];
}

export default function MatchBottomSheet({ match, onClose, onJoin, isJoining = false }: MatchBottomSheetProps) {
  const [snap, setSnap] = useState<BottomSheetSnap>('summary');
  const dragStartYRef = useRef<number | null>(null);
  const canJoin = match?.status === 'OPEN';

  if (!match) {
    return null;
  }

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

  const openSummary = () => {
    setSnap('summary');
  };

  const openDetail = () => {
    setSnap('detail');
  };

  return (
    <section
      className={cn(
        'absolute bottom-0 left-0 right-0 z-30 overflow-hidden rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-2xl transition-[height,max-height] duration-200 ease-out',
        snapClass[snap],
      )}
      aria-label="선택한 경기 정보"
    >
      <header
        className="touch-none select-none"
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
          <span className="h-1.5 w-12 rounded-full bg-gray-300" />
        </button>
      </header>

      {snap === 'collapsed' ? (
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={openSummary} className="min-w-0 flex-1 text-left">
            <p className="truncate text-sm font-black text-gray-950">{match.title}</p>
            <p className="mt-1 text-xs font-bold text-gray-500">위로 밀어 기본 정보를 확인하세요</p>
          </button>
          <button
            type="button"
            onClick={openSummary}
            className="h-10 rounded-full bg-play-primary px-4 text-sm font-black text-white"
          >
            열기
          </button>
        </div>
      ) : (
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                {sportLabel[match.sportType]} · {statusLabel[match.status]}
              </span>
              <h2 className="mt-3 truncate text-xl font-black text-gray-950">{match.title}</h2>
              <p className="mt-1 text-sm font-bold text-gray-600">
                {match.creatorNickname ?? '주최자'} · {formatDistance(match.distance)}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              aria-label="경기 상세 닫기"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xl text-gray-700"
            >
              ×
            </button>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-gray-50 p-3">
              <dt className="font-bold text-gray-500">시간</dt>
              <dd className="mt-1 font-black text-gray-900">{formatDateTime(match.matchDate)}</dd>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <dt className="font-bold text-gray-500">모집 인원</dt>
              <dd className="mt-1 font-black text-gray-900">
                {match.currentPlayers}/{match.maxPlayers}명
              </dd>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <dt className="font-bold text-gray-500">실력</dt>
              <dd className="mt-1 font-black text-gray-900">{skillLevelLabel[match.skillLevel]}</dd>
            </div>
            <div className="rounded-xl bg-gray-50 p-3">
              <dt className="font-bold text-gray-500">참가비</dt>
              <dd className="mt-1 font-black text-gray-900">{formatEntryFee(match.entryFee)}</dd>
            </div>
          </dl>

          {snap === 'summary' ? (
            <button
              type="button"
              onClick={openDetail}
              className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-black text-gray-700"
            >
              상세 정보 보기
            </button>
          ) : (
            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1 text-sm">
              <section className="space-y-2">
                <h3 className="font-black text-gray-950">장소</h3>
                <p className="font-bold text-gray-900">{match.locationName}</p>
                {match.address && <p className="leading-6 text-gray-600">{match.address}</p>}
              </section>

              <section className="mt-5 space-y-2">
                <h3 className="font-black text-gray-950">공지</h3>
                <p className="leading-6 text-gray-600">{match.description || '등록된 공지 메시지가 없습니다.'}</p>
              </section>

              <section className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-xs font-bold text-gray-500">평점</p>
                  <p className="mt-1 font-black text-gray-900">{match.rating ?? 0}</p>
                </div>
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-xs font-bold text-gray-500">좌표</p>
                  <p className="mt-1 break-all text-xs font-black text-gray-900">
                    {match.latitude.toFixed(4)}, {match.longitude.toFixed(4)}
                  </p>
                </div>
              </section>
            </div>
          )}

          <Button
            type="button"
            disabled={!canJoin || isJoining}
            onClick={() => onJoin(match.matchId)}
            className="mt-5 w-full shrink-0 rounded-2xl py-4"
          >
            {isJoining ? '참가 신청 중' : canJoin ? '참가하기' : statusLabel[match.status]}
          </Button>
        </div>
      )}
    </section>
  );
}
