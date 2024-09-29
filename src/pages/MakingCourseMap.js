import React, { useEffect, useRef } from 'react';

const { kakao } = window;

function MakingCourseMap({ courses, mapId }) {
  const markersRef = useRef([]); // 마커를 저장할 참조 생성
  const mapRef = useRef(null); // 맵을 저장할 참조 생성
  const polylineRef = useRef(null); // 경로를 저장할 참조 생성

  useEffect(() => {
    if (!courses || courses.length === 0) return; // 코스가 없으면 아무것도 하지 않음

    const mapContainer = document.getElementById(mapId); // 지도를 표시할 DOM 요소

    // 첫 번째 코스의 위치를 중심으로 설정
    if (!mapRef.current) {
      const mapOption = {
        center: new kakao.maps.LatLng(courses[0].lat, courses[0].lng),
        level: 3,
      };

      // 맵을 초기화하고 참조에 저장
      mapRef.current = new kakao.maps.Map(mapContainer, mapOption);
    } else {
      // 이미 맵이 초기화된 경우 중심 위치를 재설정
      mapRef.current.setCenter(new kakao.maps.LatLng(courses[0].lat, courses[0].lng));
    }

    const map = mapRef.current;
    const bounds = new kakao.maps.LatLngBounds(); // 바운드 객체 생성
    const linePath = [];
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 }); // 추가: 정보창 객체 생성
    let activeMarker = null; // 추가: 클릭된 마커 저장 변수

    // 기존의 모든 마커를 제거
    markersRef.current.forEach(marker => {
      marker.setMap(null); // 지도에서 제거
    });
    markersRef.current = []; // 마커 배열 초기화

    // 기존의 폴리라인이 있다면 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null); // 지도에서 폴리라인 제거
    }

    courses.forEach((course, index) => {
      const markerPosition = new kakao.maps.LatLng(course.lat, course.lng);

      const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
      const imageSize = new kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new kakao.maps.Size(36, 691),
        spriteOrigin: new kakao.maps.Point(0, (index * 46) + 10),
        offset: new kakao.maps.Point(13, 37),
      };

      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
      const marker = new kakao.maps.Marker({
        position: markerPosition,
        image: markerImage,
      });

      marker.setMap(map);
      markersRef.current.push(marker);

      // 마커에 마우스 오버 시 정보창 표시
      kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.setContent(`<div style="padding:5px;">${course.name}</div>`);
        infowindow.open(map, marker);
      });

      // 마커에서 마우스 아웃 시 정보창 닫기
      kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      // 마커 클릭 시 해당 마커에 정보창 열기
      kakao.maps.event.addListener(marker, 'click', () => {
        if (activeMarker) {
          infowindow.close();
        }
        infowindow.setContent(`<div style="padding:5px;">${course.name}</div>`);
        infowindow.open(map, marker);
        activeMarker = marker;
      });

      linePath.push(markerPosition); // 경로에 마커 위치 추가
      bounds.extend(markerPosition); // 경계 확장
    });

    // 새로운 폴리라인을 생성하고 지도에 추가
    polylineRef.current = new kakao.maps.Polyline({
      path: linePath, // 경로 설정
      strokeWeight: 5, // 경로 두께
      strokeColor: '#4373D0', // 경로 색상
      strokeOpacity: 0.8, // 경로 불투명도
      strokeStyle: 'solid', // 경로 스타일
    });

    polylineRef.current.setMap(map); // 지도에 폴리라인 추가
    map.setBounds(bounds); // 지도 경계 설정
  }, [courses, mapId]); // courses가 변경될 때마다 useEffect가 실행됨

  return <div id={mapId} style={{ width: '100%', height: '30vh' }}></div>; // 지도 컨테이너 설정
}

export default MakingCourseMap;
