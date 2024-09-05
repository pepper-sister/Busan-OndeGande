import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './DoingNow.css';

function DoingNow() {
  const [distance, setDistance] = useState(1500);
  const [category, setCategory] = useState('sightseeing');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  const getContentTypeId = (category) => {
    switch (category) {
      case 'food':
        return '39'; // 음식점
      case 'sightseeing':
        return '12'; // 관광지
      case 'accommodation':
        return '32'; // 숙소
      default:
        return '12'; // 기본값: 관광지
    }
  };

  const fetchPlaces = useCallback((lat, lng) => {
    const serviceKey = 'MWNRJ13QkgZqSWWOLKWCgzBhPnc9Q6IYEOTWqIz8JtK1zv8NrNvBCZdBYtm5ll0OTw%2Bd%2FZUE1Sa70hJeTxY1Uw%3D%3D';
    const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${serviceKey}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&mapX=${lng}&mapY=${lat}&radius=${distance}&contentTypeId=${getContentTypeId(category)}`;

    console.log('API 요청 URL:', url); // URL 확인용
    axios.get(url)
      .then(response => {
        console.log('API 응답:', response.data); // 응답 데이터 확인용
        const items = response.data.response.body.items.item || [];
        // `firstimage`가 있는 항목만 필터링
        const filteredItems = items.filter(item => item.firstimage);
        setPlaces(filteredItems);
      })
      .catch(error => {
        console.error('API 호출 중 오류 발생:', error);
      });
  }, [category, distance]);

  useEffect(() => {
    if (selectedLocation) {
      fetchPlaces(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation, fetchPlaces]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setDistance(event.target.value);
  };

  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  const handleSearch = () => {
    if (!window.kakao) {
      console.error('Kakao Map API가 로드되지 않았습니다.');
      return;
    }

    const kakao = window.kakao;
    const geocoder = new kakao.maps.services.Geocoder();

    if (!location.trim()) {
      console.error('주소를 입력해주세요.');
      return;
    }

    geocoder.addressSearch(location, (result, status) => {
      console.log('검색 결과:', result);
      console.log('상태:', status);

      if (status === kakao.maps.services.Status.OK) {
        if (Array.isArray(result) && result.length > 0) {
          // 결과에서 처음 5개 항목만 선택
          setSearchResults(result.slice(0, 5));
          const { y, x } = result[0];
          setSelectedLocation({ lat: y, lng: x });
        } else {
          setSearchResults([]);
        }
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        searchNearbyPlaces(location);
      } else {
        console.error('위치를 찾을 수 없습니다. 상태:', status, '입력된 주소:', location);
        setSearchResults([]);
      }
    });
  };

  const searchNearbyPlaces = (query) => {
    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(query, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        // 검색 결과를 처음 5개 항목으로 제한
        setSearchResults(data.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleSelectLocation = (lat, lng) => {
    setSelectedLocation({ lat, lng });
  };

  return (
    <div className="destinations-container">
      <h1>이제 뭐하노?</h1>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="위치를 입력하세요" 
          value={location}
          onChange={handleLocationChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">검색</button>
      </div>

      <div className="search-results">
        {searchResults.length > 0 ? (
          <ul className="results-list">
            {searchResults.map((result, index) => (
              <li 
                key={index}
                onClick={() => handleSelectLocation(result.y, result.x)}
              >
                {result.place_name || result.address_name} ({result.address_name || '주소 없음'})
              </li>
            ))}
          </ul>
        ) : (
          <p>위치를 입력해주세요.</p>
        )}
      </div>

      <div className="range-slider-container">
        <label htmlFor="distance">반경: {distance}m</label>
        <input 
          id="distance" 
          type="range" 
          min="500" 
          max="2500" 
          step="100" 
          value={distance} 
          onChange={handleDistanceChange}
          className="range-slider"
        />
      </div>

      <div className="category-buttons">
        <button 
          className={`category-button ${category === 'sightseeing' ? 'active' : ''}`} 
          onClick={() => handleCategoryClick('sightseeing')}
        >
          관광지
        </button>
        <button 
          className={`category-button ${category === 'food' ? 'active' : ''}`} 
          onClick={() => handleCategoryClick('food')}
        >
          맛집
        </button>
        <button 
          className={`category-button ${category === 'accommodation' ? 'active' : ''}`} 
          onClick={() => handleCategoryClick('accommodation')}
        >
          숙소
        </button>
      </div>

      <div className="places">
        {places.length > 0 ? (
          places.map((place) => (
            <div key={place.contentid} className="place">
              <img 
                src={place.firstimage || 'default-image.jpg'} 
                alt={place.title}
                style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              />
              <h3>{place.title}</h3>
              <p>{place.addr1}</p>
            </div>
          ))
        ) : (
          <p>정보가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default DoingNow;
