import React, { useState, useEffect } from 'react';
import '../styles/Window.css';

function PlaceWindow() {
  const [theme, setTheme] = useState('A0101');
  const [place, setPlace] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategory = (cat2) => (cat2.startsWith('A01') ? 'A01' : 'A02');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;
        const cat1 = getCategory(theme);
        const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&contentTypeId=12&areaCode=6&cat1=${cat1}&cat2=${theme}`;

        const response = await fetch(url);
        const data = await response.json();
        setPlace(data.response.body.items.item || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [theme]);

  const handlePlaceClick = (placeName) => {
    const cleanedName = placeName.replace(/\[.*?\]|\(.*?\)/g, '').replace(/\s+/g, '');
    window.open(`https://map.kakao.com/link/search/${cleanedName}`, '_blank');
  };

  const themeButtons = [
    { id: 'A0101', label: '#자연' },
    { id: 'A0201', label: '#역사' },
    { id: 'A0202', label: '#휴양' },
    { id: 'A0203', label: '#체험' },
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

      <div className="place-list">
        {loading ? (
          <div className="loading-container2">
            <div className="loading-spinner2"></div>
          </div>
        ) : (
          place
            .filter((item) => item.firstimage)
            .map((item) => (
              <div key={item.contentid} className="place-item">
                <img className="list-item-img" src={item.firstimage} alt={item.title} />
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
            ))
        )}
      </div>
    </div>
  );
}

export default PlaceWindow;