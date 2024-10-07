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
  const [showNoPlacesMessage, setShowNoPlacesMessage] = useState(false);

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
  }

  const loadKakaoMap = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          resolve();
        } else {
          reject(new Error('Kakao Maps API 로드 실패'));
        }
      };
      script.onerror = () => reject(new Error('Kakao Maps API 스크립트 로드 오류'));
      document.head.appendChild(script);
    });
  };

  useEffect(() => {
    const initializeMap = () => {
      console.log('Kakao Map initialized');
    };

    loadKakaoMap()
      .then(() => {
        window.kakao.maps.load(() => {
          initializeMap();
        });
      })
      .catch((error) => {
        alert(error.message);
      });
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          setSearchResults([]);
          setShowNoPlacesMessage(false);

          if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(longitude, latitude, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                setLocation(address);
              }
            });
          }
        },
        
        (error) => {
          console.error('위치를 가져오는 중 오류 발생:', error);
          if (error.code === error.PERMISSION_DENIED) {
            alert('위치 불러오기를 허용하지 않았습니다.');
          }
        }
      );
    } else {
      console.error('현재 위치를 지원하지 않는 브라우저입니다.');
    }
  };
  
  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchPlaces = async (lat, lng) => {
      const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&mapX=${lng}&mapY=${lat}&radius=${distance}&contentTypeId=${getContentTypeId(category)}`;

      try {
        const response = await axios.get(url);
        const items = response.data.response.body.items.item || [];
        const filteredItems = items
        .filter(item => item.firstimage)
        .map(item => {
          return {
            ...item,
            firstimage: item.firstimage.replace(/^http:/, 'https:')
          };
        });
        
        setPlaces(filteredItems);
        setShowNoPlacesMessage(filteredItems.length === 0);
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
          setShowNoPlacesMessage(false);
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

  const handleSelectLocation = (lat, lng, address) => {
    setSelectedLocation({ lat, lng });
    setLocation(address);
  };

  const handlePlaceClick = async (placeName) => {
    window.open(`https://map.kakao.com/link/search/${placeName}`, '_blank');
  };

  return (
    <div>
      <main>
        <section className="surrounding">
          <section className="locationsetting-section">
            <button onClick={getCurrentLocation} className="location-button">내 위치</button>
            <div className="surroundingsearch-container">
              <input 
                type="text" 
                placeholder="위치를 입력하세요." 
                value={location}
                onChange={handleLocationChange}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                className="surroundingsearch-input"
              />
              <button onClick={handleSearch} className="surroundingsearch-button">검색</button>
            </div>
  
            <div className="surroundingsearch-results">
              {searchResults.length > 0 ? (
                <ul className="results-list">
                  {searchResults.map((result, index) => (
                    <li 
                    key={index}
                    onClick={() => handleSelectLocation(result.y, result.x, result.place_name)}
                  >
                    <span className="place-name3">{result.place_name || result.address_name}</span>
                    <span className="address-name3">({result.address_name || '주소 없음'})</span>
                  </li>                  
                  ))}
                </ul>
              ) : (
                <p></p>
              )}
            </div>
          </section>

          <section className="surrounding-section">
            <div className="range-slider-container">
              <label htmlFor="distance">{distance}m</label>
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
                      src={place.firstimage} 
                      alt=''
                      className="place-image"
                    />
                    <div className="place-details">
                      <div className="place-name">{place.title}</div>
                      <p className="place-address">{place.addr1}</p>
                      <button
                        className="info-button2"
                        onClick={() => handlePlaceClick(place.addr1)}
                      >
                        길찾기
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className='DN-mes'>
                  <div className='search-prompt'>
                    <p>{location.trim() === '' ? '장소를 검색해주세요.' : null}</p>
                  </div>
                  
                  <div className='er'>
                  <p>
                    {selectedLocation && location.trim() !== '' && showNoPlacesMessage && (
                      category === 'sightseeing' ? '주변 관광지가 없습니다.' :
                      category === 'food' ? '주변 맛집이 없습니다.' :
                      category === 'accommodation' ? '주변 숙소가 없습니다.' :
                      null
                    )}
                  </p>
                </div>
              </div>
              )}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default DoingNow;
