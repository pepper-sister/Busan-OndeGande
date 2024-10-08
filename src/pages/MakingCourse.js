import React, { useEffect, useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MakingCourse.css';
import MakingCourseMap from './MakingCourseMap';

function MakingCourse() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const clipboardBtnRef = useRef(null);

  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  const [isMapVisible, setIsMapVisible] = useState(false);
  const dayContainerRef = useRef([]);

  const [showTip, setShowTip] = useState(false);
  const [clicked, setClicked] = useState(false);

  const toggleAllMapsVisibility = () => {
    if (days.length === 0) {
      alert("Day를 추가해주세요.");
      setIsMapVisible(false);
      return;
    }

    setIsMapVisible(prev => !prev);
  };

  const addDay = () => {
    if (days.length >= 10) {
      alert("Day는 최대 10일까지 추가할 수 있습니다.");
      return;
    }
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1);

    setTimeout(() => {
      const newDayContainer = dayContainerRef.current[newDayIndex - 1];
      if (newDayContainer) {
        newDayContainer.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
  };

  const debounce = (func, wait) => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func();
      }, wait);
    };
  };

  useEffect(() => {
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

    const initializeMap = () => {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756),
        level: 5,
      };

      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);

      const iw = new window.kakao.maps.InfoWindow({ zIndex: 1 });
      setInfoWindow(iw);

      const handleResize = debounce(() => {
        mapInstance.relayout();
        mapInstance.setCenter(new window.kakao.maps.LatLng(35.1796, 129.0756));
      }, 200);
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
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

  const changeMarkerAndCenter = (marker, place, index) => {
    if (!map) return;

    const newCenter = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(newCenter);

    const content = `<div style="padding:5px;">${place.place_name}</div>`;
    infoWindow.setContent(content);
    infoWindow.setPosition(marker.getPosition());
    infoWindow.open(map, marker);

    setSelectedMarker(marker);
  };

  const combineRefs = (...refs) => (element) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    });
  };

  const displayMarkers = (places) => {
    if (!map) return;

    markers.forEach(marker => {
      marker.setMap(null);
    });

    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers = [];

    places.forEach((place, index) => {
      const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map);
      newMarkers.push(marker);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        changeMarkerAndCenter(marker, place, index);
      });

      bounds.extend(markerPosition);
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const handlePlaceClick = (place, index) => {
    if (selectedMarker === index) {
      setSelectedMarker(null);
    } else {
      setSelectedMarker(index);
    }
    const markerIndex = places.findIndex(p => p.place_name === place.place_name);
    if (markerIndex >= 0) {
      const marker = markers[markerIndex];
      changeMarkerAndCenter(marker, place, index);
    }
  };

  useEffect(() => {
    const ClipboardJS = require('clipboard');
    const clipboard = new ClipboardJS(clipboardBtnRef.current);

    clipboard.on('success', function (e) {
      alert('코스가 클립보드에 복사되었습니다.');
      e.clearSelection();
    });

    clipboard.on('error', function (e) {
      alert('장소를 추가해주세요.');
    });

    return () => {
      clipboard.destroy();
    };
  }, []);

  useEffect(() => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY);
        } catch (error) {
          console.error('Kakao SDK 초기화 오류:', error);
        }
      }
    } else {
      console.error('Kakao 객체를 찾을 수 없습니다.');
    }
  }, []);

  const searchPlaces = () => {
    if (!map) return;
    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) return;

    const ps = new window.kakao.maps.services.Places();
    const keyword = document.getElementById('keyword').value;

    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setPlaces(data.slice(0, 10));
        displayMarkers(data.slice(0, 10));
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  const addCourse = (place) => {
    if (days.length === 0) {
      alert("Day를 추가해주세요.");
      return;
    }

    const updatedDays = [...days];
    updatedDays[selectedDayIndex].courses.push({
      name: place.place_name,
      lat: place.y,
      lng: place.x,
      road_address_name: place.road_address_name || '주소 없음',
      region2: place.region_2depth_name,
      region3: place.region_3depth_name,
      region3h: place.region_3depth_h_name,
      order: updatedDays[selectedDayIndex].courses.length + 1
    });

    const day = updatedDays[selectedDayIndex];
    day.courses = day.courses.map((course, index) => ({
      ...course,
      order: index + 1
    }));
    setDays(updatedDays);
  };

  const deleteCourse = (dayIndex, indexToRemove) => {
    const updatedDays = [...days];
    updatedDays[dayIndex].courses = updatedDays[dayIndex].courses
      .filter((_, index) => index !== indexToRemove)
      .map((course, index) => ({ ...course, order: index + 1 }));
    setDays(updatedDays);
  };

  const deleteDay = (dayIndex) => {
    const updatedDays = [...days].filter((_, index) => index !== dayIndex);
    setDays(updatedDays);
    if (selectedDayIndex >= updatedDays.length) {
      setSelectedDayIndex(updatedDays.length - 1);
    }
    updateDayTitles(updatedDays);
  };

  const updateDayTitles = (daysArray) => {
    const updatedDays = daysArray.map((day, index) => ({
      ...day,
      title: `Day ${index + 1}`
    }));
    setDays(updatedDays);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedDays = [...days];
    const sourceDayIndex = Number(source.droppableId);
    const destinationDayIndex = Number(destination.droppableId);

    if (sourceDayIndex === destinationDayIndex) {
      const day = updatedDays[sourceDayIndex];
      const [movedCourse] = day.courses.splice(source.index, 1);
      day.courses.splice(destination.index, 0, movedCourse);

      day.courses = day.courses.map((course, index) => ({
        ...course,
        order: index + 1
      }));

      setDays(updatedDays);
    } else {
      const sourceDay = updatedDays[sourceDayIndex];
      const destinationDay = updatedDays[destinationDayIndex];

      const [movedCourse] = sourceDay.courses.splice(source.index, 1);
      destinationDay.courses.splice(destination.index, 0, movedCourse);

      sourceDay.courses = sourceDay.courses.map((course, index) => ({
        ...course,
        order: index + 1
      }));
      destinationDay.courses = destinationDay.courses.map((course, index) => ({
        ...course,
        order: index + 1
      }));

      setDays(updatedDays);
    }
    updateDayTitles(updatedDays);
  };

  const generateShareText = () => {
    return days.map(day =>
      `${day.title}\n${day.courses.map(course => (
        `${course.order}. ${course.name}\n` +
        `주소: ${course.road_address_name || '주소 없음'}\n`
      )).join('\n')}`
    ).join('\n\n');
  };

  const getShareLink = () => {
    if (!window.Kakao) {
      console.error('Kakao 객체를 찾을 수 없습니다.');
      return;
    }

    window.Kakao.Share.sendDefault({
      objectType: 'text',
      text: generateShareText(),
      link: {
        mobileWebUrl: 'https://www.ondegande.site',
        webUrl: 'https://www.ondegande.site',
      },
      buttons: [
        {
          title: '웹사이트 바로가기',
          link: {
            mobileWebUrl: 'https://www.ondegande.site',
            webUrl: 'https://www.ondegande.site',
          },
        }
      ]
    });
  };

  const handleMouseEnter = () => {
    setShowTip(true);
  };

  const handleMouseLeave = () => {
    if (!clicked) {
      setShowTip(false);
    }
  };

  const handleClick = () => {
    setClicked(prev => !prev);
  };

  return (
    <div>
      <main>
        <section className="MC-section">
          <section className="MCup-section">
            <section className="MCmap-section">
              <div id="map" className="map-container"></div>
            </section>

            <section className="MCplace-section">
              <div className="MCsearch-container">
                <h2>장소 추가</h2>
                <input
                  type="text"
                  id="keyword"
                  className="search-input"
                  placeholder="장소를 입력하세요."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      searchPlaces();
                    }
                  }}
                />
                <button className="search-button" onClick={searchPlaces}>
                  검색
                </button>

                {places.map((place, index) => (
                  <div className="MCpla-section" key={index}>
                    <ul className="place-item2"
                      onClick={() => handlePlaceClick(place)}
                    >
                      <li>
                        <div className="place-name2">
                          {place.place_name}
                        </div>
                        <div className="place-address2">
                          {place.road_address_name || '주소 없음'}
                        </div>
                      </li>
                    </ul>
                    <button className="add-button"
                      onClick={() => addCourse(place)}>+</button>
                  </div>
                ))}

              </div>

            </section>
          </section>

          <section className="MCbutton-group">
            <button className="day-button" onClick={addDay}>Day +</button>
            <button className="clipboard-button" ref={clipboardBtnRef} data-clipboard-text={generateShareText()}>클립보드에 복사</button>
            <button className="kakao-button" onClick={getShareLink}>카카오톡 공유하기</button>
            <button className="toggle-map-button" onClick={toggleAllMapsVisibility}>
              {isMapVisible ? "동선 숨기기" : "동선 확인"}
            </button>
          </section>

          <div style={{ textAlign: 'right', position: 'relative' }}>
            {showTip && (
              <div className="tip-window">
                <p>드래그로 장소 순서 변경 가능</p>
              </div>
            )}
            <button className="tip-button"
              onClick={handleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >Tip!</button>
          </div>

          <section className="MCday-section">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="day-wrapper">
                {days.map((day, dayIndex) => (
                  <Droppable key={dayIndex} droppableId={`${dayIndex}`}>
                    {(provided) => (
                      <div
                        className="day-container"
                        ref={combineRefs(
                          provided.innerRef,
                          (el) => (dayContainerRef.current[dayIndex] = el)
                        )}
                        {...provided.droppableProps}
                      >
                        <div className="day-header">
                          <h3>{day.title}</h3>
                          <button className="delete-day-button" onClick={() => deleteDay(dayIndex)}>ㅡ</button>
                        </div>
                        {isMapVisible && (
                          <div className="new-map-container" ref={el => dayContainerRef.current[dayIndex] = el}>
                            <MakingCourseMap courses={day.courses} mapId={`map-${dayIndex}`} />
                          </div>
                        )}
                        {day.courses.map((course, courseIndex) => (
                          <Draggable
                            key={course.order}
                            draggableId={`${dayIndex}-${course.order}-${course.name}`}
                            index={courseIndex}
                          >
                            {(provided) => (
                              <div
                                className="course-item"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <span className="course-name">{course.order}. {course.name}<br /></span>
                                <span className="course-address">{course.road_address_name || '주소 없음'}</span><br />

                                <button className="delete-place-button" onClick={() => deleteCourse(dayIndex, courseIndex)}>-</button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </div>
            </DragDropContext>
          </section>
        </section>
      </main>
    </div>
  );
}

export default MakingCourse;