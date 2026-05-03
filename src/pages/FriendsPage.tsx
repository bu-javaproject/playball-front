export default function FriendsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
      <h1 className="text-2xl font-black text-slate-950">친구</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">친구 목록, 받은 요청, 요청 수락과 거절을 연결합니다.</p>
      </div>
    </div>
  );
}
