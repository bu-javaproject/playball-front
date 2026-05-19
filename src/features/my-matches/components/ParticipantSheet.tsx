import { X } from 'lucide-react';

import type { MatchParticipant, MatchParticipantsResponse } from '../types/myMatch';
import { formatMatchDateTime, getInitial } from '../utils/myMatchFormat';

interface ParticipantSheetProps {
  match: MatchParticipantsResponse | undefined;
  isLoading: boolean;
  onClose: () => void;
  onOpenProfile: (participant: MatchParticipant) => void;
}

export function ParticipantSheet({ match, isLoading, onClose, onOpenProfile }: ParticipantSheetProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-950/35 px-3">
      <section className="max-h-[82vh] w-full max-w-screen-sm overflow-y-auto rounded-t-2xl bg-white pb-6 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-play-border bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-black text-play-ink">참가자 목록</h2>
            <p className="text-xs font-bold text-play-muted">함께 뛰는 멤버를 확인하세요</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-play-surface">
            <X size={20} />
          </button>
        </header>

        {isLoading ? (
          <div className="p-6 text-sm font-bold text-play-muted">참가자 정보를 불러오는 중입니다.</div>
        ) : match ? (
          <div className="space-y-6 px-5 py-5">
            <div className="rounded-xl border border-play-border bg-play-surface p-4">
              <h3 className="text-base font-black text-play-ink">{match.title}</h3>
              <p className="mt-1 text-sm font-bold text-play-muted">
                {formatMatchDateTime(match.matchDate)} · {match.currentPlayers}/{match.maxPlayers}명
              </p>
            </div>

            <ParticipantGrid title={`참가자 (${match.participants.length}명)`} participants={match.participants} onOpenProfile={onOpenProfile} />

            {match.waitingList.length > 0 ? (
              <ParticipantGrid title={`대기자 (${match.waitingList.length}명)`} participants={match.waitingList} onOpenProfile={onOpenProfile} muted />
            ) : null}
          </div>
        ) : (
          <div className="p-6 text-sm font-bold text-play-muted">참가자 정보를 찾을 수 없습니다.</div>
        )}
      </section>
    </div>
  );
}

function ParticipantGrid({
  title,
  participants,
  muted = false,
  onOpenProfile,
}: {
  title: string;
  participants: MatchParticipant[];
  muted?: boolean;
  onOpenProfile: (participant: MatchParticipant) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-play-ink">{title}</h3>
      <div className="grid grid-cols-4 gap-4">
        {participants.map((participant) => (
          <button
            key={participant.participantId}
            type="button"
            onClick={() => onOpenProfile(participant)}
            className="flex min-w-0 flex-col items-center gap-2"
          >
            <span
              className={`grid h-16 w-16 place-items-center rounded-full text-xl font-black text-white shadow-sm ${
                muted ? 'bg-slate-300' : 'bg-play-primary'
              }`}
            >
              {participant.profileImage ? (
                <img src={participant.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                getInitial(participant.nickname)
              )}
            </span>
            <span className="w-full truncate text-center text-xs font-black text-play-ink">{participant.nickname}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
