import { Button } from '@/shared/ui/Button';

import type { LocalMatch } from '../types/match';
import {
  formatEntryFee,
  formatMatchDate,
  formatMatchTime,
  skillLevelLabel,
  sportLabel,
} from '../utils/matchFormat';

interface MatchDetailOverlayProps {
  open: boolean;
  match: LocalMatch | null;
  onClose: () => void;
  onJoin: (matchId: number) => void;
  isJoining?: boolean;
}

export default function MatchDetailOverlay({
  open,
  match,
  onClose,
  onJoin,
  isJoining = false,
}: MatchDetailOverlayProps) {
  if (!open || !match) {
    return null;
  }

  const canJoin = match.status === 'OPEN';

  return (
    <section className="fixed inset-0 z-40 overflow-y-auto bg-white" aria-label="경기 상세">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white">
        <header className="flex h-16 items-center justify-between px-5">
          <button
            type="button"
            onClick={onClose}
            aria-label="경기 상세 닫기"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl text-slate-500"
          >
            ‹
          </button>
          <h1 className="text-base font-black text-slate-950">경기 상세</h1>
          <button type="button" className="text-sm font-bold text-sky-500">
            공유
          </button>
        </header>

        <div className="mx-4 h-52 rounded-none bg-gradient-to-br from-sky-400 to-blue-700">
          <div className="flex h-full flex-col items-center justify-center gap-5 text-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-900 bg-white text-sm font-black text-slate-900">
              PLAY
            </div>
            <span className="rounded-full bg-sky-300 px-4 py-1 text-xs font-black text-white">
              {sportLabel[match.sportType]}
            </span>
          </div>
        </div>

        <main className="flex flex-1 flex-col px-6 pb-8 pt-6">
          <section>
            <h2 className="text-xl font-black leading-7 text-slate-950">{match.title}</h2>
            <p className="mt-2 text-sm font-bold text-slate-400">
              {match.locationName} · {match.distance ? `${match.distance}km` : '거리 계산 중'}
            </p>
          </section>

          <dl className="mt-8 grid grid-cols-2 gap-x-10 gap-y-8">
            <div>
              <dt className="text-xs font-bold text-slate-300">날짜</dt>
              <dd className="mt-2 text-base font-black text-slate-950">{formatMatchDate(match.matchDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-300">시간</dt>
              <dd className="mt-2 text-base font-black text-slate-950">{formatMatchTime(match.matchDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-300">실력</dt>
              <dd className="mt-2 text-base font-black text-slate-950">{skillLevelLabel[match.skillLevel]}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-300">참가비</dt>
              <dd className="mt-2 text-base font-black text-slate-950">{formatEntryFee(match.entryFee)}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-300">인원</dt>
              <dd className="mt-2 text-base font-black text-slate-950">
                {match.currentPlayers}/{match.maxPlayers}명
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold text-slate-300">주최자</dt>
              <dd className="mt-2 text-base font-black text-slate-950">{match.creatorNickname ?? '주최자'}</dd>
            </div>
          </dl>

          <section className="mt-8 space-y-3">
            <h3 className="text-sm font-black text-slate-950">정확한 장소</h3>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-slate-900">{match.locationName}</p>
              <p className="mt-2 leading-6 text-slate-600">{match.address || '상세 주소가 아직 등록되지 않았습니다.'}</p>
            </div>
          </section>

          <section className="mt-6 space-y-3">
            <h3 className="text-sm font-black text-slate-950">요구사항</h3>
            <div className="rounded-2xl bg-slate-50 p-4 leading-6 text-slate-600">
              {match.description || '등록된 요구사항이 없습니다.'}
            </div>
          </section>

          <div className="mt-auto pt-10">
            <Button
              type="button"
              disabled={!canJoin || isJoining}
              onClick={() => onJoin(match.matchId)}
              className="h-14 w-full rounded-2xl bg-sky-500 text-base hover:bg-sky-600"
            >
              {isJoining ? '참가 신청 중' : canJoin ? '참가 신청하기' : '참가할 수 없습니다'}
            </Button>
          </div>
        </main>
      </div>
    </section>
  );
}
