import OptionGroup from './OptionGroup';
import type { RandomMatchRequest } from '../types/randomMatch';

type RandomMatchFormProps = {
  form: RandomMatchRequest;
  onChange: <K extends keyof RandomMatchRequest>(key: K, value: RandomMatchRequest[K]) => void;
  onSubmit: () => void;
};

export default function RandomMatchForm({ form, onChange, onSubmit }: RandomMatchFormProps) {
  return (
    <main className="mx-auto w-full max-w-md">
      <section className="mb-5">
        <h1 className="text-2xl font-black text-slate-950">랜덤 매칭</h1>
        <p className="mt-2 text-sm font-bold text-slate-500">원하는 조건을 선택하면 알맞은 경기를 찾아드려요</p>
      </section>

      <section className="rounded-3xl bg-white p-5 shadow-lg shadow-slate-200">
        <div className="mb-5 grid grid-cols-2 gap-3">
          <label className="col-span-2 flex flex-col gap-2">
            <span className="text-sm font-black text-slate-500">위치</span>
            <input
              value={form.address}
              onChange={(event) => onChange('address', event.target.value)}
              className="input-box"
              placeholder="위치를 입력하세요"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-black text-slate-500">날짜</span>
            <input
              type="date"
              value={form.date}
              onChange={(event) => onChange('date', event.target.value)}
              className="input-box"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-black text-slate-500">포지션</span>
            <input
              value={form.preferredPosition}
              onChange={(event) => onChange('preferredPosition', event.target.value)}
              className="input-box"
              placeholder="ST"
            />
          </label>
        </div>

        <OptionGroup
          title="종목"
          value={form.sportType}
          options={[
            { label: '축구', value: 'SOCCER' },
            { label: '농구', value: 'BASKETBALL' },
            { label: '러닝', value: 'RUNNING' },
            { label: '배드민턴', value: 'BADMINTON' },
          ]}
          onChange={(value) => onChange('sportType', value)}
        />

        <OptionGroup
          title="성별"
          value={form.gender}
          options={[
            { label: '남성', value: 'M' },
            { label: '여성', value: 'F' },
          ]}
          onChange={(value) => onChange('gender', value)}
        />

        <OptionGroup
          title="나이대"
          value={form.ageRange}
          options={[
            { label: '10대', value: 10 },
            { label: '20대', value: 20 },
            { label: '30대', value: 30 },
            { label: '40대+', value: 40 },
          ]}
          onChange={(value) => onChange('ageRange', value)}
        />

        <OptionGroup
          title="실력"
          value={form.skillLevel}
          options={[
            { label: '초보자', value: 1 },
            { label: '아마추어', value: 2 },
            { label: '중급자', value: 3 },
            { label: '고수', value: 4 },
            { label: '프로', value: 5 },
          ]}
          onChange={(value) => onChange('skillLevel', value)}
        />

        <OptionGroup
          title="가격대"
          value={form.maxFee}
          options={[
            { label: '무료', value: 0 },
            { label: '1만원 이하', value: 10000 },
            { label: '3만원 이하', value: 30000 },
            { label: '상관없음', value: 999999 },
          ]}
          onChange={(value) => onChange('maxFee', value)}
        />

        <button
          type="button"
          onClick={onSubmit}
          className="mt-6 h-13 w-full rounded-2xl bg-blue-600 text-base font-black text-white shadow-lg shadow-blue-200"
        >
          매칭 시작하기
        </button>
      </section>
    </main>
  );
}
