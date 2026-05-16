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
      <h2 className="mb-3 text-sm font-black text-slate-500">{title}</h2>

      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => {
          const active = option.value === value;

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange(option.value)}
              className={`h-11 rounded-2xl border text-sm font-black transition ${
                active
                  ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'border-slatㄹe-200 bg-slate-50 text-slate-500'
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
