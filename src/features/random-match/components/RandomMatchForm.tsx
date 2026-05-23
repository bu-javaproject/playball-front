import { useState } from 'react';

import OptionGroup from './OptionGroup';
import type { RandomMatchRequest } from '../types/randomMatch';

type RandomMatchFormProps = {
  form: RandomMatchRequest;
  onChange: <K extends keyof RandomMatchRequest>(key: K, value: RandomMatchRequest[K]) => void;
  onSubmit: () => void;
};

export default function RandomMatchForm({ form, onChange, onSubmit }: RandomMatchFormProps) {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col">
      <section className="flex min-h-[calc(100vh-156px)] flex-col rounded-2xl border border-play-border bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black text-play-primary">STEP {step} / 2</p>
            <h2 className="mt-1 text-xl font-black text-play-ink">
              {step === 1 ? '기준 조건을 정해주세요' : '상대 조건을 정해주세요'}
            </h2>
          </div>

          <div className="flex gap-1.5">
            <span className={`h-2 w-7 rounded-full ${step === 1 ? 'bg-play-primary' : 'bg-play-border'}`} />
            <span className={`h-2 w-7 rounded-full ${step === 2 ? 'bg-play-primary' : 'bg-play-border'}`} />
          </div>
        </div>

        <div className="flex-1">
          {step === 1 ? (
            <>
              <div className="mb-5 grid grid-cols-2 gap-3">
                <label className="col-span-2 flex flex-col gap-2">
                  <span className="text-sm font-black text-play-muted">기준 위치</span>
                  <input
                    value={form.address}
                    onChange={(event) => onChange('address', event.target.value)}
                    className="input-box"
                    placeholder="기준 위치를 입력하세요"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-black text-play-muted">날짜</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => onChange('date', event.target.value)}
                    className="input-box"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-black text-play-muted">포지션</span>
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
                title="탐색 반경"
                value={form.radius ?? 5}
                options={[
                  { label: '3km', value: 3 },
                  { label: '5km', value: 5 },
                  { label: '10km', value: 10 },
                  { label: '20km', value: 20 },
                  { label: '50km', value: 50 },
                ]}
                onChange={(value) => onChange('radius', value)}
              />
            </>
          ) : (
            <>
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
                  { label: '40대 이상', value: 40 },
                ]}
                onChange={(value) => onChange('ageRange', value)}
              />

              <OptionGroup
                title="실력"
                value={form.skillLevel}
                options={[
                  { label: '입문', value: 1 },
                  { label: '초급', value: 2 },
                  { label: '중급', value: 3 },
                  { label: '고급', value: 4 },
                  { label: '상급', value: 5 },
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
            </>
          )}
        </div>

        {step === 1 ? (
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mt-6 h-12 w-full rounded-xl bg-play-primary text-base font-black text-white shadow-sm transition hover:bg-play-primary-dark"
          >
            다음
          </button>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-12 rounded-xl bg-play-surface text-base font-black text-play-muted transition hover:bg-play-border/50"
            >
              이전
            </button>
            <button
              type="button"
              onClick={onSubmit}
              className="h-12 rounded-xl bg-play-primary text-base font-black text-white shadow-sm transition hover:bg-play-primary-dark"
            >
              매칭 시작하기
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
