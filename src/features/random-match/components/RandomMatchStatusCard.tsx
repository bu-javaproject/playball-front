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
    <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-md items-center">
      <section className="w-full rounded-3xl bg-white p-8 text-center shadow-lg shadow-slate-200">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-blue-50 text-lg font-black text-blue-600">
          {icon}
        </div>

        <h1 className="text-2xl font-black text-slate-950">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>

        {children}
      </section>
    </main>
  );
}
