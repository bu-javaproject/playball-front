import { Link, Outlet } from 'react-router-dom';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-play-bg text-play-ink">
      <header className="sticky top-0 z-40 border-b border-play-border bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
          <Link to="/" className="text-base font-black text-play-primary">PLAYBALL</Link>
          <nav className="flex items-center gap-3 text-sm font-bold text-play-muted">
            <Link to="/local-match">지역 매칭</Link>
            <Link to="/matches/my">내 경기</Link>
            <Link to="/profile">프로필</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto min-h-[calc(100vh-56px)] max-w-screen-sm bg-white">
        <Outlet />
      </main>
    </div>
  );
}
