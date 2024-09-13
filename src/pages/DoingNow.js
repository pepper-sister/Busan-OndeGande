import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoingNow.css';

function DoingNow() {
  const [distance, setDistance] = useState(1500);
  const [category, setCategory] = useState('sightseeing');
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [places, setPlaces] = useState([]);

  const KAKAO_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

  const getContentTypeId = (category) => {
    switch (category) {
      case 'food':
        return '39';
      case 'sightseeing':
        return '12';
      case 'accommodation':
        return '32';
      default:
        return '12';
    }
  };

  useEffect(() => {
    const fetchPlaces = async (lat, lng) => {
      const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&listYN=Y&arrange=A&mapX=${lng}&mapY=${lat}&radius=${distance}&contentTypeId=${getContentTypeId(category)}`;

      try {
        const response = await axios.get(url);
        const items = response.data.response.body.items.item || [];
        const filteredItems = items.filter(item => item.firstimage);
        setPlaces(filteredItems);
      } catch (error) {
        console.error('API 호출 중 오류 발생:', error);
      }
    };

    if (selectedLocation) {
      fetchPlaces(selectedLocation.lat, selectedLocation.lng);
    }
  }, [selectedLocation, category, distance, SERVICE_KEY]);

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
      if (status === kakao.maps.services.Status.OK) {
        if (Array.isArray(result) && result.length > 0) {
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
        setSearchResults(data.slice(0, 5));
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleSelectLocation = (lat, lng) => {
    setSelectedLocation({ lat, lng });
  };

  const handlePlaceClick = async (placeName) => {
    const query = `${placeName}`;
  
    const response = await fetch(`https://dapi.kakao.com/v2/search/web?query=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
      },
    });
    const data = await response.json();

    if (data.documents && data.documents.length > 0) {
      const firstPlaceUrl = `https://map.kakao.com/link/search/${encodeURIComponent(placeName)}`;
      window.open(firstPlaceUrl, '_blank');
    } else {
      alert('검색 결과가 없습니다.');
    }
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
          <p></p>
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
                className="place-image"
              />
              <div className="place-details">
                <div className="place-name">{place.title}</div>
                <p className="place-address">{place.addr1}</p>
                <button
                  className="info-button2"
                  onClick={() => handlePlaceClick(place.title)}
                >
                  알아보기
                </button>
              </div>
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
