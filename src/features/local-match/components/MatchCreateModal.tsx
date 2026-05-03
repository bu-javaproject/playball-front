import { useState, type FormEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { Modal } from '@/shared/ui/Modal';
import type { MapCenter, MatchCreateRequest, SkillLevel, SportType } from '../types/match';
import { skillLevelLabel, sportLabel } from '../utils/matchFormat';

interface MatchCreateModalProps {
  open: boolean;
  center: MapCenter | null;
  onClose: () => void;
  onCreate: (payload: MatchCreateRequest) => void;
  isCreating?: boolean;
}

const sportOptions: Array<{ value: SportType; label: string }> = [
  { value: 'SOCCER', label: sportLabel.SOCCER },
  { value: 'BASKETBALL', label: sportLabel.BASKETBALL },
  { value: 'RUNNING', label: sportLabel.RUNNING },
  { value: 'BADMINTON', label: sportLabel.BADMINTON },
];

const skillLevelOptions: Array<{ value: SkillLevel; label: string }> = [
  { value: 'BEGINNER', label: skillLevelLabel.BEGINNER },
  { value: 'INTERMEDIATE', label: skillLevelLabel.INTERMEDIATE },
  { value: 'ADVANCED', label: skillLevelLabel.ADVANCED },
];

function toApiDateTime(value: string) {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
}

export default function MatchCreateModal({ open, center, onClose, onCreate, isCreating = false }: MatchCreateModalProps) {
  const [title, setTitle] = useState('');
  const [sportType, setSportType] = useState<SportType>('SOCCER');
  const [matchDate, setMatchDate] = useState('');
  const [locationName, setLocationName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>('BEGINNER');
  const [entryFee, setEntryFee] = useState(0);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!center) return;
    onCreate({ title, sportType, matchDate: toApiDateTime(matchDate), locationName, latitude: center.latitude, longitude: center.longitude, address, maxPlayers, skillLevel, entryFee, description });
  };

  return (
    <Modal open={open}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center text-xl font-black text-gray-950">경기 생성</h2>
        <p className="mt-2 text-center text-xs font-bold text-gray-500">현재 지도 중심 좌표에 경기를 생성합니다.</p>
        <div className="mt-6 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">제목</span><input required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 중앙공원 풋살 모집" className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">종목</span><select value={sportType} onChange={(event) => setSportType(event.target.value as SportType)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary">{sportOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">경기 일시</span><input required type="datetime-local" value={matchDate} onChange={(event) => setMatchDate(event.target.value)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">장소명</span><input required value={locationName} onChange={(event) => setLocationName(event.target.value)} placeholder="예: 중앙공원 풋살장" className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">주소</span><input value={address} onChange={(event) => setAddress(event.target.value)} placeholder="예: 경기 안산시 단원구" className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">최대 인원</span><input required min={2} max={30} type="number" value={maxPlayers} onChange={(event) => setMaxPlayers(Number(event.target.value))} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">실력</span><select value={skillLevel} onChange={(event) => setSkillLevel(event.target.value as SkillLevel)} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary">{skillLevelOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">참가비</span><input required min={0} type="number" value={entryFee} onChange={(event) => setEntryFee(Number(event.target.value))} className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 outline-none focus:border-play-primary" /></label>
          <label className="block"><span className="mb-2 block text-sm font-bold text-gray-700">공지 메시지</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="예: 초보 환영, 운동화 지참" className="h-24 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-play-primary" /></label>
        </div>
        {!center && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">지도 중심 좌표를 아직 확인하지 못했습니다.</p>}
        <div className="mt-6 flex gap-3"><Button type="button" variant="secondary" onClick={onClose} className="flex-1">취소</Button><Button type="submit" disabled={!center || isCreating} className="flex-1">{isCreating ? '생성 중' : '생성'}</Button></div>
      </form>
    </Modal>
  );
}
