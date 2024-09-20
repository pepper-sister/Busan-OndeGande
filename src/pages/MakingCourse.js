import React, { useEffect, useState, useRef  } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // drag and drop 때문에 추가
import './MakingCourse.css';

function MakingCourse() {
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [days, setDays] = useState([]); //useState([{ title: 'Day 1', courses: [] }]); //DAY1 드래그 앤 드롭을 위해 제거
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [sidebarLeftVisible, setSidebarLeftVisible] = useState(true); // 상태 추가
  const [sidebarRightVisible, setSidebarRightVisible] = useState(true); // 상태 추가
  const clipboardBtnRef = useRef(null);

  // addDay를 useCallback으로 감싸서 의존성 문제 해결 했던것 ver 3
  /*
  const addDay = useCallback(() => {
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1);
  }, [days]);*/

  // addDay가 "일자 추가"버튼을 눌러야만 생성이 되고,MAx일정이 10개로 설정한 코드 ver 4
  const addDay = () => {
    if (days.length >= 10) {
      alert("일자는 최대 10개까지 추가할 수 있습니다."); // 10개 이상 추가하려고 하면 경고
      return;
    }
    const newDayIndex = days.length + 1;
    const updatedDays = [...days, { title: `Day ${newDayIndex}`, courses: [] }];
    setDays(updatedDays);
    setSelectedDayIndex(updatedDays.length - 1); // 새로 추가된 Day를 선택된 Day로 설정
  };

//DAY 1 drag drop을 위해 다른 days처럼 동작하게끔 아래코드 추가
  useEffect(() => {
    // 컴포넌트가 마운트될 때 Day 1을 동적으로 추가
    // 이를 통해 Day 1을 다른 Day들과 동일한 방식으로 추가
    //addDay(); 
  }, []);

  useEffect(() => {
    // 카카오 맵을 로드하여 맵을 초기화하는 부분
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

  /*카카오 공유를 위해 추가한 코드*/
 // index.js에서 한 번 초기화한 경우, 다른 컴포넌트에서는 아래처럼 확인만 하고 초기화하지 않음
 useEffect(() => {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init('32409dc8712c4b31d8017f4ad5dc076a');
  }
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
    //경고문 추가
    if (days.length === 0) {
      alert("일자를 먼저 추가하세요."); // 수정, 추가
      return;
    }


    const updatedDays = [...days];
    updatedDays[selectedDayIndex].courses.push({
      name: place.place_name,
      lat: place.y,
      lng: place.x,

      //추가
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
    //Day의 타이틀을 Day 1 , Day 2등으로 순차적으로 업데이트하는 함수. 
    const updatedDays = daysArray.map((day, index) => ({
      ...day,
      title: `Day ${index + 1}`
    }));
    setDays(updatedDays);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
  
    if (!destination) return; // 드래그가 목적지로 떨어지지 않으면 아무 작업도 하지 않음
  
    const updatedDays = [...days];
    const sourceDayIndex = Number(source.droppableId);
    const destinationDayIndex = Number(destination.droppableId);
  
    if (sourceDayIndex === destinationDayIndex) {
      // 같은 Day 내에서 코스 순서 변경하는 경우
      const day = updatedDays[sourceDayIndex];
      const [movedCourse] = day.courses.splice(source.index, 1);
      day.courses.splice(destination.index, 0, movedCourse);
      
      // 코스의 순서를 1부터 다시 설정
      day.courses = day.courses.map((course, index) => ({
        ...course,
        order: index + 1
      }));
  
      setDays(updatedDays);
    } else {
      // 다른 Day로 코스를 이동하는 경우
      const sourceDay = updatedDays[sourceDayIndex];
      const destinationDay = updatedDays[destinationDayIndex];
  
      const [movedCourse] = sourceDay.courses.splice(source.index, 1);
      destinationDay.courses.splice(destination.index, 0, movedCourse);
      
      // 코스 순서를 다시 설정 (각 Day에서)
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
    updateDayTitles(updatedDays);   // 드래그 앤 드롭 후 Day 타이틀 업데이트
  };

  const generateShareText = () => {
    return days.map(day => 
      `${day.title}\n${day.courses.map(course => (
        `${course.order}. ${course.name}\n위도: ${course.lat}\n경도: ${course.lng}\n`
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
    //const shareText = generateShareText();              // 이건 링크로 보낼 때 사용 (카카오톡)
    //const encodedText = encodeURIComponent(shareText);  // 이건 링크로 보낼 때 사용 (카카오톡)
  
    // 카카오톡 공유 API 호출 예시
    const kakaoLink = () => {
      if (!window.Kakao) {
        console.error('Kakao 객체를 찾을 수 없습니다.');
        return;
      }
      /*
      //링크로 공유하기 일때
      window.Kakao.Share.sendDefault({
        objectType: 'list',
        headerTitle: '여행 코스',
        headerLink: {
          mobileWebUrl: 'https://www.ondegande.site',
          webUrl: 'https://www.ondegande.site',
        },
        contents: days.map(day => ({
          title: day.title,
          description: day.courses.map(course => `${course.order}. ${course.name}`).join('\n'),
          imageUrl: 'http://k.kakaocdn.net/dn/bDPMIb/btqgeoTRQvd/49BuF1gNo6UXkdbKecx600/kakaolink40_original.png',
          link: {
            mobileWebUrl: 'https://www.ondegande.site',
            webUrl: 'https://www.ondegande.site',
          },
        })),
        buttons: [
          {
            title: '웹으로 보기',
            link: {
              mobileWebUrl: 'https://www.ondegande.site',
              webUrl: 'https://www.ondegande.site',
            },
          },
        ],
      });
      */

     
      //텍스트로 공유하기
      window.Kakao.Share.sendDefault({
        objectType: 'text',
        text: generateShareText(), // 텍스트 공유 설정
        link: {
          mobileWebUrl: 'https://www.ondegande.site',
          webUrl: 'https://www.ondegande.site',
        },
      });
      
    };

    return {
      kakaoTalkLink: kakaoLink
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
            <h2>코스 관리</h2>
            <DragDropContext onDragEnd={onDragEnd}>
              {days.map((day, dayIndex) => (
                <Droppable key={dayIndex} droppableId={`${dayIndex}`}>
                  {(provided) => (
                    <div
                      className="day-container"
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <h3>{day.title}</h3>
                      <button onClick={() => deleteDay(dayIndex)}>일자 삭제</button>
                      {day.courses.map((course, courseIndex) => (
                        <Draggable
                        key={course.order} // `course.order`를 key로 사용
                        draggableId={`${dayIndex}-${course.order}`} // `course.order`를 draggableId로 사용
                        index={courseIndex}
                      >
                          {(provided) => (
                            <div
                              className="course-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {course.order}. {course.name} {course.region2} {course.region3} {course.region3h}
                              <button onClick={() => deleteCourse(dayIndex, courseIndex)}>삭제</button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
            <button onClick={addDay}>일자 추가</button>
            <button ref={clipboardBtnRef} data-clipboard-text={generateShareText()}>
              클립보드에 복사
            </button>
            <button onClick={getShareLink().kakaoTalkLink}>카카오톡 공유</button>
          </>
        )}
      </div>
    </div>
  );
}

export default MakingCourse;
