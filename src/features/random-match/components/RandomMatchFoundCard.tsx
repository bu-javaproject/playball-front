import type { RandomMatchedGame } from '../types/randomMatch';

type RandomMatchFoundCardProps = {
  matchedGame: RandomMatchedGame;
  onAccept: () => void;
  onReject: () => void;
};

export default function RandomMatchFoundCard({
  matchedGame,
  onAccept,
  onReject,
}: RandomMatchFoundCardProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-md items-center">
      <section className="w-full overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200">
        <div className="flex h-44 items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-7xl">
          ⚽
        </div>

        <div className="p-6">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-600">경기 발견</span>

          <h1 className="mt-4 text-2xl font-black text-slate-950">{matchedGame.title}</h1>

          <div className="mt-5 space-y-3 text-sm font-bold text-slate-500">
            <p>장소: {matchedGame.locationName}</p>
            <p>시간: {matchedGame.matchDate}</p>
            <p>
              인원: {matchedGame.currentPlayers}/{matchedGame.maxPlayers}명
            </p>
            <p>거리: {matchedGame.distance}km</p>
            <p>주최자: {matchedGame.creatorNickname}</p>
          </div>

          <div className="mt-7 flex gap-3">
            <button
              type="button"
              onClick={onReject}
              className="h-12 flex-1 rounded-2xl bg-slate-100 font-black text-slate-600"
            >
              거절
            </button>

            <button
              type="button"
              onClick={onAccept}
              className="h-12 flex-1 rounded-2xl bg-blue-600 font-black text-white shadow-lg shadow-blue-200"
            >
              수락
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
