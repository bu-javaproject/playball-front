import { Outlet } from 'react-router-dom';

import BottomNav from '@/components/BottomNav';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-200 text-slate-950">
      <main className="mx-auto min-h-screen max-w-screen-sm bg-slate-50 pb-20">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
