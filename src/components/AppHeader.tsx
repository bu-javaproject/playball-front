import { Bell, ChevronLeft, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showBell?: boolean;
  showSettings?: boolean;
}

export default function AppHeader({
  title,
  subtitle,
  showBack = false,
  showBell = false,
  showSettings = false,
}: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 -mx-4 mb-5 border-b border-play-border/80 bg-white/95 px-4 py-3 backdrop-blur">
      <div className="flex h-11 items-center justify-between">
        <div className="flex min-w-0 items-center gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="뒤로 가기"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-play-surface text-play-ink"
            >
              <ChevronLeft size={22} />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="홈으로 이동"
              className="flex shrink-0 items-center gap-2"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-play-primary text-xs font-black text-white">
                PB
              </span>
              <span className="text-lg font-black text-play-primary">playball</span>
            </button>
          )}

          {title ? (
            <div className="min-w-0">
              <h1 className="truncate text-xl font-black text-play-ink">{title}</h1>
              {subtitle ? <p className="truncate text-xs font-bold text-play-muted">{subtitle}</p> : null}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {showBell ? (
            <button
              type="button"
              aria-label="알림"
              className="grid h-10 w-10 place-items-center rounded-full bg-play-surface text-play-ink"
            >
              <Bell size={19} />
            </button>
          ) : null}
          {showSettings ? (
            <button
              type="button"
              aria-label="설정"
              className="grid h-10 w-10 place-items-center rounded-full bg-play-surface text-play-ink"
            >
              <Settings size={19} />
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
