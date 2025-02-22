import React, { useEffect, useRef, useState } from 'react';

function MakingCourseMap({ courses, mapId }) {
  const [isMapVisible, setIsMapVisible] = useState(courses.length > 0);
  const markersRef = useRef([]);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (courses.length === 0) {
      setIsMapVisible(false);
      return;
    }

    // 💡 지도 컨테이너가 존재하도록 만든 후, Kakao 지도 로딩
    if (!isMapVisible) {
      setIsMapVisible(true);
      return;
    }

    const { kakao } = window;

    const loadKakaoMap = () => {
      if (typeof kakao !== 'undefined' && kakao.maps) {
        setTimeout(() => initMap(kakao), 0); // 💡 setTimeout을 사용해 다음 렌더링에서 지도 로드
      } else {
        console.error('Kakao Maps SDK is not loaded properly.');
      }
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`;
      script.async = true;
      script.onload = loadKakaoMap;
      document.body.appendChild(script);
    } else {
      loadKakaoMap();
    }

    function initMap(kakao) {
      clearMap();

      const mapContainer = document.getElementById(mapId);
      if (!mapContainer) return;

      const map = new kakao.maps.Map(mapContainer, {
        center: new kakao.maps.LatLng(courses[0].lat, courses[0].lng),
        level: 3,
      });

      mapRef.current = map;
      const bounds = new kakao.maps.LatLngBounds();
      const linePath = [];
      const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });
      let activeMarker = null;

      courses.forEach((course, index) => {
        const marker = addMarker(kakao, map, course, index, infowindow, activeMarker);
        linePath.push(marker.getPosition());
        bounds.extend(marker.getPosition());
      });

      polylineRef.current = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#4373D0',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });

      polylineRef.current.setMap(map);
      map.setBounds(bounds);
    }

    function addMarker(kakao, map, course, index, infowindow, activeMarker) {
      const markerPosition = new kakao.maps.LatLng(course.lat, course.lng);
      const markerImage = new kakao.maps.MarkerImage(
        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        new kakao.maps.Size(36, 37),
        {
          spriteSize: new kakao.maps.Size(36, 691),
          spriteOrigin: new kakao.maps.Point(0, index * 46 + 10),
          offset: new kakao.maps.Point(13, 37),
        }
      );

      const marker = new kakao.maps.Marker({ position: markerPosition, image: markerImage });
      marker.setMap(map);
      markersRef.current.push(marker);

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        infowindow.setContent(`<div style="padding:5px;">${course.name}</div>`);
        infowindow.open(map, marker);
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        infowindow.close();
      });

      kakao.maps.event.addListener(marker, 'click', () => {
        if (activeMarker) infowindow.close();
        infowindow.setContent(`<div style="padding:5px;">${course.name}</div>`);
        infowindow.open(map, marker);
        activeMarker = marker;
      });

      return marker;
    }

    function clearMap() {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (polylineRef.current) polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    return () => clearMap();
  }, [courses, mapId, isMapVisible]);

  return isMapVisible ? <div id={mapId} style={{ width: '100%', height: '30vh' }}></div> : null;
}

export default MakingCourseMap;
