import React from 'react';
import './Home.css';

function Home() {
  return (
    <div>
      <main className="main-content">
        <section className="hero-section">
          <h1>한국을 탐험해보세요</h1>
          <p>아름다운 한국의 문화와 자연을 만나보세요</p>
        </section>
        <section className="feature-section">
          <div className="feature-item">
            <img src="image1.jpg" alt="여행지" />
            <h2>인기 여행지</h2>
            <p>한국의 인기 여행지를 탐험해보세요.</p>
          </div>
          <div className="feature-item">
            <img src="image2.jpg" alt="문화 체험" />
            <h2>문화 체험</h2>
            <p>한국의 문화와 역사를 경험해보세요.</p>
          </div>
          <div className="feature-item">
            <img src="image3.jpg" alt="이벤트" />
            <h2>이벤트 및 축제</h2>
            <p>한국에서 열리는 다양한 이벤트와 축제를 즐겨보세요.</p>
          </div>
        </section>
      </main>
      <h1>홈 페이지</h1>
      <p>홈 페이지의 내용입니다.</p>
    </div>
  );
}

export default Home;