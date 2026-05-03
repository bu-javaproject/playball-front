import { useCallback, useMemo, useState } from 'react';

import { shouldUseLocalMatchMock } from '../api/localMatchApi';
import LocalMatchMap from '../components/LocalMatchMap';
import MapControlButtons from '../components/MapControlButtons';
import MatchBottomSheet from '../components/MatchBottomSheet';
import MatchCreateModal from '../components/MatchCreateModal';
import { useCreateMatch } from '../hooks/useCreateMatch';
import { useCurrentLocation } from '../hooks/useCurrentLocation';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useJoinMatch } from '../hooks/useJoinMatch';
import { useLocalMatches } from '../hooks/useLocalMatches';
import { useMatchDetail } from '../hooks/useMatchDetail';
import type { LocalMatchFilters, MapCenter, MatchCreateRequest } from '../types/match';

export default function LocalMatchPage() {
  const [selectedMatchId, setSelectedMatchId] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<MapCenter | null>(null);
  const [focusCenter, setFocusCenter] = useState<MapCenter | null>(null);
  const [filters] = useState<LocalMatchFilters>({});

  const { currentLocation, requestCurrentLocation } = useCurrentLocation();
  const createMatchMutation = useCreateMatch();
  const joinMatchMutation = useJoinMatch();
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
  const matches = localMatchesQuery.data?.matches ?? [];
  const selectedMatchFromList = matches.find((match) => match.matchId === selectedMatchId) ?? null;
  const selectedMatch = matchDetailQuery.data ?? selectedMatchFromList;

  const handleCenterChange = useCallback((center: MapCenter) => {
    setMapCenter(center);
  }, []);

  const handleSelectMatch = useCallback((matchId: number) => {
    setSelectedMatchId(matchId);
  }, []);

  const handleCreate = (payload: MatchCreateRequest) => {
    createMatchMutation.mutate(payload, {
      onSuccess: (createdMatch) => {
        setSelectedMatchId(createdMatch.matchId);
        setFocusCenter({ latitude: createdMatch.latitude, longitude: createdMatch.longitude });
        setIsCreateModalOpen(false);
      },
      onError: (error) => {
        window.alert(error instanceof Error ? error.message : '경기 생성에 실패했습니다.');
      },
    });
  };

  const handleJoin = (matchId: number) => {
    joinMatchMutation.mutate(matchId, {
      onSuccess: () => {
        window.alert('참가 신청이 완료되었습니다.');
      },
      onError: (error) => {
        window.alert(error instanceof Error ? error.message : '참가 신청에 실패했습니다.');
      },
    });
  };

  const handleCloseBottomSheet = () => {
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
        onSelectMatch={handleSelectMatch}
        onCenterChange={handleCenterChange}
      />

      <div className="absolute left-4 right-4 top-4 z-20">
        <input
          type="search"
          placeholder="장소나 종목을 검색하세요"
          className="h-14 w-full rounded-2xl border border-white/80 bg-white px-4 text-sm font-bold text-slate-900 shadow-lg outline-none placeholder:text-slate-400"
        />
      </div>

      {statusMessage && (
        <div className="absolute left-4 top-20 z-20 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-lg">
          {statusMessage}
        </div>
      )}

      <MapControlButtons
        onCreateMatch={() => setIsCreateModalOpen(true)}
        onRefresh={() => localMatchesQuery.refetch()}
        onMoveToCurrentLocation={requestCurrentLocation}
      />

      <MatchBottomSheet
        match={selectedMatch}
        onClose={handleCloseBottomSheet}
        onJoin={handleJoin}
        isJoining={joinMatchMutation.isPending}
      />

      <MatchCreateModal
        open={isCreateModalOpen}
        center={mapCenter}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
        isCreating={createMatchMutation.isPending}
      />
    </main>
  );
}
