import React, { useState, useEffect } from 'react';
import './Window.css';

function PlaceWindow() {
  const [theme, setTheme] = useState('A0101');
  const [place, setPlace] = useState([]);

  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

  useEffect(() => {
    const fetchData = async (cat2) => {
      const cat1 = cat2 === 'A0101' ? 'A01' : 'A02';
  
      const response = await fetch(
        `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&contentTypeId=12&areaCode=6&cat1=${cat1}&cat2=${cat2}`
      );
      const data = await response.json();
      setPlace(data.response.body.items.item);
    };
  
    fetchData(theme);
  }, [SERVICE_KEY, theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handlePlaceClick = async (placeName) => {
    window.open(`https://map.kakao.com/link/search/${placeName}`, '_blank');
  };

  return (
    <div>
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
              <img className="list-item-img"
                src={item.firstimage}
                alt={item.title}
              />
              <div className="place-info">
                <h2>
                  {item.title}
                  <button
                    className="info-button"
                    onClick={() => handlePlaceClick(item.title)}
                    style={{ marginLeft: '10px' }}
                  >
                    더보기
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
