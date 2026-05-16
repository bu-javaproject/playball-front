import type { ReactNode } from 'react';
import { Medal, ThumbsUp, UserRound, X } from 'lucide-react';

import type { PublicMemberProfile } from '../types/myMatch';
import { getInitial } from '../utils/myMatchFormat';

interface PlayerProfileModalProps {
  profile: PublicMemberProfile | undefined;
  isLoading: boolean;
  canPraise: boolean;
  onClose: () => void;
  onPraise: () => void;
}

export function PlayerProfileModal({ profile, isLoading, canPraise, onClose, onPraise }: PlayerProfileModalProps) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 px-5">
      <section className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div className="relative bg-gradient-to-br from-blue-800 via-indigo-900 to-fuchsia-800 px-6 pb-8 pt-10 text-center text-white">
          <button type="button" onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/15">
            <X size={20} />
          </button>

          {isLoading ? (
            <div className="py-14 text-sm font-bold text-white/80">프로필을 불러오는 중입니다.</div>
          ) : profile ? (
            <>
              <div className="mx-auto grid h-28 w-28 place-items-center overflow-hidden rounded-full border-4 border-white bg-blue-100 text-4xl font-black text-blue-700">
                {profile.profileImage ? <img src={profile.profileImage} alt="" className="h-full w-full object-cover" /> : getInitial(profile.nickname)}
              </div>
              <h3 className="mt-5 text-3xl font-black">{profile.nickname}</h3>
              <p className="mt-2 text-sm font-bold text-white/75">
                {profile.gender === 'M' ? '남' : profile.gender === 'F' ? '여' : '성별 미공개'}
                {profile.age ? ` · ${profile.age}세` : ''}
                {profile.address ? ` · ${profile.address}` : ''}
              </p>
            </>
          ) : (
            <div className="py-14 text-sm font-bold text-white/80">프로필 정보를 찾을 수 없습니다.</div>
          )}
        </div>

        {profile ? (
          <div className="grid grid-cols-3 divide-x divide-slate-100">
            <ProfileStat icon={<UserRound size={24} />} label="주 종목" value={profile.favoriteSports?.[0] ?? '-'} />
            <ProfileStat icon={<Medal size={24} />} label="실력" value={profile.skillLevel ?? '-'} />
            <ProfileStat icon={<ThumbsUp size={24} />} label="추천" value={`${profile.recommendCount ?? 0}`} />
          </div>
        ) : null}

        <div className="p-5">
          <button
            type="button"
            disabled={!canPraise || !profile}
            onClick={onPraise}
            className="h-12 w-full rounded-2xl bg-blue-600 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            {canPraise ? '칭찬하기' : '종료된 경기에서 칭찬 가능'}
          </button>
        </div>
      </section>
    </div>
  );
}

interface ProfileStatProps {
  icon: ReactNode;
  label: string;
  value: string;
}

function ProfileStat({ icon, label, value }: ProfileStatProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-2 py-5 text-center">
      <span className="text-blue-700">{icon}</span>
      <span className="text-xs font-bold text-slate-400">{label}</span>
      <span className="max-w-full truncate text-sm font-black text-slate-950">{value}</span>
    </div>
  );
}
