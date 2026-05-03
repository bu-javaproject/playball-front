import { Link } from 'react-router-dom';

const primaryMenus = [
  { to: '/local-match', title: '지역 매칭', description: '지도에서 가까운 경기를 찾고 바로 참가 신청합니다.' },
  { to: '/random-match', title: '랜덤 매칭', description: '조건을 넣고 맞는 경기를 추천받습니다.' },
  { to: '/matches/new', title: '경기 만들기', description: '시간, 장소, 인원을 정해서 새 경기를 모집합니다.' },
];

const subMenus = [
  { to: '/matches/my', title: '내 경기' },
  { to: '/profile', title: '프로필' },
  { to: '/friends', title: '친구' },
];

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <section className="rounded-[28px] bg-slate-950 px-6 py-8 text-white shadow-xl sm:px-8">
        <p className="text-sm font-bold text-sky-300">PLAYBALL</p>
        <h1 className="mt-3 text-3xl font-black tracking-normal sm:text-4xl">오늘 뛸 사람을 가장 가까운 곳에서 찾기</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
          지역 매칭을 먼저 안정화하고, 같은 API 규칙 위에서 경기 생성, 참가 신청, 내 경기 흐름을 확장합니다.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {primaryMenus.map((menu) => (
          <Link
            key={menu.to}
            to={menu.to}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-black text-slate-950">{menu.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{menu.description}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {subMenus.map((menu) => (
          <Link
            key={menu.to}
            to={menu.to}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-black text-slate-800 shadow-sm transition hover:border-sky-300"
          >
            {menu.title}
          </Link>
        ))}
      </section>
    </div>
  );
}
