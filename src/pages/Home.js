import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import moment from 'moment';
import '../styles/Home.css';

const API_URL = 'https://apis.data.go.kr/6260000/FestivalService/getFestivalKr';
const API_KEY = process.env.REACT_APP_SERVICE_KEY;

const ucSeqByMonth = {
  1: [], 2: [502], 3: [497, 499], 4: [403, 441, 1432], 
  5: [329, 330, 403, 404, 405, 442, 523, 1432], 
  6: [329, 406, 807, 1062], 7: [71, 1897, 1961], 
  8: [1698, 1699, 1807, 1961], 9: [1699, 1961], 
  10: [331, 407, 411, 414, 470, 500, 524, 1694], 
  11: [395], 12: [440, 449, 503]
};

function Home() {
  const [ongoingFestivals, setOngoingFestivals] = useState([]);
  const currentMonth = moment().month() + 1;
  
  useEffect(() => {
    async function fetchFestivals() {
      try {
        const { data } = await axios.get(`${API_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=38&resultType=json`);
        console.log('API response:', data);

        const festivals = data?.getFestivalKr?.item || [];
        const currentUcSeq = ucSeqByMonth[currentMonth] || [];

        if (!festivals.length || !currentUcSeq.length) {
          console.warn('No festivals found for the current month');
          return;
        }

        const filteredFestivals = festivals.filter(festival => 
          currentUcSeq.includes(Number(festival.UC_SEQ))
        );

        setOngoingFestivals(filteredFestivals);
      } catch (error) {
        console.error('Error fetching festival data:', error);
      }
    }

    fetchFestivals();
  }, [currentMonth]);

  const settings = {
    dots: true,
    infinite: ongoingFestivals.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  const openWindow = (path, title) => {
    window.open(path, title, 'width=800,height=600');
  };

  const cleanTitle = (title) => title.replace(/\s*\(.*?\)\s*/, ' ').trim();

  return (
    <div>
      <main>
        <section className="mainimg-section"></section>

        <section className="suggestion-section">
          {[
            { title: '추천 맛집', path: '/RestaurantWindow', className: 'restaurant' },
            { title: '인기 관광지', path: '/Placewindow', className: 'tourist' },
            { title: '추천 숙소', path: '/SleepWindow', className: 'accommodation' },
          ].map(({ title, path, className }) => (
            <div key={title} className="suggest-item" onClick={() => openWindow(path, title)}>
              <h2>{title}</h2>
              <div className={`icon ${className}`}></div>
            </div>
          ))}
        </section>

        <section className="festival-section">
          <h1>{currentMonth}월의 부산 축제</h1>
          <div className="festival-container">
            <Slider {...settings}>
              {ongoingFestivals.map((festival, index) => (
                <div key={index} className="festival-item">
                  {festival.MAIN_IMG_NORMAL && <img src={festival.MAIN_IMG_NORMAL} alt={festival.FESTIVAL_NM} />}
                  <h2>{cleanTitle(festival.MAIN_TITLE)}</h2>
                  <p>{festival.USAGE_DAY_WEEK_AND_TIME}</p>
                </div>
              ))}
            </Slider>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
