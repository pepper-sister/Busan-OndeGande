import React, { useEffect, useState, useRef } from 'react';
import './MakingCourse.css';

function MakingCourse() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [days, setDays] = useState([{ title: '당일치기', courses: [] }]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [sidebarLeftVisible, setSidebarLeftVisible] = useState(true); // 상태 추가
  const [sidebarRightVisible, setSidebarRightVisible] = useState(true); // 상태 추가
  const clipboardBtnRef = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    } else {
      console.error('카카오 맵 API를 로드할 수 없습니다.');
    }
  }, []);

  useEffect(() => {
    const ClipboardJS = require('clipboard');
    const clipboard = new ClipboardJS(clipboardBtnRef.current);

    clipboard.on('success', function (e) {
      alert('텍스트가 클립보드에 복사되었습니다.');
      e.clearSelection();
    });

    clipboard.on('error', function (e) {
      alert('클립보드 복사에 실패했습니다.');
    });

    return () => {
      clipboard.destroy();
    };
  }, []);

  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) return;

    const ps = new window.kakao.maps.services.Places();
    const keyword = document.getElementById('keyword').value;

    ps.keywordSearch(keyword, (data, status) => {
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
    const updatedDays = [...days];
    updatedDays[selectedDayIndex].courses.push({
      name: place.place_name,
      lat: place.y,
      lng: place.x,
      order: updatedDays[selectedDayIndex].courses.length + 1
    });
    setDays(updatedDays);
  };

  const deleteCourse = (dayIndex, indexToRemove) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].courses = updatedDays[dayIndex].courses
      .filter((_, index) => index !== indexToRemove)
      .map((course, index) => ({ ...course, order: index + 1 }));
    setDays(updatedDays);
  };

  const moveUpCourse = (dayIndex, index) => {
    if (index === 0) return;
    const updatedDays = [...days];
    const updatedCourses = [...updatedDays[dayIndex].courses];
    [updatedCourses[index], updatedCourses[index - 1]] = [updatedCourses[index - 1], updatedCourses[index]];
    updatedCourses.forEach((course, idx) => {
      course.order = idx + 1;
    });
    updatedDays[dayIndex].courses = updatedCourses;
    setDays(updatedDays);
  };

  const moveDownCourse = (dayIndex, index) => {
    if (index === days[dayIndex].courses.length - 1) return;
    const updatedDays = [...days];
    const updatedCourses = [...updatedDays[dayIndex].courses];
    [updatedCourses[index], updatedCourses[index + 1]] = [updatedCourses[index + 1], updatedCourses[index]];
    updatedCourses.forEach((course, idx) => {
      course.order = idx + 1;
    });
    updatedDays[dayIndex].courses = updatedCourses;
    setDays(updatedDays);
  };

  const addDay = () => {
    const newDayIndex = days.length + 1;
    setDays([...days, { title: `${newDayIndex}일차`, courses: [] }]);
    setSelectedDayIndex(days.length); // 새로 추가된 일자를 선택
  };

  const generateShareText = () => {
    return days.map(day => 
      `${day.title}\n${day.courses.map(course => (
        `${course.order}. ${course.name}\n위도: ${course.lat}\n경도: ${course.lng}\n`
      )).join('\n')}`
    ).join('\n\n');
  };

  const getShareLink = () => {
    const shareText = generateShareText();
    const encodedText = encodeURIComponent(shareText);
    return {
      googleDocs: `https://docs.google.com/document/create?usp=sharing&title=여행 코스&body=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedText}`
    };
  };

  return (
    <div className="events-container">
      <div className={`sidebar-left ${sidebarLeftVisible ? 'visible' : 'hidden'}`}>
        <button className="toggle-sidebar-button-left" onClick={() => setSidebarLeftVisible(!sidebarLeftVisible)}>
          {sidebarLeftVisible ? '◄' : '►'}
        </button>
        {sidebarLeftVisible && (
          <>
            <h2>장소 추가</h2>
            <input
              type="text"
              id="keyword"
              className="search-input"
              placeholder="장소 검색"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  searchPlaces();
                }
              }}
            />
            <button className="search-button" onClick={searchPlaces}>
              검색
            </button>
            <ul>
              {places.map((place, index) => (
                <li key={index} className="place-item">
                  {place.place_name}
                  <button className="add-button" onClick={() => addCourse(place)}>+</button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div id="map" className={`map-container ${!sidebarLeftVisible && !sidebarRightVisible ? 'expanded' : ''}`}></div>

      <div className={`sidebar-right ${sidebarRightVisible ? 'visible' : 'hidden'}`}>
        <button className="toggle-sidebar-button-right" onClick={() => setSidebarRightVisible(!sidebarRightVisible)}>
          {sidebarRightVisible ? '►' : '◄'}
        </button>
        {sidebarRightVisible && (
          <>
            <div className="day-selector">
              <button onClick={addDay}>일자 추가하기</button>
            </div>
            {days.map((day, dayIndex) => (
              <div key={dayIndex}>
                <h2>{day.title}</h2>
                <ul>
                  {day.courses.map((course, index) => (
                    <li key={index} className="course-item">
                      <div className="course-header">
                        <strong>{course.order}. {course.name}</strong>
                        <button className="delete-button" onClick={() => deleteCourse(dayIndex, index)}>삭제</button>
                      </div>
                      <div className="course-coordinates">
                        <p>위도: {course.lat}</p>
                        <p>경도: {course.lng}</p>
                        <div className="move-buttons">
                          <button 
                            className="move-up-button"
                            onClick={() => moveUpCourse(dayIndex, index)}
                            disabled={index === 0}
                          >
                            ▲
                          </button>
                          <button 
                            className="move-down-button"
                            onClick={() => moveDownCourse(dayIndex, index)}
                            disabled={index === day.courses.length - 1}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="share-links">
              <button 
                ref={clipboardBtnRef} 
                data-clipboard-text={generateShareText()} 
                className="share-link-button"
              >
                클립보드에 복사
              </button>
              <a href={getShareLink().twitter} target="_blank" rel="noopener noreferrer" className="share-link-button">
                트위터로 공유
              </a>
    
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MakingCourse;
