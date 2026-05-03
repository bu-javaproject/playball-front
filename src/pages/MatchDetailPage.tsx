import { Link, useParams } from 'react-router-dom';

import { Button } from '@/shared/ui/Button';

export default function MatchDetailPage() {
  const { matchId } = useParams();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 px-4 py-8">
      <h1 className="text-2xl font-black text-slate-950">경기 상세</h1>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm leading-6 text-slate-600">경기 #{matchId} 상세 조회와 참가 신청 흐름을 연결할 화면입니다.</p>
        <Link to="/local-match" className="mt-5 inline-flex">
          <Button type="button">지도에서 보기</Button>
        </Link>
      </div>
    </div>
  );
}
