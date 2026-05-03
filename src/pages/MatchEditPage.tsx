import { useParams } from 'react-router-dom';

export default function MatchEditPage() {
  const { matchId } = useParams();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
      <h1 className="text-2xl font-black text-slate-950">경기 수정</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">경기 #{matchId}의 제목, 일시, 인원, 참가비, 공지 메시지를 수정합니다.</p>
      </div>
    </div>
  );
}
