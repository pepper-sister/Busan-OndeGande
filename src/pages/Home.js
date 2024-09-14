import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import moment from 'moment';
import './Home.css';

const API_URL = 'https://apis.data.go.kr/6260000/FestivalService/getFestivalKr';
const API_KEY = process.env.REACT_APP_SERVICE_KEY;

const ucSeqByMonth = {
  1: [],
  2: [502],
  3: [497, 499],
  4: [403, 441, 1432],
  5: [329, 330, 403, 404, 405, 442, 523, 1432],
  6: [329, 406, 807, 1062],
  7: [71, 1897, 1961],
  8: [1698, 1699, 1807, 1961],
  9: [1699, 1961],
  10: [331, 407, 411, 414, 470, 500, 524, 1694],
  11: [395],
  12: [440, 449, 503]
};

function Home() {
  const [ongoingFestivals, setOngoingFestivals] = useState([]);

  useEffect(() => {
    const currentMonth = moment().month() + 1;
    
    async function fetchFestivals() {
      try {
        const response = await axios.get(`${API_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=38&resultType=json`);
        
        console.log('API response:', response.data);
        
        const festivals = response.data?.getFestivalKr?.item;
        
        if (!festivals) {
          console.error('No festival data found in the API response');
          return;
        }

        const currentUcSeq = ucSeqByMonth[currentMonth].map(String);
        const filteredFestivals = festivals.filter(festival => 
          currentUcSeq.includes(String(festival.UC_SEQ))
        );
        
        setOngoingFestivals(filteredFestivals);
      } catch (error) {
        console.error('Error fetching festival data:', error);
      }
    }

    fetchFestivals();
  }, []);

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

  const openRestaurantWindow = () => {
    window.open('/restaurants', '맛집 추천', 'width=800,height=600');
  };

  const openPlaceWindow = () => {
    window.open('/place', '관광지 추천', 'width=800,height=600');
  };

  const openSleepWindow = () => {
    window.open('/sleep', '숙소 추천', 'width=800,height=600');
  };

  return (
    <div>
      <main className="main-content">
        <section className="hero-section">
          <h1>Busan's 온데간데</h1>
          <p>갈 곳이 넘치는 부산, 간편하게 코스를 짜보세요!</p>
        </section>

        <section className="feature-section">
          <div className="feature-item" onClick={openRestaurantWindow}>
            <img src="image1.jpg" alt=""/>
            <h2>추천 맛집</h2>
            <p>부산의 추천 맛집을 확인해보세요.</p>
          </div>
          <div className="feature-item" onClick={openPlaceWindow}>
            <img src="image2.jpg" alt=""/>
            <h2>인기 관광지</h2>
            <p>부산의 인기있는 관광지를 확인해보세요.</p>
          </div>
          <div className="feature-item" onClick={openSleepWindow}>
            <img src="image3.jpg" alt=""/>
            <h2>추천 숙소</h2>
            <p>부산의 다양한 숙소를 확인해보세요.</p>
          </div>
        </section>
      </main>

      <h1 className="current-festival">{moment().month() + 1}월의 부산 축제</h1>
      <div className="carousel-container">
        <Slider {...settings}>
          {ongoingFestivals.map((festival, index) => (
            <div key={index} className="feature-item2">
              {festival.MAIN_IMG_NORMAL && <img src={festival.MAIN_IMG_NORMAL} alt={festival.FESTIVAL_NM} />}
              <h2>{festival.PLACE}</h2>
              <p>{festival.USAGE_DAY_WEEK_AND_TIME}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Home;