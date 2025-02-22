import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/DoingNow.css";

function DoingNow() {
  const [distance, setDistance] = useState(1500);
  const [category, setCategory] = useState("sightseeing");
  const [location, setLocation] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [showNoPlacesMessage, setShowNoPlacesMessage] = useState(false);

  const SERVICE_KEY = process.env.REACT_APP_SERVICE_KEY;

  const contentTypeId = {
    food: "39",
    sightseeing: "12",
    accommodation: "32",
  }[category] || "12";

  const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const loadKakaoMap = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (window.kakao && window.kakao.maps) return resolve();

      const script = document.createElement("script");
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
      script.onload = () => window.kakao?.maps ? resolve() : reject(new Error("Kakao Maps API 로드 실패"));
      script.onerror = () => reject(new Error("Kakao Maps API 스크립트 로드 오류"));
      document.head.appendChild(script);
    });
  }, []);

  useEffect(() => {
    loadKakaoMap()
      .then(() => window.kakao.maps.load(() => console.log("Kakao Map initialized")))
      .catch((error) => alert(error.message));
  }, [loadKakaoMap]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) return console.error("현재 위치를 지원하지 않는 브라우저입니다.");

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setSelectedLocation({ lat: latitude, lng: longitude });
        setSearchResults([]);
        setShowNoPlacesMessage(false);

        if (window.kakao?.maps) {
          new window.kakao.maps.services.Geocoder().coord2Address(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
              setLocation(result[0]?.address?.address_name || "");
            }
          });
        }
      },
      (error) => {
        console.error("위치를 가져오는 중 오류 발생:", error);
        if (error.code === error.PERMISSION_DENIED) alert("위치 불러오기를 허용하지 않았습니다.");
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;

    const fetchPlaces = async () => {
      try {
        const { lat, lng } = selectedLocation;
        const url = `https://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${SERVICE_KEY}&numOfRows=100&pageNo=1&MobileOS=ETC&MobileApp=Busan'sOndegande&_type=json&listYN=Y&arrange=A&mapX=${lng}&mapY=${lat}&radius=${distance}&contentTypeId=${contentTypeId}`;
        const response = await axios.get(url);
        const items = response.data.response.body.items.item || [];

        const filteredItems = items
          .filter((item) => item.firstimage)
          .map((item) => ({ ...item, firstimage: item.firstimage.replace(/^http:/, "https:") }));

        setPlaces(filteredItems);
        setShowNoPlacesMessage(filteredItems.length === 0);
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    fetchPlaces();
  }, [selectedLocation, category, distance, SERVICE_KEY, contentTypeId]);

  const handleSearch = () => {
    if (!window.kakao?.maps) return console.error("Kakao Map API가 로드되지 않았습니다.");
    if (!location.trim()) return console.error("주소를 입력해주세요.");

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(location, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK && result.length) {
        const { y, x } = result[0];
        setSelectedLocation({ lat: y, lng: x });
        setSearchResults(result.slice(0, 5));
        setShowNoPlacesMessage(false);
      } else {
        searchNearbyPlaces(location);
      }
    });
  };

  const searchNearbyPlaces = (query) => {
    if (!window.kakao?.maps) return;

    new window.kakao.maps.services.Places().keywordSearch(query, (data, status) => {
      setSearchResults(status === window.kakao.maps.services.Status.OK ? data.slice(0, 5) : []);
    });
  };

  const handleDistanceChange = debounce((event) => setDistance(event.target.value));

  return (
    <main>
      <section className="surrounding">
        <section className="locationsetting-section">
          <button onClick={getCurrentLocation} className="location-button">내 위치</button>
          <div className="surroundingsearch-container">
            <input
              type="text"
              placeholder="위치를 입력하세요."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="surroundingsearch-input"
            />
            <button onClick={handleSearch} className="surroundingsearch-button">검색</button>
          </div>

          {searchResults.length > 0 && (
            <ul className="results-list">
              {searchResults.map((result, index) => (
                <li key={index} onClick={() => setSelectedLocation({ lat: result.y, lng: result.x })}>
                  <span className="place-name3">{result.place_name || result.address_name}</span>
                  <span className="address-name3">({result.address_name || "주소 없음"})</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="surrounding-section">
          <div className="range-slider-container">
            <label htmlFor="distance">{distance}m</label>
            <input id="distance" type="range" min="500" max="2500" step="100" value={distance} onChange={handleDistanceChange} className="range-slider" />
          </div>

          <div className="category-buttons">
            {["sightseeing", "food", "accommodation"].map((cat) => (
              <button key={cat} className={`category-button ${category === cat ? "active" : ""}`} onClick={() => setCategory(cat)}>
                {cat === "sightseeing" ? "관광지" : cat === "food" ? "맛집" : "숙소"}
              </button>
            ))}
          </div>

          <div className="places">
            {places.length ? places.map((place) => (
              <div key={place.contentid} className="place">
                <img src={place.firstimage} alt="" className="place-image" />
                <div className="place-details">
                  <div className="place-name">{place.title}</div>
                  <p className="place-address">{place.addr1}</p>
                  <button className="info-button2" onClick={() => window.open(`https://map.kakao.com/link/search/${place.addr1}`, "_blank")}>길찾기</button>
                </div>
              </div>
            )) : showNoPlacesMessage && <p>주변에 해당 장소가 없습니다.</p>}
          </div>
        </section>
      </section>
    </main>
  );
}

export default DoingNow;