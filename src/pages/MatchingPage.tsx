import { MapPin, Shuffle, UsersRound } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/AppHeader';

const chatRooms = [
  {
    id: 1,
    sport: '축구',
    title: '천안 풋살 5대5 모집',
    description: '실력 상관없이 즐겁게 뛰실 분',
    time: '20:00',
    count: '8/10',
  },
  {
    id: 2,
    sport: '농구',
    title: '백석대 농구 3대3',
    description: '가볍게 한 게임 같이 하실 분',
    time: '18:10',
    count: '4/6',
  },
  {
    id: 3,
    sport: '러닝',
    title: '천호천 러닝 메이트',
    description: '초보 환영, 5km 천천히 달려요',
    time: '13:00',
    count: '3/8',
  },
];

export default function MatchingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-play-surface px-4 pb-6">
      <AppHeader title="매칭" subtitle="원하는 방식으로 경기를 찾아보세요" />

      <section className="grid gap-3">
        <MatchTypeCard
          title="랜덤 매칭"
          description="조건을 고르면 맞는 경기를 바로 추천받아요."
          icon={<Shuffle size={24} />}
          onClick={() => navigate('/random-match')}
        />
        <MatchTypeCard
          title="지역 매칭"
          description="지도에서 주변 경기를 직접 확인하고 참가해요."
          icon={<MapPin size={24} />}
          onClick={() => navigate('/local-match')}
        />
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-center gap-2">
          <UsersRound className="text-play-primary" size={18} />
          <h2 className="text-base font-black text-play-ink">모집 중인 채팅방</h2>
        </div>

        <div className="flex flex-col gap-3">
          {chatRooms.map((room) => (
            <article key={room.id} className="flex items-center gap-3 rounded-2xl border border-play-border bg-white p-3 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-play-surface text-xs font-black text-play-primary">
                {room.sport}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-black text-play-ink">{room.title}</h3>
                <p className="mt-1 truncate text-xs font-bold text-play-muted">{room.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] font-bold text-play-muted">{room.time}</span>
                <strong className="text-xs text-play-primary">{room.count}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MatchTypeCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-32 w-full items-center gap-4 rounded-2xl border border-play-border bg-white p-5 text-left shadow-sm transition hover:border-play-primary/40"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-play-primary text-white">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xl font-black text-play-ink">{title}</span>
        <span className="mt-2 block text-sm font-bold leading-6 text-play-muted">{description}</span>
      </span>
    </button>
  );
}
