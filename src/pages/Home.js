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

  const cleanTitle = (title) => {
    return title.replace(/\(.*?\)/, '').trim();
  };

  return (
    
    <div>
      <main>
        <section className="mainimg-section">
        </section>

        <section className="suggestion-section">
          <div className="suggest-item" onClick={openRestaurantWindow}>
            <h2>추천 맛집</h2>
            <div className="icon restaurant"></div>
          </div>

          <div className="suggest-item" onClick={openPlaceWindow}>
            <h2>인기 관광지</h2>
            <div className="icon tourist"></div>
          </div>

          <div className="suggest-item" onClick={openSleepWindow}>
            <h2>추천 숙소</h2>
            <div className="icon accommodation"></div>
          </div>
        </section>


        <section className="festival-section">
        <h1>{moment().month() + 1}월의 부산 축제</h1>
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