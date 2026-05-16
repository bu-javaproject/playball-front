import { useNavigate } from 'react-router-dom';

type ChatRoom = {
  id: number;
  icon: string;
  title: string;
  description: string;
  time: string;
  count: string;
  color: string;
};

const chatRooms: ChatRoom[] = [
  {
    id: 1,
    icon: '축',
    title: '강남구 5:5 풋살 하실 분',
    description: '실력 상관없이 즐겁게 뛰실 분들 오세요',
    time: '20:00',
    count: '8/10',
    color: 'bg-blue-600 text-white',
  },
  {
    id: 2,
    icon: '농',
    title: '신부동 농구 3대3 게임',
    description: '가볍게 한 게임 같이 하실 분',
    time: '18:10',
    count: '4/6',
    color: 'bg-orange-500 text-white',
  },
  {
    id: 3,
    icon: '런',
    title: '천호천 러닝 페이스 맞춰요',
    description: '초보 환영, 5km 천천히 달려요',
    time: '13:00',
    count: '3/8',
    color: 'bg-green-100 text-green-700',
  },
];

export default function MatchingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-4">
      <header className="mb-6 flex h-12 items-center justify-between">
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
      </header>

      <section className="mb-7">
        <h1 className="text-2xl font-black text-slate-950">매칭</h1>
        <p className="mt-2 text-sm font-bold text-slate-500">원하는 방식으로 경기를 찾아보세요</p>
      </section>

      <section
        role="button"
        tabIndex={0}
        onClick={() => navigate('/random-match')}
        onKeyDown={(event) => {
          if (event.key === 'Enter') navigate('/random-match');
        }}
        className="mb-4 flex min-h-40 cursor-pointer justify-between rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white shadow-lg shadow-blue-200"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-black">
              랜
            </div>
            <h2 className="text-xl font-black">랜덤 매칭</h2>
          </div>

          <p className="mt-6 text-sm font-bold leading-relaxed">
            조건을 설정하면
            <br />
            나에게 맞는 경기를 찾아드려요
          </p>

          <p className="mt-5 text-sm font-black">매칭 시작하기 〉</p>
        </div>

        <div className="pt-2 text-5xl">⚾</div>
      </section>

      <section
        role="button"
        tabIndex={0}
        onClick={() => navigate('/local-match')}
        onKeyDown={(event) => {
          if (event.key === 'Enter') navigate('/local-match');
        }}
        className="mb-7 flex min-h-40 cursor-pointer justify-between rounded-2xl bg-gradient-to-br from-green-600 to-emerald-800 p-5 text-white shadow-lg shadow-green-200"
      >
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-black">
              지
            </div>
            <h2 className="text-xl font-black">지역 매칭</h2>
          </div>

          <p className="mt-6 text-sm font-bold leading-relaxed">
            지도에서 주변 경기를
            <br />
            직접 확인하고 참가해보세요
          </p>

          <p className="mt-5 text-sm font-black">지도에서 보기 〉</p>
        </div>

        <div className="pt-2 text-5xl">📍</div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-black text-slate-950">모집 중인 채팅방</h2>
          <button type="button" className="text-xs font-bold text-slate-400">
            더보기 〉
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {chatRooms.map((room) => (
            <article key={room.id} className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black ${room.color}`}>
                {room.icon}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-black text-slate-950">{room.title}</h3>
                <p className="mt-1 truncate text-xs font-bold text-slate-500">{room.description}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className="text-[11px] text-slate-400">{room.time}</span>
                <strong className="text-xs text-blue-600">{room.count}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
