import { useNavigate } from 'react-router-dom';

type NewsItem = {
  id: number;
  type: string;
  title: string;
  date: string;
  icon: string;
};

type RecruitItem = {
  id: number;
  sport: string;
  status: '모집중' | '마감';
  title: string;
  location: string;
  time: string;
  current: number;
  max: number;
  color: 'blue' | 'orange';
};

const newsList: NewsItem[] = [
  {
    id: 1,
    type: '공지사항',
    title: '2026 봄 시즌 풋살 리그 참가 신청 시작',
    date: '2026.04.10',
    icon: '🏃',
  },
  {
    id: 2,
    type: '뉴스',
    title: '서울 목동운동장 야외 코트 리모델링 완료',
    date: '2026.04.08',
    icon: '🏟',
  },
];

const recruitList: RecruitItem[] = [
  {
    id: 1,
    sport: '축구',
    status: '모집중',
    title: '백석대 컴공 내기 같이 하실 분!',
    location: '서울 목동운동장',
    time: '오늘 오후 7시',
    current: 7,
    max: 10,
    color: 'blue',
  },
  {
    id: 2,
    sport: '농구',
    status: '마감',
    title: '백석대 버스정류장 앞 3대3 농구',
    location: '백석대 버스정류장 앞',
    time: '오늘 오후 5시',
    current: 5,
    max: 6,
    color: 'orange',
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-4">
      <header className="mb-5 flex h-12 items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="메인페이지로 이동"
          className="flex items-center gap-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
            PB
          </div>
          <span className="text-lg font-black text-blue-600">playball</span>
        </button>

        <div className="flex items-center gap-4 text-lg">
          <span aria-hidden="true">🔔</span>
          <span aria-hidden="true">⚙</span>
        </div>
      </header>

      <section className="mb-6 flex min-h-44 justify-between rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg shadow-blue-200">
        <div>
          <p className="mb-2 text-xs font-bold opacity-90">📍 신부동 기준</p>
          <h1 className="text-2xl font-black leading-tight">
            지금 주변에
            <br />
            경기 5개 열렸어요!
          </h1>
          <p className="mt-2 text-xs opacity-90">내 주변 스포츠 경기를 찾아보세요</p>

          <button
            type="button"
            onClick={() => navigate('/local-match')}
            className="mt-5 rounded-full bg-white px-4 py-2 text-sm font-black text-blue-600"
          >
            지도에서 보기 〉
          </button>
        </div>

        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-4xl">⚽</div>
      </section>

      <section className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950">공지사항 뉴스</h2>
          <button type="button" className="text-xs font-bold text-slate-400">
            더보기 〉
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {newsList.map((news) => (
            <article key={news.id} className="flex overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="flex w-20 items-center justify-center bg-slate-900 text-3xl">{news.icon}</div>

              <div className="flex-1 p-3">
                <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-black text-blue-600">
                  {news.type}
                </span>
                <h3 className="mt-2 text-sm font-black leading-snug text-slate-950">{news.title}</h3>
                <p className="mt-1 text-xs text-slate-400">{news.date}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950">모집 소개글</h2>
          <button type="button" className="text-xs font-bold text-slate-400">
            더보기 〉
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {recruitList.map((item) => {
            const percent = `${(item.current / item.max) * 100}%`;

            return (
              <article key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black text-white ${
                        item.color === 'blue' ? 'bg-blue-600' : 'bg-orange-500'
                      }`}
                    >
                      {item.sport}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black ${
                        item.status === '마감' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <span className="text-xs font-black text-slate-400">
                    {item.current}/{item.max}명
                  </span>
                </div>

                <h3 className="mt-4 text-sm font-black text-slate-950">{item.title}</h3>

                <p className="mt-2 flex gap-3 text-xs text-slate-500">
                  <span>📍 {item.location}</span>
                  <span>{item.time}</span>
                </p>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${item.color === 'blue' ? 'bg-blue-600' : 'bg-red-500'}`}
                    style={{ width: percent }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
