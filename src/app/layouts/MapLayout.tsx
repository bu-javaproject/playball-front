import { Outlet } from 'react-router-dom';

export function MapLayout() {
  return (
    <main className="h-screen w-full overflow-hidden bg-play-bg text-play-ink">
      <Outlet />
    </main>
  );
}
