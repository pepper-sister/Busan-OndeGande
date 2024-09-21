import React, { useEffect } from 'react';

const { kakao } = window;

function YouTuMap({ places, mapId }) {
  useEffect(() => {
    const mapContainer = document.getElementById(mapId);
    const mapOption = {
      center: new kakao.maps.LatLng(places[0].latitude, places[0].longitude),
      level: 3,
    };

    const map = new kakao.maps.Map(mapContainer, mapOption);

    const bounds = new kakao.maps.LatLngBounds();
    const linePath = [];
    const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

    let activeMarker = null;

    places.forEach((place, index) => {
      const markerPosition = new kakao.maps.LatLng(place.latitude, place.longitude);

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

      kakao.maps.event.addListener(marker, 'mouseover', () => {
        if (activeMarker !== marker) {
          infowindow.setContent(`<div style="padding:5px;">${place.name}</div>`);
          infowindow.open(map, marker);
        }
      });

      kakao.maps.event.addListener(marker, 'mouseout', () => {
        if (activeMarker !== marker) {
          infowindow.close();
        }
      });

      kakao.maps.event.addListener(marker, 'click', () => {
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

    const polyline = new kakao.maps.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#4373D0',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    polyline.setMap(map);
    map.setBounds(bounds);

    kakao.maps.event.addListener(map, 'click', () => {
      if (activeMarker) {
        infowindow.open(map, activeMarker);
      }
    });

  }, [places, mapId]);

  return <div id={mapId} style={{ width: '100%', height: '30vh' }}></div>;
}

export default YouTuMap;
