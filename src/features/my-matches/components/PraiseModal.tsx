import { useMemo, useState } from 'react';

import type { ComplimentTag, MatchParticipant } from '../types/myMatch';
import { complimentTagLabel } from '../utils/myMatchFormat';

const complimentTags = Object.entries(complimentTagLabel) as Array<[ComplimentTag, string]>;

interface PraiseModalProps {
  participant: MatchParticipant;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (tags: ComplimentTag[]) => void;
}

export function PraiseModal({ participant, isSubmitting, onClose, onSubmit }: PraiseModalProps) {
  const [selectedTags, setSelectedTags] = useState<ComplimentTag[]>([]);
  const canSubmit = selectedTags.length > 0 && !isSubmitting;
  const title = useMemo(() => `${participant.nickname}님 칭찬하기`, [participant.nickname]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-slate-950/45 px-5">
      <section className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <h3 className="text-xl font-black text-play-ink">{title}</h3>
        <p className="mt-2 text-sm font-bold leading-6 text-play-muted">함께 뛴 멤버에게 어울리는 칭찬 태그를 선택해주세요.</p>

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
                className={`min-h-12 rounded-xl border px-3 py-2 text-sm font-black ${
                  isSelected ? 'border-play-primary bg-play-primary text-white' : 'border-play-border bg-play-surface text-play-ink'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button type="button" onClick={onClose} className="h-12 rounded-xl bg-play-surface text-sm font-black text-play-muted">
            취소
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onSubmit(selectedTags)}
            className="h-12 rounded-xl bg-play-primary text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            보내기
          </button>
        </div>
      </section>
    </div>
  );
}