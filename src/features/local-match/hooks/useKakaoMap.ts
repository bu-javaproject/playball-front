import { useEffect, useState } from 'react';

const KAKAO_SDK_ID = 'kakao-map-sdk';
const KAKAO_SDK_SRC = 'https://dapi.kakao.com/v2/maps/sdk.js';
const kakaoMapAppKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY as string | undefined;
const missingAppKeyMessage = 'VITE_KAKAO_MAP_APP_KEY 환경변수가 필요합니다.';

let kakaoMapLoader: Promise<void> | null = null;

function loadKakaoMapSdk(appKey: string): Promise<void> {
  if (window.kakao?.maps) {
    return new Promise((resolve) => window.kakao.maps.load(resolve));
  }

  if (kakaoMapLoader) {
    return kakaoMapLoader;
  }

  kakaoMapLoader = new Promise((resolve, reject) => {
    const existingScript = document.getElementById(KAKAO_SDK_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener('load', () => window.kakao.maps.load(resolve), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Kakao Map SDK 로딩에 실패했습니다.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_SDK_ID;
    script.async = true;
    script.src = `${KAKAO_SDK_SRC}?appkey=${appKey}&autoload=false&libraries=services`;
    script.onload = () => window.kakao.maps.load(resolve);
    script.onerror = () => reject(new Error('Kakao Map SDK 로딩에 실패했습니다.'));
    document.head.appendChild(script);
  });

  return kakaoMapLoader;
}

export function useKakaoMap() {
  const [isLoaded, setIsLoaded] = useState(() => Boolean(kakaoMapAppKey && window.kakao?.maps));
  const [error, setError] = useState<string | null>(() => (kakaoMapAppKey ? null : missingAppKeyMessage));

  useEffect(() => {
    if (!kakaoMapAppKey) {
      return;
    }

    let cancelled = false;

    loadKakaoMapSdk(kakaoMapAppKey)
      .then(() => {
        if (!cancelled) {
          setIsLoaded(true);
          setError(null);
        }
      })
      .catch((sdkError: Error) => {
        if (!cancelled) {
          setError(sdkError.message);
          setIsLoaded(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { isLoaded, error };
}
