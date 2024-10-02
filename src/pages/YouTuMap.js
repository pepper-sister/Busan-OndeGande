import React, { useEffect } from 'react';

function YouTuMap({ places, mapId }) {
  useEffect(() => {
    const loadKakaoMap = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=4024b56f46a66c1de59c6633dacea643&libraries=services&autoload=false`;
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
      const mapContainer = document.getElementById(mapId);
      const mapOption = {
        center: new window.kakao.maps.LatLng(places[0].latitude, places[0].longitude),
        level: 3,
      };

      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      const bounds = new window.kakao.maps.LatLngBounds();
      const linePath = [];
      const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });

      let activeMarker = null;

      places.forEach((place, index) => {
        const markerPosition = new window.kakao.maps.LatLng(place.latitude, place.longitude);

        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png';
        const imageSize = new window.kakao.maps.Size(36, 37);
        const imgOptions = {
          spriteSize: new window.kakao.maps.Size(36, 691),
          spriteOrigin: new window.kakao.maps.Point(0, (index * 46) + 10),
          offset: new window.kakao.maps.Point(13, 37),
        };

        const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
          image: markerImage,
        });

        marker.setMap(map);

        window.kakao.maps.event.addListener(marker, 'mouseover', () => {
          infowindow.setContent(`<div style="padding:5px;">${place.name}</div>`);
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', () => {
          infowindow.close();
        });

        window.kakao.maps.event.addListener(marker, 'click', () => {
          if (activeMarker && activeMarker !== marker) {
            infowindow.close();
          }
          infowindow.setContent(`<div style="padding:5px;">${place.name}</div>`);
          infowindow.open(map, marker);
          activeMarker = marker;
        });

        linePath.push(markerPosition);
        bounds.extend(markerPosition);
      });

      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: '#4373D0',
        strokeOpacity: 0.8,
        strokeStyle: 'solid',
      });

      polyline.setMap(map);
      map.setBounds(bounds);

      window.kakao.maps.event.addListener(map, 'click', () => {
        if (activeMarker) {
          infowindow.open(map, activeMarker);
        }
      });
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

  }, [places, mapId]);

  return <div id={mapId} style={{ width: '100%', height: '30vh' }}></div>;
}

export default YouTuMap;
