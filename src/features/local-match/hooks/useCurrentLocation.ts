import { useCallback, useState } from 'react';

import type { MapCenter } from '../types/match';

export function useCurrentLocation() {
  const [currentLocation, setCurrentLocation] = useState<MapCenter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('현재 브라우저에서 위치 정보를 사용할 수 없습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoading(false);
      },
      () => {
        setError('현재 위치를 가져오지 못했습니다.');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      },
    );
  }, []);

  return { currentLocation, error, isLoading, requestCurrentLocation };
}
