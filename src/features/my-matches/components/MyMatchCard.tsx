import { FileText, LogOut, UsersRound } from 'lucide-react';

import type { MyMatchSummary } from '../types/myMatch';
import { formatMatchDateTime, sportIcon, sportLabel, statusLabel } from '../utils/myMatchFormat';

interface MyMatchCardProps {
  match: MyMatchSummary;
  isLeaving: boolean;
  onOpenParticipants: (matchId: number) => void;
  onOpenDetail: (matchId: number) => void;
  onLeaveOrCancel: (match: MyMatchSummary) => void;
}

export function MyMatchCard({ match, isLeaving, onOpenParticipants, onOpenDetail, onLeaveOrCancel }: MyMatchCardProps) {
  const actionLabel = match.isCreator ? '경기 취소' : '참가 취소';

  return (
    <article className="overflow-hidden rounded-2xl border border-play-border bg-white shadow-sm">
      <div className="relative flex min-h-36 items-center justify-center bg-play-primary px-4 py-8">
        <span className="rounded-full bg-white/15 px-4 py-2 text-xl font-black text-white">{sportIcon[match.sportType]}</span>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-play-primary">
          {statusLabel[match.status]}
        </span>
        {match.isCreator ? (
          <span className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-play-ink">
            주최
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-black text-play-primary">{sportLabel[match.sportType]}</p>
          <h2 className="mt-1 text-xl font-black text-play-ink">{match.title}</h2>
          <p className="mt-2 text-sm font-bold text-play-muted">
            {match.locationName} · {formatMatchDateTime(match.matchDate)} · {match.currentPlayers}/{match.maxPlayers}명
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenParticipants(match.matchId)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-play-primary text-sm font-black text-white shadow-sm"
          >
            <UsersRound size={18} />
            참가자
          </button>
          <button
            type="button"
            onClick={() => onOpenDetail(match.matchId)}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-play-surface text-sm font-black text-play-ink"
          >
            <FileText size={18} />
            상세
          </button>
        </div>

        <button
          type="button"
          disabled={isLeaving}
          onClick={() => onLeaveOrCancel(match)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 text-sm font-black text-red-500 disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300"
        >
          <LogOut size={17} />
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
