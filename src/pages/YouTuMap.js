import React, { useEffect } from 'react';

const loadKakaoMap = () =>
  new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) return resolve();
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
    script.onload = () => (window.kakao?.maps ? resolve() : reject(new Error('Kakao Maps API 로드 실패')));
    script.onerror = () => reject(new Error('Kakao Maps API 스크립트 로드 오류'));
    document.head.appendChild(script);
  });

function YouTuMap({ places, mapId }) {
  useEffect(() => {
    if (!places || places.length === 0) return;

    loadKakaoMap()
      .then(() => {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById(mapId);
          const mapOption = {
            center: new window.kakao.maps.LatLng(places[0].latitude, places[0].longitude),
            level: 3,
          };

          const map = new window.kakao.maps.Map(mapContainer, mapOption);
          const bounds = new window.kakao.maps.LatLngBounds();
          const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
          let activeMarker = null;

          const createMarker = (place, index) => {
            const position = new window.kakao.maps.LatLng(place.latitude, place.longitude);
            const markerImage = new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
              new window.kakao.maps.Size(36, 37),
              {
                spriteSize: new window.kakao.maps.Size(36, 691),
                spriteOrigin: new window.kakao.maps.Point(0, (index * 46) + 10),
                offset: new window.kakao.maps.Point(13, 37),
              }
            );

            const marker = new window.kakao.maps.Marker({ position, image: markerImage });
            marker.setMap(map);
            bounds.extend(position);

            window.kakao.maps.event.addListener(marker, 'mouseover', () => {
              infowindow.setContent(`<div style="padding:5px;">${place.name}</div>`);
              infowindow.open(map, marker);
            });

            window.kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

            window.kakao.maps.event.addListener(marker, 'click', () => {
              if (activeMarker && activeMarker !== marker) infowindow.close();
              infowindow.setContent(`<div style="padding:5px;">${place.name}</div>`);
              infowindow.open(map, marker);
              activeMarker = marker;
            });

            return position;
          };

          const linePath = places.map(createMarker);

          const drawPolyline = (path) => {
            new window.kakao.maps.Polyline({
              path,
              strokeWeight: 5,
              strokeColor: '#4373D0',
              strokeOpacity: 0.8,
              strokeStyle: 'solid',
            }).setMap(map);
          };

          drawPolyline(linePath);
          map.setBounds(bounds);

          window.kakao.maps.event.addListener(map, 'click', () => {
            if (activeMarker) infowindow.open(map, activeMarker);
          });
        });
      })
      .catch((error) => alert(error.message));
  }, [places, mapId]);

  return <div id={mapId} style={{ width: '100%', height: '30vh' }}></div>;
}

export default YouTuMap;