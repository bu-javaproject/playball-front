export default function ProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
      <h1 className="text-2xl font-black text-slate-950">프로필</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">내 프로필, 선호 종목, 경기 기록, 알림 설정으로 이어지는 화면입니다.</p>
      </div>
    </div>
  );
}
