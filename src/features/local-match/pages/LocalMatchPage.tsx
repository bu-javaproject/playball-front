import { useCallback, useMemo, useState } from 'react';

import { useAuth } from '@/app/providers/AuthContext';

import { shouldUseLocalMatchMock } from '../api/localMatchApi';
import ConfirmActionModal from '../components/ConfirmActionModal';
import LocalMatchMap from '../components/LocalMatchMap';
import MapControlButtons from '../components/MapControlButtons';
import MatchBottomSheet from '../components/MatchBottomSheet';
import MatchCreateModal from '../components/MatchCreateModal';
import MatchJoinCompleteOverlay from '../components/MatchJoinCompleteOverlay';
import { useCreateMatch } from '../hooks/useCreateMatch';
import { useCancelMatch } from '../hooks/useCancelMatch';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useJoinMatch } from '../hooks/useJoinMatch';
import { useLeaveMatch } from '../hooks/useLeaveMatch';
import { useLocalMatches } from '../hooks/useLocalMatches';
import { useMatchDetail } from '../hooks/useMatchDetail';
import type { MatchUserRelation } from '../components/MatchBottomSheet';
import type { LocalMatch, LocalMatchFilters, MapCenter, MatchCreateRequest, SportType } from '../types/match';
import { sportLabel } from '../utils/matchFormat';

const sportFilterOptions: Array<{ label: string; value: SportType | null }> = [
  { label: '전체', value: null },
  { label: sportLabel.SOCCER, value: 'SOCCER' },
  { label: sportLabel.BASKETBALL, value: 'BASKETBALL' },
  { label: sportLabel.RUNNING, value: 'RUNNING' },
  { label: sportLabel.BADMINTON, value: 'BADMINTON' },
];

export default function LocalMatchPage() {
  const { isAuthenticated } = useAuth();
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [isPickingCreateLocation, setIsPickingCreateLocation] = useState(false);
  const [createLocation, setCreateLocation] = useState<MapCenter | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pendingCreatePayload, setPendingCreatePayload] = useState<MatchCreateRequest | null>(null);
  const [pendingJoinMatchId, setPendingJoinMatchId] = useState<number | null>(null);
  const [pendingLeaveMatchId, setPendingLeaveMatchId] = useState<number | null>(null);
  const [pendingCancelMatchId, setPendingCancelMatchId] = useState<number | null>(null);
  const [joinedMatch, setJoinedMatch] = useState<LocalMatch | null>(null);
  const [createdMatchIds, setCreatedMatchIds] = useState<Set<number>>(() => new Set());
  const [joinedMatchIds, setJoinedMatchIds] = useState<Set<number>>(() => new Set());
  const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);
  const [focusCenter, setFocusCenter] = useState<MapCenter | null>(null);
  const [filters, setFilters] = useState<LocalMatchFilters>({});

  const { currentLocation, requestCurrentLocation } = useCurrentLocation();
  const createMatchMutation = useCreateMatch();
  const joinMatchMutation = useJoinMatch();
  const leaveMatchMutation = useLeaveMatch();
  const cancelMatchMutation = useCancelMatch();
  const debouncedMapCenter = useDebouncedValue(mapCenter, 400);
  const searchCenter = debouncedMapCenter ?? currentLocation;

  const searchParams = useMemo(
    () =>
      searchCenter
        ? {
            latitude: searchCenter.latitude,
            longitude: searchCenter.longitude,
            radius: 5,
            page: 0,
            size: 20,
            ...filters,
          }
        : null,
    [filters, searchCenter],
  );

  const localMatchesQuery = useLocalMatches(searchParams);
  const matchDetailQuery = useMatchDetail(selectedMatchId);
  const matches = useMemo(
    () => (localMatchesQuery.data?.matches ?? []).filter((match) => match.status !== 'CANCELLED'),
    [localMatchesQuery.data?.matches],
  );
  const selectedMatchFromList = matches.find((match) => match.matchId === selectedMatchId) ?? null;
  const selectedMatch = matchDetailQuery.data ?? selectedMatchFromList;
  const pendingJoinMatch = pendingJoinMatchId
    ? (matches.find((match) => match.matchId === pendingJoinMatchId) ?? selectedMatch)
    : null;
  const pendingLeaveMatch = pendingLeaveMatchId
    ? (matches.find((match) => match.matchId === pendingLeaveMatchId) ?? selectedMatch)
    : null;
  const pendingCancelMatch = pendingCancelMatchId
    ? (matches.find((match) => match.matchId === pendingCancelMatchId) ?? selectedMatch)
    : null;
  const selectedMatchRelation: MatchUserRelation = selectedMatchId
    ? createdMatchIds.has(selectedMatchId)
      ? 'CREATED'
      : joinedMatchIds.has(selectedMatchId)
        ? 'APPROVED'
        : 'NONE'
    : 'NONE';

  const handleCenterChange = useCallback((center: MapCenter) => {
    setMapCenter(center);
  }, []);

  const handleSportFilterChange = (sportType: SportType | null) => {
    setFilters(sportType ? { sportType } : {});
  };

  const handleSelectMatch = useCallback((matchId: number) => {
    if (isPickingCreateLocation) {
      return;
    }

    setSelectedMatchId(matchId);
    setJoinedMatch(null);
  }, [isPickingCreateLocation]);

  const handleStartCreateLocationPick = () => {
    if (!isAuthenticated) {
      window.alert('로그인 후 경기를 생성할 수 있습니다.');
      return;
    }

    setSelectedMatchId(null);
    setJoinedMatch(null);
    setCreateLocation(null);
    setPendingCreatePayload(null);
    setIsPickingCreateLocation(true);
    setIsCreateModalOpen(false);
  };

  const handlePickCreateLocation = (center: MapCenter) => {
    setCreateLocation(center);
    setFocusCenter(center);
    setIsPickingCreateLocation(false);
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateLocation(null);
    setPendingCreatePayload(null);
    setIsPickingCreateLocation(false);
  };

  const handleCreate = (payload: MatchCreateRequest) => {
    setPendingCreatePayload(payload);
  };

  const handleConfirmCreate = () => {
    if (!pendingCreatePayload) {
      return;
    }

    createMatchMutation.mutate(pendingCreatePayload, {
      onSuccess: (createdMatch) => {
        setCreatedMatchIds((previousIds) => new Set(previousIds).add(createdMatch.matchId));
        setSelectedMatchId(createdMatch.matchId);
        setFocusCenter({ latitude: createdMatch.latitude, longitude: createdMatch.longitude });
        setIsCreateModalOpen(false);
        setPendingCreatePayload(null);
        setCreateLocation(null);
        setIsPickingCreateLocation(false);
      },
      onError: (error) => {
        setPendingCreatePayload(null);
        window.alert(error instanceof Error ? error.message : '경기 생성에 실패했습니다.');
      },
    });
  };

  const handleJoin = (matchId: number) => {
    if (!isAuthenticated) {
      window.alert('로그인 후 경기 참가를 신청할 수 있습니다.');
      return;
    }

    setPendingJoinMatchId(matchId);
  };

  const handleConfirmJoin = () => {
    if (!pendingJoinMatchId || !pendingJoinMatch) {
      return;
    }

    joinMatchMutation.mutate(pendingJoinMatchId, {
      onSuccess: () => {
        setJoinedMatchIds((previousIds) => new Set(previousIds).add(pendingJoinMatchId));
        setJoinedMatch(pendingJoinMatch);
        setPendingJoinMatchId(null);
      },
      onError: (error) => {
        setPendingJoinMatchId(null);
        window.alert(error instanceof Error ? error.message : '참가 신청에 실패했습니다.');
      },
    });
  };

  const handleLeaveJoinedMatch = (matchId: number) => {
    if (!isAuthenticated) {
      window.alert('로그인 후 참가 신청을 취소할 수 있습니다.');
      return;
    }

    setPendingLeaveMatchId(matchId);
  };

  const handleConfirmLeave = () => {
    if (!pendingLeaveMatchId) {
      return;
    }

    leaveMatchMutation.mutate(pendingLeaveMatchId, {
      onSuccess: () => {
        setJoinedMatchIds((previousIds) => {
          const nextIds = new Set(previousIds);
          nextIds.delete(pendingLeaveMatchId);
          return nextIds;
        });
        setPendingLeaveMatchId(null);
      },
      onError: (error) => {
        setPendingLeaveMatchId(null);
        window.alert(error instanceof Error ? error.message : '참가 취소에 실패했습니다.');
      },
    });
  };

  const handleCancelCreatedMatch = (matchId: number) => {
    if (!isAuthenticated) {
      window.alert('로그인 후 경기를 취소할 수 있습니다.');
      return;
    }

    setPendingCancelMatchId(matchId);
  };

  const handleConfirmCancelMatch = () => {
    if (!pendingCancelMatchId) {
      return;
    }

    const cancelledMatchId = pendingCancelMatchId;

    cancelMatchMutation.mutate(cancelledMatchId, {
      onSuccess: () => {
        setCreatedMatchIds((previousIds) => {
          const nextIds = new Set(previousIds);
          nextIds.delete(cancelledMatchId);
          return nextIds;
        });
        setSelectedMatchId((currentSelectedMatchId) =>
          currentSelectedMatchId === cancelledMatchId ? null : currentSelectedMatchId,
        );
        setJoinedMatch((currentJoinedMatch) =>
          currentJoinedMatch?.matchId === cancelledMatchId ? null : currentJoinedMatch,
        );
        setPendingCancelMatchId(null);
      },
      onError: (error) => {
        setPendingCancelMatchId(null);
        window.alert(error instanceof Error ? error.message : '경기 취소에 실패했습니다.');
      },
    });
  };

  const handleCloseBottomSheet = () => {
    setSelectedMatchId(null);
    setJoinedMatch(null);
    setPendingJoinMatchId(null);
  };

  const handleViewJoinedDetail = () => {
    if (joinedMatch) {
      setSelectedMatchId(joinedMatch.matchId);
    }

    setJoinedMatch(null);
  };

  const handleCompleteHome = () => {
    setJoinedMatch(null);
    setSelectedMatchId(null);
  };

  const statusMessage = localMatchesQuery.isFetching
    ? '주변 경기를 찾는 중'
    : localMatchesQuery.isError
      ? '주변 경기 정보를 불러오지 못했습니다'
      : shouldUseLocalMatchMock
        ? 'Mock 데이터로 지역 매칭을 확인 중입니다'
        : null;

  return (
    <main className="relative h-screen w-full overflow-hidden bg-slate-100">
      <LocalMatchMap
        matches={matches}
        selectedMatchId={selectedMatchId}
        focusCenter={focusCenter ?? currentLocation}
        currentLocation={currentLocation}
        createLocation={createLocation}
        isPickingCreateLocation={isPickingCreateLocation}
        onSelectMatch={handleSelectMatch}
        onCenterChange={handleCenterChange}
        onPickCreateLocation={handlePickCreateLocation}
      />

      <div className="absolute left-4 right-4 top-4 z-20">
        <input
          type="search"
          readOnly
          placeholder="지도를 움직이거나 종목을 선택하세요"
          className="h-14 w-full rounded-2xl border border-white/80 bg-white px-4 text-sm font-bold text-slate-900 shadow-lg outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="absolute left-4 right-4 top-20 z-20 flex gap-2 overflow-x-auto pb-1">
        {sportFilterOptions.map((option) => {
          const isSelected = filters.sportType === option.value || (!filters.sportType && option.value === null);

          return (
            <button
              key={option.value ?? 'ALL'}
              type="button"
              onClick={() => handleSportFilterChange(option.value)}
              className={`h-9 shrink-0 rounded-full px-4 text-xs font-black shadow-lg ${
                isSelected ? 'bg-play-primary text-white' : 'bg-white text-slate-700'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {statusMessage && !isPickingCreateLocation && (
        <div className="absolute left-4 top-[124px] z-20 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-lg">
          {statusMessage}
        </div>
      )}

      <MapControlButtons
        onCreateMatch={handleStartCreateLocationPick}
        onRefresh={() => localMatchesQuery.refetch()}
        onMoveToCurrentLocation={requestCurrentLocation}
      />

      {isPickingCreateLocation && (
        <button
          type="button"
          onClick={() => {
            setIsPickingCreateLocation(false);
            setCreateLocation(null);
          }}
          className="absolute bottom-8 left-5 z-20 h-12 rounded-full bg-white px-5 text-sm font-black text-slate-700 shadow-lg"
        >
          위치 선택 취소
        </button>
      )}

      <MatchBottomSheet
        match={selectedMatch}
        onClose={handleCloseBottomSheet}
        onJoin={handleJoin}
        onCancelCreatedMatch={handleCancelCreatedMatch}
        onLeaveJoinedMatch={handleLeaveJoinedMatch}
        isJoining={joinMatchMutation.isPending}
        isCancelling={cancelMatchMutation.isPending}
        isLeaving={leaveMatchMutation.isPending}
        userRelation={selectedMatchRelation}
      />

      <MatchJoinCompleteOverlay
        open={Boolean(joinedMatch)}
        match={joinedMatch}
        onViewDetail={handleViewJoinedDetail}
        onHome={handleCompleteHome}
      />

      <MatchCreateModal
        open={isCreateModalOpen}
        center={createLocation}
        onClose={handleCloseCreateModal}
        onCreate={handleCreate}
        isCreating={createMatchMutation.isPending || Boolean(pendingCreatePayload)}
      />

      <ConfirmActionModal
        open={Boolean(pendingJoinMatchId)}
        title="참가하시겠습니까?"
        message={pendingJoinMatch ? `${pendingJoinMatch.title} 경기에 참가 신청합니다.` : undefined}
        onCancel={() => setPendingJoinMatchId(null)}
        onConfirm={handleConfirmJoin}
        isConfirming={joinMatchMutation.isPending}
      />

      <ConfirmActionModal
        open={Boolean(pendingCreatePayload)}
        title="경기를 생성하시겠습니까?"
        message="지도에서 선택한 위치에 새 경기를 생성합니다."
        onCancel={() => setPendingCreatePayload(null)}
        onConfirm={handleConfirmCreate}
        isConfirming={createMatchMutation.isPending}
      />

      <ConfirmActionModal
        open={Boolean(pendingLeaveMatchId)}
        title="참가 신청을 취소하시겠습니까?"
        message={pendingLeaveMatch ? `${pendingLeaveMatch.title} 경기 참가를 취소합니다.` : undefined}
        confirmLabel="취소하기"
        onCancel={() => setPendingLeaveMatchId(null)}
        onConfirm={handleConfirmLeave}
        isConfirming={leaveMatchMutation.isPending}
      />

      <ConfirmActionModal
        open={Boolean(pendingCancelMatchId)}
        title="경기를 취소하시겠습니까?"
        message={pendingCancelMatch ? `${pendingCancelMatch.title} 경기를 취소합니다.` : undefined}
        confirmLabel="취소하기"
        onCancel={() => setPendingCancelMatchId(null)}
        onConfirm={handleConfirmCancelMatch}
        isConfirming={cancelMatchMutation.isPending}
      />
    </main>
  );
}

