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
  const actionLabel = match.isCreator ? '경기 취소' : '불참하기';

  return (
    <article className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900">
        <span className="text-7xl drop-shadow-sm">{sportIcon[match.sportType]}</span>
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-blue-700">
          {statusLabel[match.status]}
        </span>
        {match.isCreator ? (
          <span className="absolute right-4 top-4 rounded-full bg-amber-300 px-3 py-1 text-xs font-black text-slate-950">
            주최
          </span>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-black text-blue-600">{sportLabel[match.sportType]}</p>
          <h2 className="mt-1 text-xl font-black text-slate-950">{match.title}</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {match.locationName} · {formatMatchDateTime(match.matchDate)} · {match.currentPlayers}/{match.maxPlayers}명
          </p>
        </div>

        <div className="flex justify-end">
          <div className="flex -space-x-2">
            {(match.playerPreview ?? []).slice(0, 4).map((player, index) => (
              <div
                key={`${player.nickname}-${index}`}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-blue-100 text-xs font-black text-blue-700"
              >
                {player.nickname.slice(0, 1)}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenParticipants(match.matchId)}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-black text-white shadow-sm"
          >
            <UsersRound size={18} />
            플레이어 목록
          </button>
          <button
            type="button"
            onClick={() => onOpenDetail(match.matchId)}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 text-sm font-black text-slate-700"
          >
            <FileText size={18} />
            세부내역
          </button>
        </div>

        <button
          type="button"
          disabled={isLeaving}
          onClick={() => onLeaveOrCancel(match)}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 text-sm font-black text-red-500 disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300"
        >
          <LogOut size={17} />
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
