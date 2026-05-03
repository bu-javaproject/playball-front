declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (latitude: number, longitude: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap;
        Marker: new (options: { map?: KakaoMap | null; position: KakaoLatLng; title?: string }) => KakaoMarker;
        CustomOverlay: new (options: {
          map?: KakaoMap | null;
          position: KakaoLatLng;
          content: HTMLElement | string;
          yAnchor?: number;
        }) => KakaoOverlay;
        LatLngBounds: new () => KakaoLatLngBounds;
        event: {
          addListener: (target: unknown, type: string, handler: (event: KakaoMouseEvent) => void) => void;
        };
      };
    };
  }

  interface KakaoLatLng {
    getLat: () => number;
    getLng: () => number;
  }

  interface KakaoMouseEvent {
    latLng: KakaoLatLng;
  }

  interface KakaoMap {
    getCenter: () => KakaoLatLng;
    panTo: (position: KakaoLatLng) => void;
    setBounds: (bounds: KakaoLatLngBounds) => void;
  }

  interface KakaoMarker {
    setMap: (map: KakaoMap | null) => void;
  }

  interface KakaoOverlay {
    setMap: (map: KakaoMap | null) => void;
  }

  interface KakaoLatLngBounds {
    extend: (position: KakaoLatLng) => void;
  }
}

export {};
