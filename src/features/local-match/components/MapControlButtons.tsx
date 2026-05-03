interface MapControlButtonsProps {
  onCreateMatch: () => void;
  onRefresh?: () => void;
  onMoveToCurrentLocation?: () => void;
}

export default function MapControlButtons({
  onCreateMatch,
  onRefresh,
  onMoveToCurrentLocation,
}: MapControlButtonsProps) {
  return (
    <>
      <div className="absolute right-4 top-24 z-20 flex flex-col gap-3">
        <button
          type="button"
          onClick={onRefresh}
          aria-label="주변 경기 다시 검색"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-slate-800 shadow-lg transition hover:bg-slate-50"
        >
          <span aria-hidden="true">↻</span>
        </button>

        <button
          type="button"
          onClick={onMoveToCurrentLocation}
          aria-label="현재 위치로 이동"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl font-black text-slate-800 shadow-lg transition hover:bg-slate-50"
        >
          <span aria-hidden="true">⌖</span>
        </button>
      </div>

      <button
        type="button"
        onClick={onCreateMatch}
        aria-label="경기 생성"
        className="absolute bottom-8 right-5 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-play-primary text-3xl font-black text-white shadow-xl transition hover:bg-play-primary-dark"
      >
        <span aria-hidden="true">+</span>
      </button>
    </>
  );
}
