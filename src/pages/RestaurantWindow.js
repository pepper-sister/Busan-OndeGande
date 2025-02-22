import React, { useState, useEffect } from 'react';
import '../styles/Window.css';

function RestaurantWindow() {
  const [theme, setTheme] = useState('A05020100');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;
        const url = `https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&contentTypeId=39&areaCode=6&cat1=A05&cat2=A0502&cat3=${theme}`;

        const response = await fetch(url);
        const data = await response.json();
        setRestaurants(data.response.body.items.item || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [theme]);

  const handleRestaurantClick = (placeName) => {
    const cleanedName = placeName.replace(/\[.*?\]|\(.*?\)/g, '').replace(/\s+/g, '');
    window.open(`https://map.kakao.com/link/search/${cleanedName}`, '_blank');
  };

  const themeButtons = [
    { id: 'A05020100', label: '#한식' },
    { id: 'A05020200', label: '#서양식' },
    { id: 'A05020300', label: '#일식' },
    { id: 'A05020400', label: '#중식' },
    { id: 'A05020700', label: '#이색음식' },
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

      <div className="restaurant-list">
        {loading ? (
          <div className="loading-container2">
            <div className="loading-spinner2"></div>
          </div>
        ) : (
          restaurants
            .filter((item) => item.firstimage)
            .map((item) => (
              <div key={item.contentid} className="restaurant-item">
                <img className="list-item-img" src={item.firstimage} alt={item.title} />
                <div className="restaurant-info">
                  <h2>
                    {item.title}
                    <button
                      className="info-button"
                      onClick={() => handleRestaurantClick(item.title)}
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

export default RestaurantWindow;
