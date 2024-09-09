import React, { useState, useEffect } from 'react';
import './Window.css';

function PlaceWindow() {
  const [theme, setTheme] = useState('A0101');
  const [place, setPlace] = useState([]);

  const KAKAO_REST_API_KEY = 'c322d88af8037ce0b6195841506667d7';

  const fetchData = async (cat2) => {
    const cat1 = cat2 === 'A0101' ? 'A01' : 'A02';

    const response = await fetch(
      `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=MWNRJ13QkgZqSWWOLKWCgzBhPnc9Q6IYEOTWqIz8JtK1zv8NrNvBCZdBYtm5ll0OTw%2Bd%2FZUE1Sa70hJeTxY1Uw%3D%3D&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&contentTypeId=12&areaCode=6&cat1=${cat1}&cat2=${cat2}`
    );
    const data = await response.json();
    setPlace(data.response.body.items.item);
  };

  useEffect(() => {
    fetchData(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handlePlaceClick = async (placeName) => {
    const query = `${'부산 관광 '} ${placeName}`;

    const response = await fetch(`https://dapi.kakao.com/v2/search/web?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });
    const data = await response.json();
    
    if (data.documents && data.documents.length > 0) {
      const firstResultUrl = data.documents[0].url;
      window.open(firstResultUrl, '_blank'); // 새 탭에서 검색 결과로 이동
    } else {
      alert('검색 결과가 없습니다.');
    }
  };

  return (
    <div>
      <h1>인기 관광지</h1>
      <div className="button-group">
        <button onClick={() => handleThemeChange('A0101')} className={theme === 'A0101' ? 'active' : ''}>
          #자연
        </button>
        <button onClick={() => handleThemeChange('A0201')} className={theme === 'A0201' ? 'active' : ''}>
          #역사
        </button>
        <button onClick={() => handleThemeChange('A0202')} className={theme === 'A0202' ? 'active' : ''}>
          #휴양
        </button>
        <button onClick={() => handleThemeChange('A0203')} className={theme === 'A0203' ? 'active' : ''}>
          #체험
        </button>
      </div>

      <div className="place-list">
        {place
          .filter((item) => item.firstimage)
          .map((item) => (
            <div key={item.contentid} className="place-item">
              <img
                src={item.firstimage}
                alt={item.title}
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
              <div className="place-info">
                <h2>
                  {item.title}
                  <button
                    className="info-button"
                    onClick={() => handlePlaceClick(item.title)}
                    style={{ marginLeft: '10px' }}
                  >
                    알아보기
                  </button>
                </h2>
                <p>{item.addr1}</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default PlaceWindow;
