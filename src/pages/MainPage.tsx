export default function MainPage() {
  return (
    <div>
      <h2>PlayBall</h2>

      {/* 핵심 액션 */}
      <section>
        <button>근처 경기 찾기</button>
        <button>랜덤 매칭</button>
        <button>경기 만들기</button>
      </section>

      {/* 추천 경기 */}
      <section>
        <h3>지금 참여 가능한 경기</h3>
        <div>MatchCard 들어갈 자리</div>
      </section>

      {/* 소식 */}
      <section>
        <h3>소식</h3>
        <div>피드 영역</div>
      </section>
    </div>
  );
}