import { MapPin, Megaphone, Newspaper } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import AppHeader from '@/components/AppHeader';

const newsList = [
  {
    id: 1,
    type: '공지',
    title: '봄 시즌 동네 리그 참가 신청이 시작됐어요',
    date: '2026.04.10',
  },
  {
    id: 2,
    type: '뉴스',
    title: '천안 주요 야외 코트 정비가 완료됐어요',
    date: '2026.04.08',
  },
];

const recruitList = [
  {
    id: 1,
    sport: '축구',
    status: '모집 중',
    title: '백석대 근처 풋살 같이 하실 분',
    location: '천안 동남구',
    time: '오늘 오후 7시',
    current: 7,
    max: 10,
  },
  {
    id: 2,
    sport: '농구',
    status: '마감 임박',
    title: '3대3 농구 한 게임 뛰실 분',
    location: '백석대 버스정류장 앞',
    time: '오늘 오후 5시',
    current: 5,
    max: 6,
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-play-surface px-4 pb-6">
      <AppHeader showBell />

      <section className="mb-6 rounded-2xl bg-play-primary p-5 text-white shadow-sm">
        <p className="mb-2 text-xs font-black text-white/75">내 주변 경기</p>
        <h1 className="text-2xl font-black leading-tight">
          지금 가까운 곳에서
          <br />
          함께 뛸 경기를 찾아보세요
        </h1>
        <p className="mt-3 text-sm font-bold text-white/75">지도에서 모집 중인 경기를 바로 확인할 수 있어요.</p>

        <button
          type="button"
          onClick={() => navigate('/local-match')}
          className="mt-5 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-black text-play-primary"
        >
          <MapPin size={17} />
          지도에서 보기
        </button>
      </section>

      <section className="mb-6">
        <SectionTitle icon={<Newspaper size={18} />} title="공지사항 뉴스" />
        <div className="mt-3 flex flex-col gap-3">
          {newsList.map((news) => (
            <article key={news.id} className="flex gap-3 rounded-2xl border border-play-border bg-white p-4 shadow-sm">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-play-surface text-play-primary">
                <Megaphone size={20} />
              </span>
              <div className="min-w-0">
                <span className="rounded-full bg-play-surface px-2 py-1 text-[11px] font-black text-play-primary">
                  {news.type}
                </span>
                <h3 className="mt-2 text-sm font-black leading-snug text-play-ink">{news.title}</h3>
                <p className="mt-1 text-xs font-bold text-play-muted">{news.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="모집 소개글" />
        <div className="mt-3 flex flex-col gap-3">
          {recruitList.map((item) => {
            const percent = `${(item.current / item.max) * 100}%`;

            return (
              <article key={item.id} className="rounded-2xl border border-play-border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 gap-2">
                    <span className="rounded-full bg-play-primary px-3 py-1 text-xs font-black text-white">
                      {item.sport}
                    </span>
                    <span className="rounded-full bg-play-surface px-3 py-1 text-xs font-black text-play-primary">
                      {item.status}
                    </span>
                  </div>
                  <span className="shrink-0 text-xs font-black text-play-muted">
                    {item.current}/{item.max}명
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-black text-play-ink">{item.title}</h3>
                <p className="mt-2 text-xs font-bold text-play-muted">
                  {item.location} · {item.time}
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-play-surface">
                  <div className="h-full rounded-full bg-play-primary" style={{ width: percent }} />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon?: ReactNode; title: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon ? <span className="text-play-primary">{icon}</span> : null}
        <h2 className="text-base font-black text-play-ink">{title}</h2>
      </div>
      <button type="button" className="text-xs font-black text-play-muted">
        더보기
      </button>
    </div>
  );
}
