import { CalendarDays, MapPin, UsersRound, Wallet } from 'lucide-react';
import type { ReactNode } from 'react';

import { sportLabel } from '@/features/local-match/utils/matchFormat';

import type { RandomMatchedGame } from '../types/randomMatch';

type RandomMatchFoundCardProps = {
  matchedGame: RandomMatchedGame;
  onAccept: () => void;
  onReject: () => void;
};

export default function RandomMatchFoundCard({
  matchedGame,
  onAccept,
  onReject,
}: RandomMatchFoundCardProps) {
  const entryFee = matchedGame.entryFee && matchedGame.entryFee > 0 ? `${matchedGame.entryFee.toLocaleString()}원` : '무료';

  return (
    <main className="mx-auto flex min-h-[calc(100vh-156px)] w-full max-w-md items-center">
      <section className="w-full overflow-hidden rounded-2xl border border-play-border bg-white shadow-sm">
        <div className="bg-play-primary p-5 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">
            {sportLabel[matchedGame.sportType]} 경기 발견
          </span>
          <h2 className="mt-5 text-2xl font-black leading-tight">{matchedGame.title}</h2>
          <p className="mt-2 text-sm font-bold text-white/75">{matchedGame.distance.toFixed(1)}km 거리의 추천 경기입니다.</p>
        </div>

        <div className="space-y-3 p-5 text-sm font-bold text-play-muted">
          <InfoRow icon={<MapPin size={18} />} label="장소" value={matchedGame.locationName} />
          <InfoRow icon={<CalendarDays size={18} />} label="시간" value={matchedGame.matchDate} />
          <InfoRow
            icon={<UsersRound size={18} />}
            label="인원"
            value={`${matchedGame.currentPlayers}/${matchedGame.maxPlayers}명`}
          />
          <InfoRow icon={<Wallet size={18} />} label="참가비" value={entryFee} />

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onReject}
              className="h-12 rounded-xl bg-play-surface text-sm font-black text-play-muted"
            >
              거절
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="h-12 rounded-xl bg-play-primary text-sm font-black text-white shadow-sm"
            >
              수락
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-play-surface px-4 py-3">
      <span className="text-play-primary">{icon}</span>
      <span className="w-14 shrink-0 text-xs font-black text-play-muted">{label}</span>
      <span className="min-w-0 flex-1 break-keep text-sm font-black text-play-ink">{value}</span>
    </div>
  );
}
