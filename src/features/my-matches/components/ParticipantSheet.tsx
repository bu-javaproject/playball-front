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
      <section className="max-h-[82vh] w-full max-w-screen-sm overflow-y-auto rounded-t-[28px] bg-white pb-6 shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-black text-slate-950">참가자 목록</h2>
            <p className="text-xs font-bold text-slate-400">내 경기</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100">
            <X size={20} />
          </button>
        </header>

        {isLoading ? (
          <div className="p-6 text-sm font-bold text-slate-500">참가자 정보를 불러오는 중입니다.</div>
        ) : match ? (
          <div className="space-y-6 px-5 py-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="text-base font-black text-slate-950">{match.title}</h3>
              <p className="mt-1 text-sm font-bold text-slate-500">
                {formatMatchDateTime(match.matchDate)} · {match.currentPlayers}/{match.maxPlayers}명
              </p>
            </div>

            <ParticipantGrid title={`참가자 (${match.participants.length}명)`} participants={match.participants} onOpenProfile={onOpenProfile} />

            {match.waitingList.length > 0 ? (
              <ParticipantGrid title={`대기자 (${match.waitingList.length}명)`} participants={match.waitingList} onOpenProfile={onOpenProfile} muted />
            ) : null}
          </div>
        ) : (
          <div className="p-6 text-sm font-bold text-slate-500">참가자 정보를 찾을 수 없습니다.</div>
        )}
      </section>
    </div>
  );
}

interface ParticipantGridProps {
  title: string;
  participants: MatchParticipant[];
  muted?: boolean;
  onOpenProfile: (participant: MatchParticipant) => void;
}

function ParticipantGrid({ title, participants, muted = false, onOpenProfile }: ParticipantGridProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-black text-slate-700">{title}</h3>
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
                muted ? 'bg-slate-300' : 'bg-blue-500'
              }`}
            >
              {participant.profileImage ? (
                <img src={participant.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
              ) : (
                getInitial(participant.nickname)
              )}
            </span>
            <span className="w-full truncate text-center text-xs font-black text-slate-700">{participant.nickname}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
