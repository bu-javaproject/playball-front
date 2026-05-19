import type { ReactNode } from 'react';
import { CalendarDays, Clock3, MapPin, Shield, UsersRound, Wallet, X } from 'lucide-react';

import type { MatchDetail } from '../types/myMatch';
import { formatDateOnly, formatTimeOnly, skillLabel, sportIcon, sportLabel, statusLabel } from '../utils/myMatchFormat';

interface MatchDetailSheetProps {
  match: MatchDetail | undefined;
  isLoading: boolean;
  onClose: () => void;
}

export function MatchDetailSheet({ match, isLoading, onClose }: MatchDetailSheetProps) {
  return (
    <div className="fixed inset-0 z-[72] grid place-items-center bg-slate-950/35 px-4 py-6">
      <section className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-play-border bg-white px-6 py-5">
          <div>
            <h2 className="text-2xl font-black text-play-ink">경기 세부내역</h2>
            <p className="mt-1 text-sm font-bold text-play-muted">주소, 시간, 인원, 공지 확인</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-12 w-12 place-items-center rounded-full bg-play-surface text-play-ink">
            <X size={24} />
          </button>
        </header>

        <div className="max-h-[calc(90vh-89px)] overflow-y-auto px-6 py-6">
          {isLoading ? (
            <div className="text-sm font-bold text-play-muted">경기 정보를 불러오는 중입니다.</div>
          ) : match ? (
            <div className="space-y-5">
              <div className="rounded-2xl bg-play-primary p-6 text-white">
                <div className="mb-9 flex items-center justify-between">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">
                    {sportIcon[match.sportType]} {sportLabel[match.sportType]}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black">{statusLabel[match.status]}</span>
                </div>
                <h3 className="text-3xl font-black">{match.title}</h3>
                <p className="mt-3 text-sm font-bold text-white/75">주최자 {match.creatorNickname}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DetailBox icon={<CalendarDays size={20} />} label="날짜" value={formatDateOnly(match.matchDate)} />
                <DetailBox icon={<Clock3 size={20} />} label="시간" value={formatTimeOnly(match.matchDate)} />
                <DetailBox icon={<UsersRound size={20} />} label="인원" value={`${match.currentPlayers}/${match.maxPlayers}명`} />
                <DetailBox icon={<Wallet size={20} />} label="참가비" value={match.entryFee > 0 ? `${match.entryFee.toLocaleString()}원` : '무료'} />
                <DetailBox icon={<Shield size={20} />} label="실력" value={match.skillLevel ? skillLabel[match.skillLevel] : '무관'} />
                <DetailBox icon={<MapPin size={20} />} label="장소" value={match.locationName} />
              </div>

              <InfoBlock title="정확한 주소" content={match.address ?? match.locationName} />
              <InfoBlock title="요구사항 / 공지" content={match.description || '등록된 요구사항이 없습니다.'} />
            </div>
          ) : (
            <div className="text-sm font-bold text-play-muted">경기 정보를 찾을 수 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
}

function DetailBox({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-24 gap-3 rounded-xl bg-play-surface p-4">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-play-primary">{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-black text-play-muted">{label}</span>
        <span className="mt-1 block break-keep text-sm font-black text-play-ink">{value}</span>
      </span>
    </div>
  );
}

function InfoBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="rounded-xl bg-play-surface p-4">
      <p className="text-xs font-black text-play-muted">{title}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-6 text-play-ink">{content}</p>
    </div>
  );
}