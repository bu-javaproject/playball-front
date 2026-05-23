import { MapPin, Shuffle } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/AppHeader';

export default function MatchingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col bg-play-surface px-4 pb-6">
      <AppHeader title="매칭" subtitle="원하는 방식으로 경기를 찾아보세요" />

      <section className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-24 pb-16">
        <MatchTypeCard
          title="랜덤 매칭"
          description="조건을 고르면 가까운 모집 중 경기를 바로 추천받을 수 있어요."
          icon={<Shuffle size={30} />}
          tone="primary"
          onClick={() => navigate('/random-match')}
        />
        <MatchTypeCard
          title="지역 매칭"
          description="지도에서 주변 경기를 직접 확인하고 참가하거나 새 경기를 만들 수 있어요."
          icon={<MapPin size={30} />}
          tone="secondary"
          onClick={() => navigate('/local-match')}
        />
      </section>
    </div>
  );
}

function MatchTypeCard({
  title,
  description,
  icon,
  tone,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  tone: 'primary' | 'secondary';
  onClick: () => void;
}) {
  const isPrimary = tone === 'primary';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-44 w-full flex-col justify-between rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        isPrimary
          ? 'border-play-primary bg-play-primary text-white'
          : 'border-play-border bg-white text-play-ink hover:border-play-primary/40'
      }`}
    >
      <span
        className={`grid h-14 w-14 place-items-center rounded-2xl ${
          isPrimary ? 'bg-white/20 text-white' : 'bg-play-surface text-play-primary'
        }`}
      >
        {icon}
      </span>

      <span>
        <span className="block text-xl font-black">{title}</span>
        <span className={`mt-2 block text-sm font-bold leading-6 ${isPrimary ? 'text-white/85' : 'text-play-muted'}`}>
          {description}
        </span>
      </span>
    </button>
  );
}
