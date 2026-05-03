export default function MatchCreatePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
      <h1 className="text-2xl font-black text-slate-950">경기 만들기</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">지역 매칭 지도에서 위치를 고른 뒤 경기 생성 API로 연결됩니다.</p>
      </div>
    </div>
  );
}
