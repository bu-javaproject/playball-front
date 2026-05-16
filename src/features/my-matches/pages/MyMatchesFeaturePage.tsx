import { useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';

import { MatchDetailSheet } from '../components/MatchDetailSheet';
import { MyMatchCard } from '../components/MyMatchCard';
import { ParticipantSheet } from '../components/ParticipantSheet';
import { PastMatchItem } from '../components/PastMatchItem';
import { PlayerProfileModal } from '../components/PlayerProfileModal';
import { PraiseModal } from '../components/PraiseModal';
import { useCreateCompliment } from '../hooks/useCreateCompliment';
import { useLeaveOrCancelMatch } from '../hooks/useLeaveOrCancelMatch';
import { useMatchDetail } from '../hooks/useMatchDetail';
import { useMatchParticipants } from '../hooks/useMatchParticipants';
import { useMemberProfile } from '../hooks/useMemberProfile';
import { useMyMatchHistory, useMyMatches } from '../hooks/useMyMatches';
import type { ComplimentTag, MatchParticipant, MatchStatus, MyMatchSummary } from '../types/myMatch';
import { isFinishedStatus } from '../utils/myMatchFormat';

export function MyMatchesFeaturePage() {
  const myMatchesQuery = useMyMatches({ page: 0, size: 20 });
  const historyQuery = useMyMatchHistory({ page: 0, size: 20 });
  const leaveOrCancelMutation = useLeaveOrCancelMatch();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [selectedDetailMatchId, setSelectedDetailMatchId] = useState<number | null>(null);
  const [selectedMatchStatus, setSelectedMatchStatus] = useState<MatchStatus | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<MatchParticipant | null>(null);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<MyMatchSummary | null>(null);
  const [isPraiseOpen, setIsPraiseOpen] = useState(false);
  const participantsQuery = useMatchParticipants(selectedMatchId);
  const matchDetailQuery = useMatchDetail(selectedDetailMatchId);
  const memberProfileQuery = useMemberProfile(selectedParticipant?.memberId ?? null);
  const complimentMutation = useCreateCompliment(selectedMatchId);

  const upcomingMatches = useMemo(() => myMatchesQuery.data?.content ?? [], [myMatchesQuery.data?.content]);
  const pastMatches = useMemo(() => historyQuery.data?.content ?? [], [historyQuery.data?.content]);
  const canPraise = selectedMatchStatus ? isFinishedStatus(selectedMatchStatus) : false;

  const selectedHistoryStatus = useMemo(
    () => pastMatches.find((match) => match.matchId === selectedMatchId)?.result ?? null,
    [pastMatches, selectedMatchId],
  );

  function openParticipants(matchId: number, status?: MatchStatus) {
    setSelectedMatchId(matchId);
    setSelectedMatchStatus(status ?? selectedHistoryStatus ?? null);
  }

  function closeParticipants() {
    setSelectedMatchId(null);
    setSelectedMatchStatus(null);
    setSelectedParticipant(null);
    setIsPraiseOpen(false);
  }

  function confirmLeaveOrCancel() {
    if (!pendingLeaveAction) {
      return;
    }

    leaveOrCancelMutation.mutate(
      { matchId: pendingLeaveAction.matchId, isCreator: pendingLeaveAction.isCreator },
      {
        onSuccess: () => {
          setPendingLeaveAction(null);
        },
      },
    );
  }

  function submitPraise(tags: ComplimentTag[], comment: string) {
    if (!selectedParticipant) {
      return;
    }

    complimentMutation.mutate(
      {
        compliments: [
          {
            rateeId: selectedParticipant.memberId,
            tags,
            comment: comment.trim() ? comment.trim() : null,
          },
        ],
      },
      {
        onSuccess: () => {
          setIsPraiseOpen(false);
          setSelectedParticipant(null);
        },
      },
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 pb-8 pt-6">
      <header className="mb-6">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-600">PlayBall</p>
        <h1 className="mt-1 text-3xl font-black text-slate-950">내 경기</h1>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-blue-600" size={20} />
          <h2 className="text-lg font-black text-slate-950">현재 잡힌 경기</h2>
        </div>

        {myMatchesQuery.isLoading ? (
          <LoadingCard message="내 경기 목록을 불러오는 중입니다." />
        ) : upcomingMatches.length > 0 ? (
          upcomingMatches.map((match) => (
            <MyMatchCard
              key={match.matchId}
              match={match}
              isLeaving={leaveOrCancelMutation.isPending}
              onOpenParticipants={() => openParticipants(match.matchId, match.status)}
              onOpenDetail={setSelectedDetailMatchId}
              onLeaveOrCancel={setPendingLeaveAction}
            />
          ))
        ) : (
          <EmptyCard message="아직 잡힌 경기가 없습니다." />
        )}
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-black text-slate-950">지난 경기</h2>

        {historyQuery.isLoading ? (
          <LoadingCard message="경기 기록을 불러오는 중입니다." />
        ) : pastMatches.length > 0 ? (
          pastMatches.map((match) => (
            <PastMatchItem
              key={match.matchId}
              match={match}
              onOpenParticipants={() => openParticipants(match.matchId, match.result)}
              onOpenDetail={setSelectedDetailMatchId}
            />
          ))
        ) : (
          <EmptyCard message="지난 경기 기록이 없습니다." />
        )}
      </section>

      {selectedDetailMatchId ? (
        <MatchDetailSheet
          match={matchDetailQuery.data}
          isLoading={matchDetailQuery.isLoading}
          onClose={() => setSelectedDetailMatchId(null)}
        />
      ) : null}

      {selectedMatchId ? (
        <ParticipantSheet
          match={participantsQuery.data}
          isLoading={participantsQuery.isLoading}
          onClose={closeParticipants}
          onOpenProfile={setSelectedParticipant}
        />
      ) : null}

      {selectedParticipant ? (
        <PlayerProfileModal
          profile={memberProfileQuery.data}
          isLoading={memberProfileQuery.isLoading}
          canPraise={canPraise}
          onClose={() => setSelectedParticipant(null)}
          onPraise={() => setIsPraiseOpen(true)}
        />
      ) : null}

      {selectedParticipant && isPraiseOpen ? (
        <PraiseModal
          participant={selectedParticipant}
          isSubmitting={complimentMutation.isPending}
          onClose={() => setIsPraiseOpen(false)}
          onSubmit={submitPraise}
        />
      ) : null}

      {pendingLeaveAction ? (
        <LeaveOrCancelConfirmModal
          match={pendingLeaveAction}
          isSubmitting={leaveOrCancelMutation.isPending}
          onClose={() => setPendingLeaveAction(null)}
          onConfirm={confirmLeaveOrCancel}
        />
      ) : null}
    </div>
  );
}

interface MessageCardProps {
  message: string;
}

function LoadingCard({ message }: MessageCardProps) {
  return <div className="rounded-2xl bg-white p-5 text-sm font-bold text-slate-500 shadow-sm">{message}</div>;
}

function EmptyCard({ message }: MessageCardProps) {
  return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm font-bold text-slate-500">{message}</div>;
}

interface LeaveOrCancelConfirmModalProps {
  match: MyMatchSummary;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function LeaveOrCancelConfirmModal({ match, isSubmitting, onClose, onConfirm }: LeaveOrCancelConfirmModalProps) {
  const title = match.isCreator ? '경기를 취소하시겠습니까?' : '경기에 불참하시겠습니까?';
  const description = match.isCreator ? '참가자에게 경기 취소 알림이 전달됩니다.' : '참가 취소 후 다시 신청이 필요할 수 있습니다.';

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-slate-950/45 px-5">
      <section className="w-full max-w-sm rounded-[26px] bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-slate-500">{description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="h-12 rounded-2xl bg-slate-100 text-sm font-black text-slate-600">
            아니오
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="h-12 rounded-2xl bg-red-500 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            네
          </button>
        </div>
      </section>
    </div>
  );
}
