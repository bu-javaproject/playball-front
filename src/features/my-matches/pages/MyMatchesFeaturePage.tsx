import { useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';

import { useAuth } from '@/app/providers/AuthContext';
import AppHeader from '@/components/AppHeader';
import { getKakaoAuthorizeUrl } from '@/features/auth/utils/kakaoAuth';

import { MatchDetailSheet } from '../components/MatchDetailSheet';
import { MyMatchCard } from '../components/MyMatchCard';
import { ParticipantSheet } from '../components/ParticipantSheet';
import { PastMatchItem } from '../components/PastMatchItem';
import { PlayerProfileModal } from '../components/PlayerProfileModal';
import { shouldUseMyMatchesMock } from '../api/myMatchesApi';
import { useCreateCompliment } from '../hooks/useCreateCompliment';
import { useLeaveOrCancelMatch } from '../hooks/useLeaveOrCancelMatch';
import { useMatchDetail } from '../hooks/useMatchDetail';
import { useMatchParticipants } from '../hooks/useMatchParticipants';
import { useMemberProfile } from '../hooks/useMemberProfile';
import { useMyMatchHistory, useMyMatches } from '../hooks/useMyMatches';
import type { ComplimentTag, MatchParticipant, MatchStatus, MyMatchSummary } from '../types/myMatch';
import { isFinishedStatus } from '../utils/myMatchFormat';

export function MyMatchesFeaturePage() {
  const { isAuthenticated } = useAuth();
  const canLoadMyMatches = isAuthenticated || shouldUseMyMatchesMock;
  const myMatchesQuery = useMyMatches({ page: 0, size: 20 }, canLoadMyMatches);
  const historyQuery = useMyMatchHistory({ page: 0, size: 20 }, canLoadMyMatches);
  const leaveOrCancelMutation = useLeaveOrCancelMatch();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [selectedDetailMatchId, setSelectedDetailMatchId] = useState<number | null>(null);
  const [selectedMatchStatus, setSelectedMatchStatus] = useState<MatchStatus | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<MatchParticipant | null>(null);
  const [pendingLeaveAction, setPendingLeaveAction] = useState<MyMatchSummary | null>(null);
  const [praisedParticipantKeys, setPraisedParticipantKeys] = useState<Set<string>>(() => new Set());
  const participantsQuery = useMatchParticipants(selectedMatchId);
  const matchDetailQuery = useMatchDetail(selectedDetailMatchId);
  const memberProfileQuery = useMemberProfile(selectedParticipant?.memberId ?? null);
  const complimentMutation = useCreateCompliment(selectedMatchId);

  const upcomingMatches = useMemo(() => myMatchesQuery.data?.content ?? [], [myMatchesQuery.data?.content]);
  const pastMatches = useMemo(() => historyQuery.data?.content ?? [], [historyQuery.data?.content]);
  const canPraise = selectedMatchStatus ? isFinishedStatus(selectedMatchStatus) : false;
  const selectedParticipantPraiseKey = selectedMatchId && selectedParticipant ? getPraiseKey(selectedMatchId, selectedParticipant.memberId) : null;
  const isSelectedParticipantPraised = selectedParticipantPraiseKey ? praisedParticipantKeys.has(selectedParticipantPraiseKey) : false;

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
  }

  function confirmLeaveOrCancel() {
    if (!pendingLeaveAction) return;

    leaveOrCancelMutation.mutate(
      { matchId: pendingLeaveAction.matchId, isCreator: pendingLeaveAction.isCreator },
      {
        onSuccess: () => {
          setPendingLeaveAction(null);
        },
      },
    );
  }

  function submitPraise(tag: ComplimentTag) {
    if (!selectedParticipant || !selectedParticipantPraiseKey || isSelectedParticipantPraised) {
      return;
    }

    complimentMutation.mutate(
      {
        compliments: [
          {
            rateeId: selectedParticipant.memberId,
            tags: [tag],
            comment: null,
          },
        ],
      },
      {
        onSuccess: () => {
          setPraisedParticipantKeys((current) => new Set(current).add(selectedParticipantPraiseKey));
        },
      },
    );
  }

  if (!canLoadMyMatches) {
    return <MyMatchesLoginPrompt />;
  }

  return (
    <div className="min-h-screen bg-play-surface px-4 pb-8">
      <AppHeader title="내 경기" subtitle="참여 중인 경기와 지난 기록을 확인하세요" />

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="text-play-primary" size={20} />
          <h2 className="text-lg font-black text-play-ink">예정된 경기</h2>
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
          <EmptyCard message="아직 예정된 경기가 없습니다." />
        )}
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-black text-play-ink">지난 경기</h2>

        {historyQuery.isLoading ? (
          <LoadingCard message="지난 경기 기록을 불러오는 중입니다." />
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
          praisedMemberIds={getPraisedMemberIds(selectedMatchId, praisedParticipantKeys)}
          onClose={closeParticipants}
          onOpenProfile={setSelectedParticipant}
        />
      ) : null}

      {selectedParticipant ? (
        <PlayerProfileModal
          profile={memberProfileQuery.data}
          isLoading={memberProfileQuery.isLoading}
          canPraise={canPraise}
          isSubmittingPraise={complimentMutation.isPending}
          isPraiseCompleted={isSelectedParticipantPraised}
          onClose={() => setSelectedParticipant(null)}
          onPraiseSubmit={submitPraise}
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

function MyMatchesLoginPrompt() {
  const handleLogin = () => {
    try {
      window.location.href = getKakaoAuthorizeUrl();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '카카오 로그인 설정을 확인해주세요.');
    }
  };

  return (
    <div className="min-h-screen bg-play-surface px-4 pb-8">
      <AppHeader title="내 경기" subtitle="로그인 후 내가 참가한 경기를 확인할 수 있어요" />
      <section className="mt-8 rounded-3xl border border-play-border bg-white px-5 py-10 text-center shadow-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-play-surface text-3xl">PB</div>
        <h2 className="mt-6 text-2xl font-black text-play-ink">로그인이 필요합니다</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-play-muted">
          내 경기 목록, 지난 경기, 참가자 정보는 로그인 후 확인할 수 있어요.
        </p>
        <button
          type="button"
          onClick={handleLogin}
          className="mt-7 h-13 w-full rounded-2xl bg-[#FEE500] text-base font-black text-[#191919] shadow-lg shadow-yellow-200/60"
        >
          카카오로 시작하기
        </button>
      </section>
    </div>
  );
}

function getPraiseKey(matchId: number, memberId: number) {
  return `${matchId}:${memberId}`;
}

function getPraisedMemberIds(matchId: number, praisedKeys: Set<string>) {
  const memberIds = new Set<number>();

  praisedKeys.forEach((key) => {
    const [keyMatchId, keyMemberId] = key.split(':').map(Number);

    if (keyMatchId === matchId && Number.isFinite(keyMemberId)) {
      memberIds.add(keyMemberId);
    }
  });

  return memberIds;
}

function LoadingCard({ message }: { message: string }) {
  return <div className="rounded-2xl border border-play-border bg-white p-5 text-sm font-bold text-play-muted shadow-sm">{message}</div>;
}

function EmptyCard({ message }: { message: string }) {
  return <div className="rounded-2xl border border-dashed border-play-border bg-white p-5 text-sm font-bold text-play-muted">{message}</div>;
}

function LeaveOrCancelConfirmModal({
  match,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  match: MyMatchSummary;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const title = match.isCreator ? '경기를 취소할까요?' : '경기 참가를 취소할까요?';
  const description = match.isCreator
    ? '참가자에게 경기 취소 알림이 전달됩니다.'
    : '참가 취소 후 다시 참가 신청할 수 있습니다.';

  return (
    <div className="fixed inset-0 z-[95] grid place-items-center bg-slate-950/45 px-5">
      <section className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-play-ink">{title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-play-muted">{description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="h-12 rounded-xl bg-play-surface text-sm font-black text-play-muted">
            아니요
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onConfirm}
            className="h-12 rounded-xl bg-red-500 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            확인
          </button>
        </div>
      </section>
    </div>
  );
}
