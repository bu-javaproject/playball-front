import { X } from 'lucide-react';

import type { MatchParticipant, MatchParticipantsResponse } from '../types/myMatch';
import { formatMatchDateTime, getInitial } from '../utils/myMatchFormat';

interface ParticipantSheetProps {
  match: MatchParticipantsResponse | undefined;
  isLoading: boolean;
  praisedMemberIds?: Set<number>;
  onClose: () => void;
  onOpenProfile: (participant: MatchParticipant) => void;
}

export function ParticipantSheet({ match, isLoading, praisedMemberIds = new Set(), onClose, onOpenProfile }: ParticipantSheetProps) {
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/35 px-4 py-6">
      <section className="max-h-[86vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-play-border bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-play-ink">참가자 목록</h2>
            <p className="mt-1 text-sm font-bold text-play-muted">내 경기</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full bg-play-surface text-play-ink">
            <X size={24} />
          </button>
        </header>

        <div className="max-h-[calc(86vh-89px)] overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="text-sm font-bold text-play-muted">참가자 정보를 불러오는 중입니다.</div>
          ) : match ? (
            <div className="space-y-7">
              <div className="rounded-2xl border border-play-border bg-play-surface p-5">
                <h3 className="text-lg font-black text-play-ink">{match.title}</h3>
                <p className="mt-2 text-sm font-bold text-play-muted">
                  {formatMatchDateTime(match.matchDate)} · {match.currentPlayers}/{match.maxPlayers}명
                </p>
              </div>

              <ParticipantGrid
                title={`참가자 (${match.participants.length}명)`}
                participants={match.participants}
                praisedMemberIds={praisedMemberIds}
                onOpenProfile={onOpenProfile}
              />

              {match.waitingList.length > 0 ? (
                <ParticipantGrid
                  title={`대기자 (${match.waitingList.length}명)`}
                  participants={match.waitingList}
                  praisedMemberIds={praisedMemberIds}
                  onOpenProfile={onOpenProfile}
                  muted
                />
              ) : null}
            </div>
          ) : (
            <div className="text-sm font-bold text-play-muted">참가자 정보를 찾을 수 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
}

interface ParticipantGridProps {
  title: string;
  participants: MatchParticipant[];
  praisedMemberIds: Set<number>;
  muted?: boolean;
  onOpenProfile: (participant: MatchParticipant) => void;
}

function ParticipantGrid({ title, participants, praisedMemberIds, muted = false, onOpenProfile }: ParticipantGridProps) {
  return (
    <div>
      <h3 className="mb-4 text-base font-black text-play-ink">{title}</h3>
      <div className="grid grid-cols-3 gap-5 sm:grid-cols-4">
        {participants.map((participant) => {
          const isPraised = praisedMemberIds.has(participant.memberId);

          return (
            <button
              key={participant.participantId}
              type="button"
              onClick={() => onOpenProfile(participant)}
              className="flex min-w-0 flex-col items-center gap-2 rounded-2xl p-2 active:bg-play-surface"
            >
              <span
                className={`grid h-20 w-20 place-items-center rounded-full text-2xl font-black text-white shadow-sm ${
                  muted ? 'bg-slate-300' : 'bg-play-primary'
                }`}
              >
                {participant.profileImage ? (
                  <img src={participant.profileImage} alt="" className="h-full w-full rounded-full object-cover" />
                ) : (
                  getInitial(participant.nickname)
                )}
              </span>
              <span className="w-full truncate text-center text-sm font-black text-play-ink">{participant.nickname}</span>
              {isPraised ? <span className="rounded-full bg-play-surface px-2 py-1 text-[11px] font-black text-play-primary">칭찬 완료</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}