import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { Medal, ThumbsUp, UserRound, X } from 'lucide-react';

import type { ComplimentTag, PublicMemberProfile } from '../types/myMatch';
import { complimentTagLabel, getInitial } from '../utils/myMatchFormat';

const complimentTags = Object.entries(complimentTagLabel) as Array<[ComplimentTag, string]>;

interface PlayerProfileModalProps {
  profile: PublicMemberProfile | undefined;
  isLoading: boolean;
  canPraise: boolean;
  isSubmittingPraise: boolean;
  isPraiseCompleted: boolean;
  onClose: () => void;
  onPraiseSubmit: (tag: ComplimentTag) => void;
}

export function PlayerProfileModal({
  profile,
  isLoading,
  canPraise,
  isSubmittingPraise,
  isPraiseCompleted,
  onClose,
  onPraiseSubmit,
}: PlayerProfileModalProps) {
  const [selectedTag, setSelectedTag] = useState<ComplimentTag | null>(null);
  const canSubmitPraise = canPraise && Boolean(profile) && Boolean(selectedTag) && !isSubmittingPraise && !isPraiseCompleted;
  const praiseGuide = useMemo(() => {
    if (isPraiseCompleted) {
      return '이미 칭찬을 보낸 플레이어입니다.';
    }

    if (canPraise) {
      return '같이 뛴 플레이어에게 어울리는 칭찬 하나를 골라주세요.';
    }

    return '종료된 경기에서 칭찬할 수 있습니다.';
  }, [canPraise, isPraiseCompleted]);

  function selectTag(tag: ComplimentTag) {
    setSelectedTag((current) => (current === tag ? null : tag));
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/45 px-5">
      <section className="max-h-[88vh] w-full max-w-sm overflow-y-auto rounded-[28px] bg-white shadow-2xl">
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

        <div className="border-t border-slate-100 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="text-base font-black text-slate-950">칭찬하기</h4>
              <p className="mt-1 text-xs font-bold leading-5 text-slate-500">{praiseGuide}</p>
            </div>
            {isPraiseCompleted ? <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500">칭찬 완료</span> : null}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {complimentTags.map(([tag, label]) => {
              const isSelected = selectedTag === tag;

              return (
                <button
                  key={tag}
                  type="button"
                  disabled={!canPraise || !profile || isPraiseCompleted}
                  onClick={() => selectTag(tag)}
                  className={`min-h-11 rounded-2xl border px-2 text-sm font-black transition disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-300 ${
                    isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            disabled={!canSubmitPraise}
            onClick={() => selectedTag && onPraiseSubmit(selectedTag)}
            className="mt-4 h-12 w-full rounded-2xl bg-blue-600 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            {isPraiseCompleted ? '이미 칭찬한 플레이어입니다' : isSubmittingPraise ? '보내는 중' : '칭찬 보내기'}
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
