import React, { useEffect, useState, useRef  } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './MakingCourse.css';

function MakingCourse() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [days, setDays] = useState([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const clipboardBtnRef = useRef(null);

  // 클릭한 장소를 시각화 하기 위한 코드 추가 2024.09.22
  const [markers, setMarkers] = useState([]); // 마커들을 저장할 상태
  const [selectedMarker, setSelectedMarker] = useState(null); // 선택된 마커 상태

  //2024.09.22 ver 4 리스트에 효과 넣기, 
  const [activeButtonIndex, setActiveButtonIndex] = useState(null); // 활성화된 버튼 인덱스

   // addDay가 "일자 추가"버튼을 눌러야만 생성이 되고,Max일정이 10개로 설정한 코드 ver 4
  const addDay = () => {
    if (days.length >= 10) {
      alert("일자는 최대 10개까지 추가할 수 있습니다.");
      return;
    }
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1);
  };

  /* 
  //이 코드는 왜 없어진거지?
  //DAY 1 drag drop을 위해 다른 days처럼 동작하게끔 아래코드 추가
  useEffect(() => {
    // 컴포넌트가 마운트될 때 Day 1을 동적으로 추가
    // 이를 통해 Day 1을 다른 Day들과 동일한 방식으로 추가
    //addDay(); 
  }, []);
*/

  useEffect(() => {
    // 카카오 맵을 로드하여 맵을 초기화하는 부분
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById('map');
      const options = {
        center: new window.kakao.maps.LatLng(35.1796, 129.0756),
        level: 8,
      };
      const mapInstance = new window.kakao.maps.Map(container, options);
      setMap(mapInstance);
    } else {
      console.error('카카오 맵 API를 로드할 수 없습니다.');
    }
  }, []);

  //새로운 addDay 함수 였던 것.
  /*
  const addDay = () => {
    // 새로운 Day를 추가하는 함수
    // days 배열의 길이에 따라 Day 1, Day 2 등의 타이틀을 자동으로 지정
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1); // 새로 추가된 Day를 선택된 Day로 설정
  };
*/
    //기존 addDay함수
    /*
    const addDay = () => {
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1);
  };
  */

  //마커 효과 ( 검색 => 장소명 클릭 시 나오는 효과) 2024.09.22
  // 마커를 클릭할 때 마커 색을 빨간색으로 변경하고 지도 중심을 업데이트하는 함수
  const changeMarkerAndCenter = (marker, place, index) => {
    if (!map) return;

    // 이전에 선택된 마커의 색을 원래대로 돌립니다.
    if (selectedMarker) {
      selectedMarker.setImage(null); // 원래 이미지로 변경

      //2024.09.22 ver 2 <마커 스타일 조정>
      selectedMarker.setZIndex(1); // 원래 z-index로 변경
    }

    // 2024.09.22 ver 2  새로운 마커를 선택된 마커로 설정하고 크기를 1.2배로 변경합니다.
    //const size = new window.kakao.maps.Size(76, 83); // 기존 마커의 크기 64x69의 1.2배
    const width = 35; // 원하는 가로 크기
    const height = width * (1064 / 735); // 원래 비율에 맞춰 세로 크기 계산

    // 새로운 마커를 선택된 마커로 설정하고 색을 빨간색으로 변경합니다.
    const redIcon = new window.kakao.maps.MarkerImage(
      //'https://raw.githubusercontent.com/Ha-seunga/MYpublic/main/imgDATA/HandmadeIMG.png',
      'https://raw.githubusercontent.com/Ha-seunga/MYpublic/main/imgDATA/HandmadeIMG2_re.png',
      //'http://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png', // 빨간색 마커 이미지
      //new window.kakao.maps.Size(64, 69), // 이미지 크기
      //size, // 이미지 크기 // 2024.09.22 ver 2
      new window.kakao.maps.Size(width, height), // 원하는 크기 조정
      { offset: new window.kakao.maps.Point(27, 69) }
    );

    marker.setImage(redIcon);
    
    // 2024.09.22 ver 2
    marker.setZIndex(10); // 선택된 마커의 z-index를 높여서 위에 위치하도록 설정
    
    setSelectedMarker(marker);
    setActiveButtonIndex(index); // 2024.09.22 ver4: 활성화된 버튼 인덱스 설정

    // 지도 중심을 클릭한 장소로 이동시킵니다.
    const newCenter = new window.kakao.maps.LatLng(place.y, place.x);
    map.setCenter(newCenter);
  };

  // 수정한 코드 2024.09.22 for 검색리스트 장소명 클릭시 마커 표시
  const displayMarkers = (places) => {
    if (!map) return;

    // 기존 마커를 지우기 위해 마커 배열을 순회하여 지도에서 제거
    markers.forEach(marker => {
      marker.setMap(null);
    });

    const bounds = new window.kakao.maps.LatLngBounds();
    const newMarkers = []; // 새로운 마커 배열을 생성

    places.forEach((place, index) => {
      const markerPosition = new window.kakao.maps.LatLng(place.y, place.x);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });

      marker.setMap(map); // 마커를 지도에 표시합니다.
      newMarkers.push(marker); // <<이 부분 추가>> 마커를 배열에 추가
      
      // <<이 부분 추가>> 마커 클릭 이벤트 추가
      window.kakao.maps.event.addListener(marker, 'click', () => {
        changeMarkerAndCenter(marker, place, index); // index 추가 2024.09.22 ver 4
      });

      bounds.extend(markerPosition);
    });

    setMarkers(newMarkers); //  마커 배열을 상태에 저장
    map.setBounds(bounds);
  };

  // 장소 리스트를 클릭할 때 마커 색상을 바꾸고 중심을 이동하는 함수
  //2024.09.22 index 추가
  const handlePlaceClick = (place, index) => {
    const markerIndex = places.findIndex(p => p.place_name === place.place_name);
    if (markerIndex >= 0) {
      const marker = markers[markerIndex];
      changeMarkerAndCenter(marker, place, index); // 2024.09.22 ver 4 : 인덱스 추가
    }
  };

  //여기까지

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
        setPlaces(data.slice(0, 6));
        displayMarkers(data.slice(0, 6));
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  };

  /*
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
*/
  const addCourse = (place) => {
    if (days.length === 0) {
      alert("일자를 먼저 추가하세요.");
      return;
    }

    const updatedDays = [...days];
    updatedDays[selectedDayIndex].courses.push({
      name: place.place_name,
      lat: place.y,
      lng: place.x,


      road_address_name: place.road_address_name || '도로명 주소 없음', // 도로명 주소 추가
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
        //`위도: ${course.lat}\n` +
       // `경도: ${course.lng}\n` +
        `도로명 주소: ${course.road_address_name || '도로명 주소 없음'}\n` + // 도로명 주소 추가
        `${course.region3 ? `행정동: ${course.region3}` : ''}` // 행정동 추가
      )).join('\n')}`
    ).join('\n\n');

    /*
    //카카오맵 api 분석후 다시 수정할예쩡
    return days.map(day => 
      `${day.title}\n${day.courses.map(course => (
        `${course.order}. ${course.name} ${course.region2} ${course.region3} ${course.region3h}\n위도: ${course.lat}\n경도: ${course.lng}\n`
      )).join('\n')}` 
    ).join('\n\n');
    */
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
                      onClick={() => handlePlaceClick(place)}
                      style={{ backgroundColor: activeButtonIndex === index ? 'gray' : 'white' }} >
                        <li>
                          <div className="place-name" style={{ fontWeight: 'bold', fontSize: '18px' }}>
                            {place.place_name}
                          </div>
                          {place.region_3depth_name && (
                            <div className="place-region" style={{ fontSize: '13px' }}>
                              행정동: {place.region_3depth_name}
                            </div>
                          )}
                          <div className="place-address" style={{ fontSize: '13px' }}>
                            도로명 주소: {place.road_address_name || '도로명 주소 없음'}
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
                                {course.order}. {course.name}<br />
                                도로명 주소: {course.road_address_name || '도로명 주소 없음'}<br />
                                {course.region3 && `행정동: ${course.region3}`} {/* 행정동이 있을 때만 출력 */}
    
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
