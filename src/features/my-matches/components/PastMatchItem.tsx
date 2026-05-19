import { FileText, UsersRound } from 'lucide-react';

import type { MatchHistoryItem } from '../types/myMatch';
import { formatShortDate, sportIcon } from '../utils/myMatchFormat';

interface PastMatchItemProps {
  match: MatchHistoryItem;
  onOpenParticipants: (matchId: number) => void;
  onOpenDetail: (matchId: number) => void;
}

export function PastMatchItem({ match, onOpenParticipants, onOpenDetail }: PastMatchItemProps) {
  return (
    <article className="rounded-2xl border border-play-border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-play-surface text-sm font-black text-play-primary">
          {sportIcon[match.sportType]}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-black text-play-ink">{match.title}</h3>
          <p className="mt-1 text-sm font-bold text-play-muted">{formatShortDate(match.matchDate)}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onOpenParticipants(match.matchId)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-play-primary text-sm font-black text-white"
        >
          <UsersRound size={17} />
          참가자
        </button>
        <button
          type="button"
          onClick={() => onOpenDetail(match.matchId)}
          className="flex h-11 items-center justify-center gap-2 rounded-xl bg-play-surface text-sm font-black text-play-ink"
        >
          <FileText size={17} />
          상세
        </button>
      </div>
    </article>
  );
}