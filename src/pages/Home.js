import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import moment from 'moment';
import './Home.css';

const API_URL = 'https://apis.data.go.kr/6260000/FestivalService/getFestivalKr';
const API_KEY = process.env.REACT_APP_SERVICE_KEY;

const TODAY = moment('2024-10-01');

function parseDate(dateStr) {
  let startDate = null;
  let endDate = null;

  if (dateStr.includes('~')) {
    const [start, end] = dateStr.split('~').map(date => date.trim());
    startDate = moment(start, ['YYYY. M. D.(ddd)', 'YYYY. M. D.(ddd)', 'YYYY. M. D.', 'YYYY. M. D']);
    endDate = moment(end, ['YYYY. M. D.(ddd)', 'YYYY. M. D.(ddd)', 'YYYY. M. D.', 'YYYY. M. D']);
  } else if (dateStr.includes('예정')) {
    return { startDate: null, endDate: null };
  } else {
    startDate = moment(dateStr, ['YYYY. M. D.(ddd)', 'YYYY. M. D.(ddd)', 'YYYY. M. D.', 'YYYY. M. D']);
    endDate = startDate;
  }

  return { startDate, endDate };
}

function isFestivalOngoing(dateRange) {
  const { startDate, endDate } = parseDate(dateRange);

  if (!startDate && !endDate) {
    return TODAY.month() === moment().month();
  }

  return TODAY.isBetween(startDate, endDate, null, '[]');
}

function Home() {
  const [ongoingFestivals, setOngoingFestivals] = useState([]);

  useEffect(() => {
    async function fetchFestivals() {
      try {
        const response = await axios.get(`${API_URL}?serviceKey=${API_KEY}&pageNo=1&numOfRows=38&resultType=json`);
        const festivals = response.data.response.body.items.item;
        const currentFestivals = festivals.filter(festival => isFestivalOngoing(festival.USAGE_DAY_WEEK_AND_TIME));
        setOngoingFestivals(currentFestivals);
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

      <h1 className="current-festival">현재 진행중인 부산의 축제</h1>
      <div className="carousel-container">
        <Slider {...settings}>
          {ongoingFestivals.map((festival, index) => (
            <div key={index} className="feature-item2">
              <h2>{festival.FESTIVAL_NM}</h2>
              <p>{festival.USAGE_DAY_WEEK_AND_TIME}</p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default Home;