import { useEffect, useRef } from 'react';

import { useKakaoMap } from '../hooks/useKakaoMap';
import type { LocalMatch, MapCenter } from '../types/match';
import { sportLabel } from '../utils/matchFormat';

const DEFAULT_CENTER: MapCenter = { latitude: 37.3236, longitude: 126.8219 };

interface LocalMatchMapProps {
  matches: LocalMatch[];
  selectedMatchId: number | null;
  focusCenter?: MapCenter | null;
  currentLocation?: MapCenter | null;
  createLocation?: MapCenter | null;
  isPickingCreateLocation?: boolean;
  onSelectMatch: (matchId: number) => void;
  onCenterChange: (center: MapCenter) => void;
  onPickCreateLocation?: (center: MapCenter) => void;
}

function createMarkerContent(match: LocalMatch, isSelected: boolean) {
  const content = document.createElement('button');

  content.type = 'button';
  content.className = [
    'rounded-full border px-3 py-1 text-xs font-black shadow-lg transition',
    isSelected ? 'border-play-primary bg-play-primary text-white' : 'border-gray-200 bg-white text-gray-900',
  ].join(' ');
  content.textContent = `${sportLabel[match.sportType]} ${match.currentPlayers}/${match.maxPlayers}`;

  return content;
}

function createPendingContent() {
  const content = document.createElement('div');
  content.className = 'rounded-full border-2 border-play-primary bg-white px-3 py-1 text-xs font-black text-play-primary shadow-lg';
  content.textContent = '생성 위치';
  return content;
}

function createCurrentLocationContent() {
  const content = document.createElement('div');
  content.className = 'relative grid h-7 w-7 place-items-center rounded-full bg-[#060080]/15';

  const dot = document.createElement('div');
  dot.className = 'h-5 w-5 rounded-full border-[3px] border-white bg-[#060080] shadow-lg';
  content.appendChild(dot);

  return content;
}

export default function LocalMatchMap({
  matches,
  selectedMatchId,
  focusCenter,
  currentLocation,
  createLocation,
  isPickingCreateLocation = false,
  onSelectMatch,
  onCenterChange,
  onPickCreateLocation,
}: LocalMatchMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const overlaysRef = useRef<KakaoOverlay[]>([]);
  const currentLocationOverlayRef = useRef<KakaoOverlay | null>(null);
  const pendingMarkerRef = useRef<KakaoMarker | null>(null);
  const pendingOverlayRef = useRef<KakaoOverlay | null>(null);
  const hasFitInitialBoundsRef = useRef(false);
  const isPickingCreateLocationRef = useRef(isPickingCreateLocation);
  const onPickCreateLocationRef = useRef(onPickCreateLocation);
  const { isLoaded, error } = useKakaoMap();

  useEffect(() => {
    isPickingCreateLocationRef.current = isPickingCreateLocation;
    onPickCreateLocationRef.current = onPickCreateLocation;
  }, [isPickingCreateLocation, onPickCreateLocation]);

  useEffect(() => {
    if (!isLoaded || !containerRef.current || mapRef.current) {
      return;
    }

    const center = new window.kakao.maps.LatLng(DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude);
    const map = new window.kakao.maps.Map(containerRef.current, { center, level: 4 });

    mapRef.current = map;
    onCenterChange(DEFAULT_CENTER);

    window.kakao.maps.event.addListener(map, 'idle', () => {
      const nextCenter = map.getCenter();
      onCenterChange({ latitude: nextCenter.getLat(), longitude: nextCenter.getLng() });
    });

    window.kakao.maps.event.addListener(map, 'click', (event) => {
      if (!isPickingCreateLocationRef.current) {
        return;
      }

      onPickCreateLocationRef.current?.({ latitude: event.latLng.getLat(), longitude: event.latLng.getLng() });
    });
  }, [isLoaded, onCenterChange]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      return;
    }

    const map = mapRef.current;

    markersRef.current.forEach((marker) => marker.setMap(null));
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];

    const bounds = new window.kakao.maps.LatLngBounds();

    matches.forEach((match) => {
      const position = new window.kakao.maps.LatLng(match.latitude, match.longitude);
      const marker = new window.kakao.maps.Marker({ map, position, title: match.title });
      const content = createMarkerContent(match, match.matchId === selectedMatchId);
      const selectMatch = () => {
        onSelectMatch(match.matchId);
        map.panTo(position);
      };

      content.onclick = selectMatch;

      const overlay = new window.kakao.maps.CustomOverlay({ map, position, content, yAnchor: 2.9 });

      window.kakao.maps.event.addListener(marker, 'click', selectMatch);

      markersRef.current.push(marker);
      overlaysRef.current.push(overlay);
      bounds.extend(position);
    });

    if (matches.length > 0 && !hasFitInitialBoundsRef.current) {
      map.setBounds(bounds);
      hasFitInitialBoundsRef.current = true;
    }

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    };
  }, [isLoaded, matches, onSelectMatch, selectedMatchId]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      return;
    }

    pendingMarkerRef.current?.setMap(null);
    pendingOverlayRef.current?.setMap(null);
    pendingMarkerRef.current = null;
    pendingOverlayRef.current = null;

    if (!createLocation) {
      return;
    }

    const position = new window.kakao.maps.LatLng(createLocation.latitude, createLocation.longitude);
    pendingMarkerRef.current = new window.kakao.maps.Marker({ map: mapRef.current, position, title: '경기 생성 위치' });
    pendingOverlayRef.current = new window.kakao.maps.CustomOverlay({
      map: mapRef.current,
      position,
      content: createPendingContent(),
      yAnchor: 2.9,
    });
  }, [createLocation, isLoaded]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) {
      return;
    }

    currentLocationOverlayRef.current?.setMap(null);
    currentLocationOverlayRef.current = null;

    if (!currentLocation) {
      return;
    }

    const position = new window.kakao.maps.LatLng(currentLocation.latitude, currentLocation.longitude);
    currentLocationOverlayRef.current = new window.kakao.maps.CustomOverlay({
      map: mapRef.current,
      position,
      content: createCurrentLocationContent(),
      yAnchor: 0.5,
    });
  }, [currentLocation, isLoaded]);

  useEffect(() => {
    if (!focusCenter || !mapRef.current || !isLoaded) {
      return;
    }

    mapRef.current.panTo(new window.kakao.maps.LatLng(focusCenter.latitude, focusCenter.longitude));
  }, [focusCenter, isLoaded]);

  return (
    <div className="absolute inset-0 bg-slate-100">
      <div ref={containerRef} className="h-full w-full" />
      {isPickingCreateLocation && (
        <div className="absolute left-4 right-4 top-24 z-20 rounded-2xl bg-play-primary px-4 py-3 text-center text-sm font-black text-white shadow-lg md:left-1/2 md:right-auto md:w-[360px] md:-translate-x-1/2">
          지도를 눌러 경기 위치를 선택하세요
        </div>
      )}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 px-6 text-center">
          <div className="rounded-2xl bg-white px-5 py-4 shadow-lg">
            <p className="font-bold text-gray-900">지도를 불러오는 중입니다</p>
            <p className="mt-1 text-sm text-gray-500">{error ?? 'Kakao Map SDK를 준비하고 있어요.'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
