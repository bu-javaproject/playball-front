import type { ReactNode } from 'react';

type RandomMatchStatusCardProps = {
  icon: string;
  title: string;
  description: string;
  children: ReactNode;
};

export default function RandomMatchStatusCard({
  icon,
  title,
  description,
  children,
}: RandomMatchStatusCardProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-156px)] w-full max-w-md items-center">
      <section className="w-full rounded-2xl border border-play-border bg-white p-7 text-center shadow-sm">
        <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-play-surface text-base font-black text-play-primary">
          {icon}
        </div>

        <h2 className="text-2xl font-black text-play-ink">{title}</h2>
        <p className="mt-3 text-sm font-bold leading-6 text-play-muted">{description}</p>

        {children}
      </section>
    </main>
  );
}
