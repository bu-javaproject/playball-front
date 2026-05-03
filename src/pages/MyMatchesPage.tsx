export default function MyMatchesPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-4 py-8">
      <h1 className="text-2xl font-black text-slate-950">내 경기</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">내가 만든 경기와 참가 중인 경기 목록을 분리해서 표시합니다.</p>
      </div>
    </div>
  );
}
