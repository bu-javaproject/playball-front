import { useMemo, useState } from 'react';

import type { ComplimentTag, MatchParticipant } from '../types/myMatch';
import { complimentTagLabel } from '../utils/myMatchFormat';

const complimentTags = Object.entries(complimentTagLabel) as Array<[ComplimentTag, string]>;

interface PraiseModalProps {
  participant: MatchParticipant;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (tags: ComplimentTag[], comment: string) => void;
}

export function PraiseModal({ participant, isSubmitting, onClose, onSubmit }: PraiseModalProps) {
  const [selectedTags, setSelectedTags] = useState<ComplimentTag[]>([]);
  const [comment, setComment] = useState('');
  const canSubmit = selectedTags.length > 0 && !isSubmitting;
  const title = useMemo(() => `${participant.nickname}님을 칭찬하기`, [participant.nickname]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 px-5">
      <section className="w-full max-w-sm rounded-[28px] bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-slate-950">{title}</h3>
        <p className="mt-2 text-sm font-bold text-slate-500">경기 후 같이 뛴 사람에게 1개 이상 칭찬 태그를 보낼 수 있습니다.</p>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {complimentTags.map(([tag, label]) => {
            const isSelected = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                onClick={() =>
                  setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]))
                }
                className={`h-12 rounded-2xl border text-sm font-black ${
                  isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          maxLength={200}
          placeholder="한마디 코멘트는 선택입니다"
          className="mt-4 h-24 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold outline-none focus:border-blue-500"
        />

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="h-12 rounded-2xl bg-slate-100 text-sm font-black text-slate-600">
            아니오
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit(selectedTags, comment)}
            className="h-12 rounded-2xl bg-blue-600 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            보내기
          </button>
        </div>
      </section>
    </div>
  );
}
