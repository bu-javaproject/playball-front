import { useNavigate } from 'react-router-dom';

import RandomMatchForm from '@/features/random-match/components/RandomMatchForm';
import RandomMatchFoundCard from '@/features/random-match/components/RandomMatchFoundCard';
import RandomMatchStatusCard from '@/features/random-match/components/RandomMatchStatusCard';
import { useRandomMatchFlow } from '@/features/random-match/hooks/useRandomMatchFlow';

export default function RandomMatchPage() {
  const navigate = useNavigate();
  const {
    status,
    form,
    matchedGame,
    updateForm,
    requestMatch,
    acceptMatch,
    rejectMatch,
    resetToForm,
  } = useRandomMatchFlow();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-6">
      {status === 'FORM' && <RandomMatchForm form={form} onChange={updateForm} onSubmit={requestMatch} />}

      {status === 'SEARCHING' && (
        <RandomMatchStatusCard
          title="주변 경기를 찾고 있어요"
          description="설정한 조건에 맞는 경기를 탐색 중입니다."
          icon="검색"
        >
          <button
            type="button"
            onClick={resetToForm}
            className="mt-8 h-12 w-full rounded-2xl bg-slate-100 font-black text-slate-600"
          >
            취소
          </button>
        </RandomMatchStatusCard>
      )}

      {status === 'FOUND' && matchedGame && (
        <RandomMatchFoundCard matchedGame={matchedGame} onAccept={acceptMatch} onReject={rejectMatch} />
      )}

      {status === 'SUCCESS' && (
        <RandomMatchStatusCard
          title="참가 신청 완료!"
          description="매칭된 경기에 참가 신청이 완료되었습니다."
          icon="완료"
        >
          <button
            type="button"
            onClick={() => navigate('/matches/my')}
            className="mt-8 h-12 w-full rounded-2xl bg-green-600 font-black text-white"
          >
            내 경기 보기
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 h-12 w-full rounded-2xl bg-slate-100 font-black text-slate-600"
          >
            홈으로
          </button>
        </RandomMatchStatusCard>
      )}

      {status === 'FAIL' && (
        <RandomMatchStatusCard
          title="조건에 맞는 경기가 없어요"
          description="조건을 바꾸고 다시 시도해보세요."
          icon="실패"
        >
          <button
            type="button"
            onClick={resetToForm}
            className="mt-8 h-12 w-full rounded-2xl bg-blue-600 font-black text-white"
          >
            조건 다시 설정
          </button>
        </RandomMatchStatusCard>
      )}
    </div>
  );
}
