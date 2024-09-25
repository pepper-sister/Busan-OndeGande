import React, { useEffect, useState, useRef  } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MakingCourse.css';

function MakingCourse() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const clipboardBtnRef = useRef(null);

  const [activeButtonIndex, setActiveButtonIndex] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  const addDay = () => {
    if (days.length >= 10) {
      alert("Day는 최대 10일까지 추가할 수 있습니다.");
      return;
    }
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1);
  };

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756),
        level: 3,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);

      const iw = new window.kakao.maps.InfoWindow({ zIndex: 1 });
      setInfoWindow(iw);
    } else {
      console.error('카카오 맵 API를 로드할 수 없습니다.');
    }
  }, []);

  /* 마커 변함
  const changeMarkerAndCenter = (marker, place, index) => {
    if (!map) return;

    const width = 35;
    const height = width * (1064 / 735);

    const redIcon = new window.kakao.maps.MarkerImage(
      'https://raw.githubusercontent.com/Ha-seunga/MYpublic/main/imgDATA/HandmadeIMG2_re.png',
      new window.kakao.maps.Size(width, height),
      { offset: new window.kakao.maps.Point(27, 69) }
    );

    const originalMarker = selectedMarker;

    if (originalMarker) {
    originalMarker.setImage(originalMarker.originalImage);
    originalMarker.setZIndex(1);
    }

    marker.setImage(redIcon);
    marker.setZIndex(10);
    setActiveButtonIndex(index);
    marker.setMap(map);

    const newCenter = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(newCenter);

    const content = `<div style="padding:5px;">${place.place_name}</div>`;
    infoWindow.setContent(content);
    infoWindow.setPosition(marker.getPosition());
    infoWindow.open(map, marker);

    setSelectedMarker(marker);
  };*/
  
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
    if (!window.kakao || !window.kakao.maps) return;

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
    });
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
                      onClick={() => handlePlaceClick(place)} //style={{ backgroundColor: activeButtonIndex === index ? 'gray' : 'white' }}
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
            <button className="kakao-button" onClick={getShareLink}>카카오톡으로 공유</button>
          </section>

          <section className="MCday-section">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="day-wrapper">
                {days.map((day, dayIndex) => (
                  <Droppable key={dayIndex} droppableId={`${dayIndex}`}>
                    {(provided) => (
                      <div
                        className="day-container"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        <div className="day-header">
                          <h3>{day.title}</h3>
                          <button className="delete-day-button" onClick={() => deleteDay(dayIndex)}>ㅡ</button>
                        </div>
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
