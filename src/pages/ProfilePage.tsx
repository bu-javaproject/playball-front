import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Activity,
  CalendarDays,
  ChevronRight,
  Heart,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  ThumbsUp,
  Trophy,
  UserRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { useAuth } from '@/app/providers/AuthContext';
import { logout as requestLogout } from '@/features/auth/api/authApi';
import { getKakaoAuthorizeUrl } from '@/features/auth/utils/kakaoAuth';
import { shouldUseMemberMock } from '@/features/members/api/memberApi';
import { useMyProfile, useUpdateMyProfile } from '@/features/members/hooks/useMyProfile';
import type { Gender, MyProfile, ProfileEditRequest } from '@/features/members/types/member';
import { ApiError } from '@/shared/api/errors';

const ACCENT = '#060080';

const sportLabel: Record<string, string> = {
  SOCCER: '축구',
  BASKETBALL: '농구',
  RUNNING: '러닝',
  BADMINTON: '배드민턴',
};

const sportOptions = [
  { value: 'SOCCER', label: '축구' },
  { value: 'BASKETBALL', label: '농구' },
  { value: 'RUNNING', label: '러닝' },
  { value: 'BADMINTON', label: '배드민턴' },

];

const genderLabel: Record<Gender, string> = {
  M: '남',
  F: '여',
};

function formatGender(gender?: Gender) {
  return gender ? genderLabel[gender] : '미설정';
}

function formatAddress(address?: string) {
  return address || '지역 미설정';
}

function DefaultPersonIcon() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true" className="h-24 w-24">
      <circle cx="48" cy="48" r="48" fill="#f4f4ff" />
      <circle cx="48" cy="36" r="15" fill={ACCENT} opacity="0.9" />
      <path d="M22 78c4.5-15.5 16-24 26-24s21.5 8.5 26 24" fill={ACCENT} opacity="0.9" />
    </svg>
  );
}

function SmallIcon({ icon: Icon, danger = false }: { icon: LucideIcon; danger?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-9 w-9 items-center justify-center text-2xl font-black ${
        danger ? 'text-red-500' : 'text-[#060080]'
      }`}
    >
      <Icon className="h-7 w-7" strokeWidth={2.3} />
    </span>
  );
}

function TopHeader() {
  return (
    <header>
      <h1 className="text-[30px] font-black tracking-tight text-[#060080]">프로필</h1>
    </header>
  );
}

function ProfilePhoto({ profile }: { profile: MyProfile }) {
  return (
    <div className="mx-auto mt-8 h-40 w-40">
      <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border-[6px] border-white bg-slate-100 shadow-xl">
        {profile.profileImage ? (
          <img src={profile.profileImage} alt="프로필 이미지" className="h-full w-full object-cover" />
        ) : (
          <DefaultPersonIcon />
        )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-h-32 flex-1 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <SmallIcon icon={icon} />
      <span className="mt-2 text-sm font-bold text-slate-400">{label}</span>
      <strong className="mt-1 text-xl font-black text-slate-950">{value}</strong>
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: LucideIcon; value: string | number; label: string }) {
  return (
    <div className="flex min-h-28 flex-1 items-center justify-center gap-4 rounded-3xl border border-slate-200 bg-white px-4 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <SmallIcon icon={icon} />
      <div>
        <strong className="block text-3xl font-black leading-none text-slate-950">{value}</strong>
        <span className="mt-2 block text-base font-bold text-slate-400">{label}</span>
      </div>
    </div>
  );
}

function FavoriteSports({ sports }: { sports: string[] }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <SmallIcon icon={Heart} />
        <h2 className="text-xl font-bold text-slate-950">선호 운동</h2>
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        {sports.length > 0 ? (
          sports.map((sport) => (
            <span
              key={sport}
              className="rounded-full border border-[#c8caff] bg-[#f7f7ff] px-5 py-2 text-lg font-bold text-[#060080]"
            >
              #{sportLabel[sport] ?? sport}
            </span>
          ))
        ) : (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-bold text-slate-400">
            미설정
          </span>
        )}
      </div>
    </section>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <label className="text-sm font-black text-slate-600">{children}</label>;
}

function ProfileEditModal({
  profile,
  isSaving,
  onClose,
  onSubmit,
}: {
  profile: MyProfile;
  isSaving: boolean;
  onClose: () => void;
  onSubmit: (payload: ProfileEditRequest) => void;
}) {
  const [nickname, setNickname] = useState(profile.nickname);
  const [address, setAddress] = useState(profile.address ?? '');
  const [favoriteSports, setFavoriteSports] = useState(profile.favoriteSports ?? []);

  const toggleSport = (sport: string) => {
    setFavoriteSports((current) =>
      current.includes(sport) ? current.filter((item) => item !== sport) : [...current, sport],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      nickname: nickname.trim(),
      address: address.trim(),
      favoriteSports,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-5">
      <form
        onSubmit={handleSubmit}
        className="max-h-[calc(100vh-40px)] w-full max-w-[620px] overflow-y-auto rounded-3xl bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.22)]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-950">프로필 편집</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-500 active:scale-95"
            aria-label="닫기"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="space-y-2">
            <FieldLabel>닉네임</FieldLabel>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              maxLength={10}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-bold outline-none focus:border-[#060080] focus:bg-white"
              placeholder="닉네임"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>지역</FieldLabel>
            <input
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="h-13 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-base font-bold outline-none focus:border-[#060080] focus:bg-white"
              placeholder="예: 천안, 신부동"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel>선호 운동</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {sportOptions.map((sport) => {
                const selected = favoriteSports.includes(sport.value);

                return (
                  <button
                    key={sport.value}
                    type="button"
                    onClick={() => toggleSport(sport.value)}
                    className={`rounded-full border px-4 py-2 text-sm font-black ${
                      selected
                        ? 'border-[#060080] bg-[#060080] text-white'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                    }`}
                  >
                    #{sport.label}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        <button
          type="submit"
          disabled={isSaving || !nickname.trim()}
          className="mt-6 h-14 w-full rounded-2xl bg-[#060080] text-lg font-black text-white shadow-lg shadow-indigo-950/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
      </form>
    </div>
  );
}

function LogoutConfirmModal({
  isLoggingOut,
  onCancel,
  onConfirm,
}: {
  isLoggingOut: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-5">
      <section className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-[0_20px_60px_rgba(15,23,42,0.22)]">
        <h2 className="text-2xl font-black text-slate-950">로그아웃 하시겠습니까?</h2>
        <div className="mt-7 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoggingOut}
            className="h-13 rounded-2xl bg-slate-100 text-base font-black text-slate-600 active:scale-95 disabled:opacity-60"
          >
            아니오
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="h-13 rounded-2xl bg-red-500 text-base font-black text-white shadow-lg shadow-red-200 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLoggingOut ? '처리 중...' : '네'}
          </button>
        </div>
      </section>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-20 w-full items-center border-b border-slate-200 bg-white px-5 text-left last:border-b-0 active:bg-slate-50"
    >
      <SmallIcon icon={icon} danger={danger} />
      <span className={`ml-4 text-xl font-bold ${danger ? 'text-red-500' : 'text-slate-950'}`}>{label}</span>
      <ChevronRight className="ml-auto h-7 w-7 text-slate-400" />
    </button>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-5 py-6">
      <section className="mx-auto w-full max-w-[620px]">
        <div className="h-10 w-44 rounded-2xl bg-slate-100" />
        <div className="mx-auto mt-8 h-40 w-40 rounded-full bg-slate-100" />
        <div className="mx-auto mt-8 h-10 w-36 rounded-2xl bg-slate-100" />
        <div className="mt-8 grid grid-cols-3 gap-5">
          <div className="h-32 rounded-3xl bg-slate-100" />
          <div className="h-32 rounded-3xl bg-slate-100" />
          <div className="h-32 rounded-3xl bg-slate-100" />
        </div>
      </section>
    </div>
  );
}

function GuestProfile() {
  const handleKakaoLogin = () => {
    try {
      window.location.href = getKakaoAuthorizeUrl();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : '카카오 로그인 설정을 확인해주세요.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-5 py-6">
      <section className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-[620px] flex-col">
        <TopHeader />
        <div className="flex flex-1 flex-col items-center justify-center pb-24">
          <DefaultPersonIcon />
          <p className="mt-8 text-center text-2xl font-black leading-9 text-slate-950">
            로그인하고
            <br />
            매칭을 시작해보세요!
          </p>
          <button
            type="button"
            onClick={handleKakaoLogin}
            className="mt-8 h-14 w-full rounded-2xl bg-[#FEE500] text-lg font-black text-[#191919] shadow-lg shadow-yellow-200/70"
          >
            카카오로 시작하기
          </button>
        </div>
      </section>
    </div>
  );
}

function ProfileContent({
  profile,
  isLoggingOut,
  onLogout,
}: {
  profile: MyProfile;
  isLoggingOut: boolean;
  onLogout: () => void;
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const updateProfileMutation = useUpdateMyProfile();
  const stats = profile.stats ?? {
    participationCount: 0,
    hostCount: 0,
    attendanceRate: 0,
  };

  const handleSubmitProfile = (payload: ProfileEditRequest) => {
    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        setIsEditOpen(false);
      },
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-5 py-6">
      <section className="mx-auto w-full max-w-[620px]">
        <TopHeader />
        <ProfilePhoto profile={profile} />

        <div className="mt-7 text-center">
          <h2 className="text-5xl font-black tracking-tight text-slate-950">{profile.nickname}</h2>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-5">
          <InfoCard icon={UserRound} label="성별" value={formatGender(profile.gender)} />
          <InfoCard icon={CalendarDays} label="나이" value={profile.age ? `${profile.age}세` : '미설정'} />
          <InfoCard icon={MapPin} label="지역" value={formatAddress(profile.address)} />
        </div>

        <div className="mt-6">
          <FavoriteSports sports={profile.favoriteSports ?? []} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-5">
          <StatCard icon={Trophy} value={stats.participationCount} label="경기수" />
          <StatCard icon={ThumbsUp} value={profile.recommendCount ?? 0} label="추천수" />
          <StatCard icon={Activity} value={`${stats.attendanceRate}%`} label="참여율" />
        </div>

        <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
          <MenuRow icon={Pencil} label="프로필 편집" onClick={() => setIsEditOpen(true)} />
          <MenuRow icon={Settings} label="설정" />
          <MenuRow icon={LogOut} label="로그아웃" danger onClick={() => setIsLogoutConfirmOpen(true)} />
        </section>
      </section>
      {isEditOpen ? (
        <ProfileEditModal
          profile={profile}
          isSaving={updateProfileMutation.isPending}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleSubmitProfile}
        />
      ) : null}
      {isLogoutConfirmOpen ? (
        <LogoutConfirmModal
          isLoggingOut={isLoggingOut}
          onCancel={() => setIsLogoutConfirmOpen(false)}
          onConfirm={onLogout}
        />
      ) : null}
    </div>
  );
}

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const canLoadProfile = isAuthenticated || shouldUseMemberMock;
  const profileQuery = useMyProfile(canLoadProfile);

  const handleLogout = () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    requestLogout()
      .catch(() => undefined)
      .finally(() => {
        logout();
        setIsLoggingOut(false);
      });
  };

  useEffect(() => {
    if (profileQuery.error instanceof ApiError && profileQuery.error.status === 401) {
      logout();
    }
  }, [logout, profileQuery.error]);

  if (!canLoadProfile) {
    return <GuestProfile />;
  }

  if (profileQuery.isLoading) {
    return <ProfileSkeleton />;
  }

  if (profileQuery.isError || !profileQuery.data) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-5 py-6">
        <section className="mx-auto w-full max-w-[620px]">
          <TopHeader />
          <div className="mt-8 rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-bold leading-6 text-red-600">
            프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 h-12 rounded-2xl bg-slate-900 px-5 text-sm font-black text-white"
          >
            로그인 화면으로 돌아가기
          </button>
        </section>
      </div>
    );
  }

  return <ProfileContent profile={profileQuery.data} isLoggingOut={isLoggingOut} onLogout={handleLogout} />;
}
