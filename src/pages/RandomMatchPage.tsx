import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/AppHeader';
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
    <div className="min-h-[calc(100vh-64px)] bg-play-surface px-4 pb-6">
      <AppHeader title="랜덤 매칭" subtitle="조건에 맞는 경기를 추천해드려요" showBack />

      {status === 'FORM' && <RandomMatchForm form={form} onChange={updateForm} onSubmit={requestMatch} />}

      {status === 'SEARCHING' && (
        <RandomMatchStatusCard
          title="주변 경기를 찾고 있어요"
          description="선택한 조건과 가까운 모집 중 경기를 확인하고 있습니다."
          icon="검색"
        >
          <button
            type="button"
            onClick={resetToForm}
            className="mt-8 h-12 w-full rounded-xl bg-play-surface font-black text-play-muted"
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
          title="참가 신청 완료"
          description="매칭된 경기에 참가 신청이 완료되었습니다."
          icon="완료"
        >
          <button
            type="button"
            onClick={() => navigate('/matches/my')}
            className="mt-8 h-12 w-full rounded-xl bg-play-primary font-black text-white"
          >
            내 경기 보기
          </button>

          <button
            type="button"
            onClick={() => navigate('/')}
            className="mt-3 h-12 w-full rounded-xl bg-play-surface font-black text-play-muted"
          >
            홈으로
          </button>
        </RandomMatchStatusCard>
      )}

      {status === 'FAIL' && (
        <RandomMatchStatusCard
          title="조건에 맞는 경기가 없어요"
          description="조건을 조금 넓히거나 지역 매칭에서 직접 경기를 찾아보세요."
          icon="실패"
        >
          <button
            type="button"
            onClick={resetToForm}
            className="mt-8 h-12 w-full rounded-xl bg-play-primary font-black text-white"
          >
            조건 다시 설정
          </button>

          <button
            type="button"
            onClick={() => navigate('/local-match')}
            className="mt-3 h-12 w-full rounded-xl bg-play-surface font-black text-play-muted"
          >
            지역 매칭 보기
          </button>
        </RandomMatchStatusCard>
      )}
    </div>
  );
}
