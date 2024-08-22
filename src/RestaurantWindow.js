import React, { useState, useEffect } from 'react';
import './Window.css';

function RestaurantWindow() {
  const [theme, setTheme] = useState('A05020100');
  const [restaurants, setRestaurants] = useState([]);

  const fetchData = async (cat3) => {
    const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=MWNRJ13QkgZqSWWOLKWCgzBhPnc9Q6IYEOTWqIz8JtK1zv8NrNvBCZdBYtm5ll0OTw%2Bd%2FZUE1Sa70hJeTxY1Uw%3D%3D&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&contentTypeId=39&areaCode=6&cat1=A05&cat2=A0502&cat3=${cat3}`);
    const data = await response.json();
    setRestaurants(data.response.body.items.item);
  };

  useEffect(() => {
    fetchData(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div>
      <h1>추천 맛집</h1>
      <div className="button-group">
        <button onClick={() => handleThemeChange('A05020100')} className={theme === 'A05020100' ? 'active' : ''}>
          #한식
        </button>
        <button onClick={() => handleThemeChange('A05020200')} className={theme === 'A05020200' ? 'active' : ''}>
          #서양식
        </button>
        <button onClick={() => handleThemeChange('A05020300')} className={theme === 'A05020300' ? 'active' : ''}>
          #일식
        </button>
        <button onClick={() => handleThemeChange('A05020400')} className={theme === 'A05020400' ? 'active' : ''}>
          #중식
        </button>
        <button onClick={() => handleThemeChange('A05020700')} className={theme === 'A05020700' ? 'active' : ''}>
          #이색음식
        </button>
      </div>

      <div className="restaurant-list">
        {restaurants
          .filter((item) => item.firstimage)
          .map((item) => (
            <div key={item.contentid} className="restaurant-item">
              <img
                src={item.firstimage}
                alt={item.title}
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                />
              <div className="restaurant-info">
                <h2>{item.title}</h2>
                <p>{item.addr1}</p>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantWindow;