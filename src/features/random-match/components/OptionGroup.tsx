type OptionGroupProps<T extends string | number> = {
  title: string;
  value: T;
  options: { label: string; value: T }[];
  onChange: (value: T) => void;
};

export default function OptionGroup<T extends string | number>({
  title,
  value,
  options,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <section className="mt-5">
      <h2 className="mb-3 text-sm font-black text-play-muted">{title}</h2>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`h-11 rounded-xl border text-sm font-black transition ${
                active
                  ? 'border-play-primary bg-play-primary text-white shadow-sm'
                  : 'border-play-border bg-play-surface text-play-muted hover:border-play-primary/40'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
