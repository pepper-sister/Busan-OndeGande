import React, { useState, useEffect } from 'react';

function RestaurantWindow() {
  const [theme, setTheme] = useState('A05020100');
  const [restaurants, setRestaurants] = useState([]);

  const fetchData = async (cat3) => {
    const response = await fetch(`https://apis.data.go.kr/B551011/KorService1/areaBasedList1?serviceKey=MWNRJ13QkgZqSWWOLKWCgzBhPnc9Q6IYEOTWqIz8JtK1zv8NrNvBCZdBYtm5ll0OTw%2Bd%2FZUE1Sa70hJeTxY1Uw%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&contentTypeId=39&areaCode=6&cat1=A05&cat2=A0502&cat3=${cat3}`);
    const data = await response.json();
    setRestaurants(data.response.body.items.item);
  };

  useEffect(() => {
    fetchData(theme);
  }, [theme]);

  return (
    <div>
      <h1>추천 맛집</h1>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="A05020100">한식</option>
        <option value="A05020200">서양식</option>
        <option value="A05020300">일식</option>
        <option value="A05020400">중식</option>
        <option value="A05020700">이색음식</option>
      </select>

      <div className="restaurant-list">
        {restaurants.map((item) => (
          <div key={item.contentid} className="restaurant-item">
            <img src={item.firstimage || 'default-image.jpg'} alt={item.title}/>
            <h2>{item.title}</h2>
            <p>{item.addr1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RestaurantWindow;