import React, { useState, useEffect } from 'react';

function SleepWindow() {
  const [theme, setTheme] = useState('B02010100');
  const [sleep, setSleep] = useState([]);

  const fetchData = async (cat3) => {
    const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=MWNRJ13QkgZqSWWOLKWCgzBhPnc9Q6IYEOTWqIz8JtK1zv8NrNvBCZdBYtm5ll0OTw%2Bd%2FZUE1Sa70hJeTxY1Uw%3D%3D&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&contentTypeId=32&areaCode=6&cat1=B02&cat2=B0201&cat3=${cat3}`);
    const data = await response.json();
    setSleep(data.response.body.items.item);
  };

  useEffect(() => {
    fetchData(theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div>
      <h1>추천 숙소</h1>
      <div className="button-group">
        <button onClick={() => handleThemeChange('B02010100')} className={theme === 'B02010100' ? 'active' : ''}>
          #호텔
        </button>
        <button onClick={() => handleThemeChange('B02010500')} className={theme === 'B02010500' ? 'active' : ''}>
          #콘도
        </button>
        <button onClick={() => handleThemeChange('B02010700')} className={theme === 'B02010700' ? 'active' : ''}>
          #펜션
        </button>
        <button onClick={() => handleThemeChange('B02010900')} className={theme === 'B02010900' ? 'active' : ''}>
          #모텔
        </button>
        <button onClick={() => handleThemeChange('B02011100')} className={theme === 'B02011100' ? 'active' : ''}>
          #게스트 하우스
        </button>
      </div>

      <div className="sleep-list">
        {sleep
          .filter((item) => item.firstimage)
          .map((item) => (
          <div key={item.contentid} className="sleep-item">
            <img
              src={item.firstimage}
              alt={item.title}
              style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            />
            <div className="sleep-info">
                <h2>{item.title}</h2>
                <p>{item.addr1}</p>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
}

export default SleepWindow;