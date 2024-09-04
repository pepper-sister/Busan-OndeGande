import React, { useEffect, useState } from 'react';
import './MakingCourse.css';

function MakingCourse() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {

    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756), // 지도의 초기 중심 좌표
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
      setMap(mapInstance);
    } else {
      console.error('카카오 맵 API를 로드할 수 없습니다.');
    }
  }, []);

  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    const keyword = document.getElementById('keyword').value;

    ps.keywordSearch(keyword, (data, status, pagination) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data);
        displayMarkers(data);
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  const displayMarkers = (places) => {
    if (!map) return;

    const bounds = new window.kakao.maps.LatLngBounds();

    places.forEach((place) => {
      const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);
      bounds.extend(markerPosition);
    });

    map.setBounds(bounds);
  };

  const addCourse = (place) => {
    setCourses([...courses, place]);
  };

  const deleteCourse = (indexToRemove) => {
    setCourses(courses.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="events-container">
      <div className="sidebar-left">
        <h2>장소 추가</h2>
        <input
          type="text"
          id="keyword"
          className="search-input"
          placeholder="장소 검색"
        />
        <button className="search-button" onClick={searchPlaces}>
          검색
        </button>
        <ul>
          {places.map((place, index) => (
            <li key={index}>
              {place.place_name}
              <button className="add-button" onClick={() => addCourse(place)}>+</button>
            </li>
          ))}
        </ul>
      </div>

      <div id="map" className="map-container2"></div>

      <div className="sidebar-right">
        <h2>현재 코스</h2>
        <ul>
          {courses.map((course, index) => (
            <li key={index}>
              {course.place_name}
              <button
                className="delete-button"
                onClick={() => deleteCourse(index)}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MakingCourse;
