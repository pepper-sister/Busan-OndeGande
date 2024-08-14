import React from 'react';
import './Home.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function Home() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  return (
    <div>
      <main className="main-content">
        <section className="hero-section">
          <h1>Busan's 온데간데</h1>
          <p>갈 곳이 넘치는 부산, 간편하게 코스를 짜보세요!</p>
        </section>
        <section className="feature-section">
          <div className="feature-item">
            <img src="image1.jpg" alt=""/>
            <h2>추천 맛집</h2>
            <p>부산의 추천 맛집을 확인해보세요.</p>
          </div>
          <div className="feature-item">
            <img src="image2.jpg" alt=""/>
            <h2>인기 관광지</h2>
            <p>부산의 인기있는 관광지를 확인해보세요.</p>
          </div>
          <div className="feature-item">
            <img src="image3.jpg" alt=""/>
            <h2>추천 숙소</h2>
            <p>부산의 다양한 숙소를 확인해보세요.</p>
          </div>
        </section>
      </main>

      <h1 className="current-festival">현재 진행중인 부산의 축제</h1>
      <div className="carousel-container">
        <Slider {...settings}>
          <div className="feature-item2 one">
            <h2>XX 축제</h2>
            <p>먼가 재밌음</p>
          </div>
          <div className="feature-item2 two">
            <h2>OO 축제</h2>
            <p>불꽃놀이 볼 수 있음</p>
          </div>
          <div className="feature-item2 thr">
            <h2>ZZ 축제</h2>
            <p>물놀이 할 수 있음</p>
          </div>
        </Slider>
      </div>
    </div>
  );
}

export default Home;