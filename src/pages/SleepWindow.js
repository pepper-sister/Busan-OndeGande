import React, { useState, useEffect } from 'react';

function SleepWindow() {
  const [theme, setTheme] = useState('B02010100');
  const [sleep, setSleep] = useState([]);
  const [loading, setLoading] = useState(false);

  const SERVICE_KEY = window.env.REACT_APP_SERVICE_KEY;

  useEffect(() => {
    const fetchData = async (cat3) => {
      setLoading(true);
      try {
        const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&contentTypeId=32&areaCode=6&cat1=B02&cat2=B0201&cat3=${cat3}`);
        const data = await response.json();
        setSleep(data.response.body.items.item);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData(theme);
  }, [theme, SERVICE_KEY]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  const handleSleepClick = async (placeName) => {
    window.open(`https://map.kakao.com/link/search/${placeName}`, '_blank');
  };

  return (
    <div>
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
        {loading && (
          <div className="loading-container2">
            <div className="loading-spinner2"></div>
          </div>
        )}
        {!loading && sleep
          .filter((item) => item.firstimage)
          .map((item) => (
            <div key={item.contentid} className="sleep-item">
              <img className="list-item-img"
                src={item.firstimage}
                alt={item.title}
              />
              <div className="sleep-info">
                <h2>
                  {item.title}
                  <button
                    className="info-button"
                    onClick={() => handleSleepClick(item.title.replace(/\[.*?\]|\(.*?\)/g, '').replace(/\s+/g, ''))}
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

export default SleepWindow;
