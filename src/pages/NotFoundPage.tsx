import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-5 px-4 py-8 text-center">
      <h1 className="text-3xl font-black text-slate-950">페이지를 찾을 수 없습니다</h1>
      <Link to="/" className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
        홈으로 이동
      </Link>
    </div>
  );
}
