import type { LocalMatch } from '../types/match';
import { formatMatchTime } from '../utils/matchFormat';

interface MatchJoinCompleteOverlayProps {
  open: boolean;
  match: LocalMatch | null;
  onViewDetail: () => void;
  onHome: () => void;
}

export default function MatchJoinCompleteOverlay({
  open,
  match,
  onViewDetail,
  onHome,
}: MatchJoinCompleteOverlayProps) {
  if (!open || !match) {
    return null;
  }

  return (
    <section className="fixed inset-0 z-50 bg-white" aria-label="참가 완료">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-9 py-8">

        <div className="flex flex-1 flex-col items-center pt-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-green-500 text-2xl font-black text-green-500">
            ✓
          </div>

          <h2 className="mt-16 text-2xl font-black text-slate-950">참가 신청 완료!</h2>
          <p className="mt-5 max-w-xs text-sm font-bold leading-7 text-slate-300">
            {match.title} {formatMatchTime(match.matchDate)} 경기에 참가 신청되었어요
          </p>

          <button
            type="button"
            onClick={onViewDetail}
            className="mt-14 h-14 w-full rounded-2xl bg-green-500 text-base font-black text-white shadow-sm"
          >
            경기 상세 보기
          </button>

          <button type="button" onClick={onHome} className="mt-7 text-sm font-black text-slate-500">
            홈으로
          </button>
        </div>
      </div>
    </section>
  );
}
