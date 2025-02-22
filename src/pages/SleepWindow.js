import React, { useState, useEffect } from 'react';
import '../styles/Window.css';

function SleepWindow() {
  const [theme, setTheme] = useState('B02010100');
  const [sleep, setSleep] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;
        const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&contentTypeId=32&areaCode=6&cat1=B02&cat2=B0201&cat3=${theme}`;

        const response = await fetch(url);
        const data = await response.json();
        setSleep(data.response.body.items?.item || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [theme]);

  const handleSleepClick = (placeName) => {
    const cleanedName = placeName.replace(/\[.*?\]|\(.*?\)/g, '').replace(/\s+/g, '');
    window.open(`https://map.kakao.com/link/search/${cleanedName}`, '_blank');
  };

  const themeButtons = [
    { id: 'B02010100', label: '#호텔' },
    { id: 'B02010500', label: '#콘도' },
    { id: 'B02010700', label: '#펜션' },
    { id: 'B02010900', label: '#모텔' },
    { id: 'B02011100', label: '#게스트 하우스' },
  ];

  return (
    <div>
      <div className="button-group">
        {themeButtons.map(({ id, label }) => (
          <button key={id} onClick={() => setTheme(id)} className={theme === id ? 'active' : ''}>
            {label}
          </button>
        ))}
      </div>

      <div className="sleep-list">
        {loading ? (
          <div className="loading-container2">
            <div className="loading-spinner2"></div>
          </div>
        ) : (
          sleep
            .filter((item) => item.firstimage)
            .map((item) => (
              <div key={item.contentid} className="sleep-item">
                <img className="list-item-img" src={item.firstimage} alt={item.title} />
                <div className="sleep-info">
                  <h2>
                    {item.title}
                    <button
                      className="info-button"
                      onClick={() => handleSleepClick(item.title)}
                      style={{ marginLeft: '10px' }}
                    >
                      더보기
                    </button>
                  </h2>
                  <p>{item.addr1}</p>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default SleepWindow;